from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, HTTPException, Query, Request, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import logging
import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import re
import uuid
from datetime import datetime, timezone
from prohibited_words import PROHIBITED_WORDS
import time
import hmac


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection with error handling
try:
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
except KeyError as e:
    raise RuntimeError(
        f"Missing required environment variable: {e}\n"
        f"Please create a .env file in the backend directory.\n"
        f"Copy env.example to .env and fill in your MongoDB credentials.\n"
        f"Sign up for free MongoDB Atlas at: https://www.mongodb.com/cloud/atlas"
    )

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Configure logging early so lifespan can use the logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Email Notification Helper
# ---------------------------------------------------------------------------
NOTIFY_EMAIL = os.environ.get('NOTIFY_EMAIL', '')     # e.g. dodolegacy1@gmail.com
NOTIFY_PASSWORD = os.environ.get('NOTIFY_PASSWORD', '')  # Gmail App Password (not your main password)

async def send_notification_email(subject: str, body: str) -> None:
    """Send a plain-text notification email in a background thread so it never blocks the request."""
    if not NOTIFY_EMAIL or not NOTIFY_PASSWORD:
        logger.debug("Email notifications not configured (NOTIFY_EMAIL / NOTIFY_PASSWORD missing).")
        return

    def _send():
        try:
            msg = MIMEMultipart()
            msg['From'] = NOTIFY_EMAIL
            msg['To'] = NOTIFY_EMAIL
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(NOTIFY_EMAIL, NOTIFY_PASSWORD)
                server.sendmail(NOTIFY_EMAIL, NOTIFY_EMAIL, msg.as_string())
            logger.info(f"Notification email sent: {subject}")
        except Exception as e:
            logger.warning(f"Failed to send notification email: {e}")

    # Run blocking SMTP in a thread so FastAPI stays non-blocking
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, _send)


# Debounced notifier. Every like/comment used to trigger a fresh Gmail SMTP
# login+send, so an attacker could flood the owner's inbox and exhaust the
# account's daily send quota (a real DoS). We now cap volume: at most one email
# globally per _EMAIL_GLOBAL_MIN_INTERVAL seconds, and at most one per dedupe key
# (image + event type) per _EMAIL_KEY_COOLDOWN seconds. This keeps the owner
# informed of activity while making the endpoints useless as an amplifier.
_EMAIL_GLOBAL_MIN_INTERVAL = 180   # <= ~480 emails/day worst case, under Gmail's limit
_EMAIL_KEY_COOLDOWN = 600
_email_last_global = 0.0
_email_last_by_key: dict[str, float] = {}

async def notify_owner(dedupe_key: str, subject: str, body: str) -> None:
    global _email_last_global
    now = time.time()
    if now - _email_last_global < _EMAIL_GLOBAL_MIN_INTERVAL:
        return
    if now - _email_last_by_key.get(dedupe_key, 0.0) < _EMAIL_KEY_COOLDOWN:
        return
    _email_last_global = now
    _email_last_by_key[dedupe_key] = now
    await send_notification_email(subject, body)


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Modern lifecycle handler replacing deprecated on_event."""
    try:
        await client.admin.command('ping')
        logger.info(f"Successfully connected to MongoDB database: {db.name}")
        logger.info("Backend server ready at /api endpoints")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        logger.error("Please check your MONGO_URL in the .env file")
        logger.error("Make sure MongoDB Atlas is configured and network access is allowed")
    yield
    client.close()
    logger.info("MongoDB connection closed")


# Rate limiter keyed by client IP
limiter = Limiter(key_func=get_remote_address)

# Interactive API docs publish the full route inventory (including the admin
# endpoints and the X-Admin-Secret auth scheme), so they are OFF unless
# ENABLE_DOCS=true is set (development only).
_docs_enabled = os.environ.get("ENABLE_DOCS", "false").lower() == "true"

# Create the main app with lifespan
app = FastAPI(
    lifespan=lifespan,
    docs_url="/docs" if _docs_enabled else None,
    redoc_url="/redoc" if _docs_enabled else None,
    openapi_url="/openapi.json" if _docs_enabled else None,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Optional Host-header allowlist. Only enabled when ALLOWED_HOSTS is set, because
# the API is served on a platform host (e.g. *.up.railway.app) that must be in
# the list or every request would be rejected. Set ALLOWED_HOSTS to a
# comma-separated list (e.g. "dodolegacy.com,www.dodolegacy.com,<railway-host>").
_allowed_hosts = [h.strip() for h in os.environ.get("ALLOWED_HOSTS", "").split(",") if h.strip()]
if _allowed_hosts:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=_allowed_hosts)

# CORS. This API authenticates with the X-Admin-Secret request header, never
# cookies, so credentials are disabled: a wildcard origin reflected WITH
# credentials would let any site issue credentialed cross-origin requests.
# Origins are an explicit allowlist ("*" is refused); the regex is END-ANCHORED
# so look-alikes such as dodolegacy.com.evil.com cannot match.
_cors_origins = [o.strip() for o in os.environ.get('CORS_ORIGINS', '').split(',')
                 if o.strip() and o.strip() != '*']
if not _cors_origins:
    _cors_origins = ["https://dodolegacy.com", "https://www.dodolegacy.com"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=_cors_origins,
    allow_origin_regex=r"https://(www\.)?dodolegacy\.com$",
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-Admin-Secret"],
)

# Reject oversized request bodies early, and stamp defensive response headers on
# every reply (admin responses are additionally marked no-store so intermediary
# caches never retain moderation data).
MAX_BODY_BYTES = 16 * 1024  # 16 KB is ample for a first name + 500-char message

@app.middleware("http")
async def security_and_limits(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length is not None:
        try:
            if int(content_length) > MAX_BODY_BYTES:
                return JSONResponse(status_code=413, content={"detail": "Request body too large."})
        except ValueError:
            return JSONResponse(status_code=400, content={"detail": "Invalid Content-Length."})
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    response.headers.setdefault("X-Frame-Options", "DENY")
    if request.url.path.startswith("/api/admin"):
        response.headers["Cache-Control"] = "no-store"
    return response

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Gallery comments models
class GalleryComment(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_id: str
    name: str
    message: str
    is_approved: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())



class GalleryCommentCreate(BaseModel):
    name: str
    message: str


class GalleryLike(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_id: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class GalleryLikeCount(BaseModel):
    count: int


VALID_NAME_RE = re.compile(r"^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ' \-]{0,38}[A-Za-zÀ-ÖØ-öø-ÿ]$")

# Common leet-speak substitutions, used to catch obfuscations that are not
# already enumerated in PROHIBITED_WORDS (e.g. "sh1t", "a$$", "f4ggot").
_LEET_MAP = str.maketrans(
    {"0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "$": "s", "@": "a", "!": "i"}
)


def _build_profanity_matchers(words):
    """Split the list into plain words (matched on word boundaries so "ass"
    no longer trips on "class") and symbol/phrase entries (matched literally,
    since strings like "a$$" or "buy now" cannot appear inside ordinary words)."""
    plain, special = [], []
    for w in words:
        (plain if re.fullmatch(r"[a-z0-9]+", w) else special).append(w)
    plain.sort(key=len, reverse=True)
    special.sort(key=len, reverse=True)
    plain_re = (
        re.compile(r"\b(?:" + "|".join(re.escape(w) for w in plain) + r")\b", re.IGNORECASE)
        if plain
        else None
    )
    special_re = (
        re.compile("|".join(re.escape(w) for w in special), re.IGNORECASE) if special else None
    )
    return plain_re, special_re


_PLAIN_PROFANITY_RE, _SPECIAL_PROFANITY_RE = _build_profanity_matchers(PROHIBITED_WORDS)


def contains_prohibited_words(text: str) -> bool:
    if not text:
        return False
    lowered = text.lower()
    # Symbol/phrase variants first (safe as plain substrings).
    if _SPECIAL_PROFANITY_RE and _SPECIAL_PROFANITY_RE.search(lowered):
        return True
    # Plain words on word boundaries, checked against the raw text AND a
    # de-leeted copy so "sh1t"/"a$$" style bypasses are caught without
    # flagging innocent words like "class", "assist", or "Scunthorpe".
    if _PLAIN_PROFANITY_RE:
        if _PLAIN_PROFANITY_RE.search(lowered):
            return True
        deleet = lowered.translate(_LEET_MAP)
        if deleet != lowered and _PLAIN_PROFANITY_RE.search(deleet):
            return True
    return False

def is_valid_name(name: str) -> bool:
    """Require at least 2 letter characters and a real-name pattern."""
    if not VALID_NAME_RE.match(name):
        return False
    letter_count = sum(1 for c in name if c.isalpha())
    return letter_count >= 2


# image_id is a free-form path segment written into MongoDB and echoed into
# notification emails. Constrain it so an attacker cannot store megabyte-long
# values (storage exhaustion) or smuggle text into the owner's inbox. Real ids
# are numeric gallery ids ("1", "12") and slugs ("community-guestbook").
IMAGE_ID_RE = re.compile(r"^[A-Za-z0-9_\-]{1,64}$")

def require_valid_image_id(image_id: str) -> None:
    if not IMAGE_ID_RE.match(image_id):
        raise HTTPException(status_code=400, detail="Invalid image identifier.")


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/health")
async def health_check():
    """Health endpoint for uptime monitoring services."""
    try:
        await client.admin.command('ping')
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
    payload = {
        "status": "ok" if db_status == "connected" else "degraded",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if db_status != "connected":
        # Return 503 so uptime monitors and load balancers see the degraded
        # state instead of a green 200 while every data endpoint is failing.
        return JSONResponse(status_code=503, content=payload)
    return payload


# ---------------------------------------------------------------------------
# Simple in-memory TTL cache for read-heavy endpoints (likes counts)
# ---------------------------------------------------------------------------
_likes_cache: dict[str, tuple[int, float]] = {}  # image_id -> (count, expires_at)
LIKES_CACHE_TTL = 60  # seconds

def _get_cached_likes(image_id: str) -> int | None:
    entry = _likes_cache.get(image_id)
    if entry and entry[1] > time.time():
        return entry[0]
    return None

def _set_cached_likes(image_id: str, count: int) -> None:
    _likes_cache[image_id] = (count, time.time() + LIKES_CACHE_TTL)

def _invalidate_likes_cache(image_id: str) -> None:
    _likes_cache.pop(image_id, None)

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.get("/gallery/{image_id}/comments", response_model=List[GalleryComment])
async def get_gallery_comments(
    image_id: str,
    limit: int = Query(default=50, ge=1, le=100),
):
    require_valid_image_id(image_id)
    comments = await (
        db.gallery_comments.find({"image_id": image_id, "is_approved": True}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(limit)
    )
    return comments


@api_router.post("/gallery/{image_id}/comments", response_model=GalleryComment)
@limiter.limit("10/minute")
async def create_gallery_comment(request: Request, image_id: str, input: GalleryCommentCreate):
    require_valid_image_id(image_id)
    name = (input.name or "").strip()
    message = (input.message or "").strip()

    if not name:
        raise HTTPException(status_code=422, detail="Name is required.")
    if len(name) > 40:
        raise HTTPException(status_code=422, detail="Name must be 40 characters or less.")
    if not is_valid_name(name):
        raise HTTPException(
            status_code=422,
            detail="Please use your real first name. Comments with fake or unrecognizable names will not be published.",
        )
    if not message:
        raise HTTPException(status_code=422, detail="Comment is required.")
    if len(message) > 500:
        raise HTTPException(status_code=422, detail="Comment must be 500 characters or less.")

    if contains_prohibited_words(message) or contains_prohibited_words(name):
        raise HTTPException(
            status_code=400,
            detail="Your comment contains inappropriate language and cannot be submitted.",
        )

    comment = GalleryComment(image_id=image_id, name=name, message=message, is_approved=False)
    await db.gallery_comments.insert_one(comment.model_dump())

    # 📬 Notify owner of new comment (non-blocking, debounced against flooding)
    await notify_owner(
        f"comment:{image_id}",
        subject=f"[Dodo Legacy] New comment from {name}",
        body=(
            f"You have a new comment awaiting moderation.\n\n"
            f"Image ID: {image_id}\n"
            f"From: {name}\n"
            f"Message: {message}\n\n"
            f"Moderate at: https://dodolegacy.com/admin/comments (sign in with your admin secret)"
        )
    )

    return comment


@api_router.get("/gallery/{image_id}/likes", response_model=GalleryLikeCount)
async def get_image_likes(image_id: str):
    """Return like count for an image, cached for 60 seconds."""
    require_valid_image_id(image_id)
    cached = _get_cached_likes(image_id)
    if cached is not None:
        return {"count": cached}
    count = await db.gallery_likes.count_documents({"image_id": image_id})
    _set_cached_likes(image_id, count)
    return {"count": count}

@api_router.post("/gallery/{image_id}/like")
@limiter.limit("30/minute")
async def like_image(request: Request, image_id: str):
    require_valid_image_id(image_id)
    like = GalleryLike(image_id=image_id)
    await db.gallery_likes.insert_one(like.model_dump())
    _invalidate_likes_cache(image_id)  # bust the cache so next GET is fresh

    # 📬 Notify owner of new like (non-blocking, debounced against flooding)
    await notify_owner(
        f"like:{image_id}",
        subject=f"[Dodo Legacy] New like on image {image_id}",
        body=(
            f"Someone liked image ID: {image_id}\n"
            f"Time: {datetime.now(timezone.utc).isoformat()}\n\n"
            f"View all likes at: https://dodolegacy.com/admin/comments (sign in with your admin secret)"
        )
    )

    return {"message": "Liked"}

# Admin authentication: the shared secret is sent in the X-Admin-Secret
# header (never in the URL), so it cannot leak through browser history,
# server access logs, or the Referer header to analytics/ad networks.
def verify_admin(request: Request, x_admin_secret: str = Header(default="", alias="X-Admin-Secret")):
    expected = os.environ.get("ADMIN_SECRET")
    # Constant-time comparison avoids a timing side-channel for secret recovery;
    # the `not expected` short-circuit keeps the check fail-closed when
    # ADMIN_SECRET is unset or empty.
    if not expected or not hmac.compare_digest(x_admin_secret, expected):
        # Security-event log (OWASP A09) so repeated admin brute-force is visible.
        # The submitted secret is deliberately never logged.
        client = request.client.host if request.client else "unknown"
        logger.warning("Failed admin auth attempt from %s on %s", client, request.url.path)
        raise HTTPException(status_code=403, detail="Unauthorized")
    return True


# Admin endpoint extensions
@api_router.get("/admin/likes")
async def get_all_likes(_: bool = Depends(verify_admin)):
    likes = await db.gallery_likes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return likes


# Admin Endpoints (Simple Secret Key Auth)
@api_router.get("/admin/comments", response_model=List[GalleryComment])
async def get_all_comments_for_moderation(_: bool = Depends(verify_admin)):
    comments = await (
        db.gallery_comments.find({}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(100)
    )
    return comments

@api_router.put("/admin/comments/{comment_id}/approve")
async def approve_comment(comment_id: str, _: bool = Depends(verify_admin)):
    result = await db.gallery_comments.update_one(
        {"id": comment_id},
        {"$set": {"is_approved": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment approved"}

@api_router.delete("/admin/comments/{comment_id}")
async def delete_comment(comment_id: str, _: bool = Depends(verify_admin)):
    result = await db.gallery_comments.delete_one({"id": comment_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment deleted"}

# Include the router in the main app
app.include_router(api_router)


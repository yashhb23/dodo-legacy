from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, HTTPException, Query, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


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

# Create the main app with lifespan
app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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


# Helper for word filtering
PROHIBITED_WORDS = {"spam", "scam", "offensive", "badword"}  # User can add more later

def contains_prohibited_words(text: str) -> bool:
    content = text.lower()
    return any(word in content for word in PROHIBITED_WORDS)


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

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
    comments = await (
        db.gallery_comments.find({"image_id": image_id, "is_approved": True}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(limit)
    )
    return comments


@api_router.post("/gallery/{image_id}/comments", response_model=GalleryComment)
@limiter.limit("10/minute")
async def create_gallery_comment(request: Request, image_id: str, input: GalleryCommentCreate):
    name = (input.name or "").strip()
    message = (input.message or "").strip()

    if not name:
        raise HTTPException(status_code=422, detail="Name is required.")
    if len(name) > 40:
        raise HTTPException(status_code=422, detail="Name must be 40 characters or less.")
    if not message:
        raise HTTPException(status_code=422, detail="Comment is required.")
    if len(message) > 500:
        raise HTTPException(status_code=422, detail="Comment must be 500 characters or less.")

    # Apply word filter - auto-reject if contains prohibited words
    if contains_prohibited_words(message) or contains_prohibited_words(name):
        raise HTTPException(status_code=400, detail="Comment contains prohibited content.")

    comment = GalleryComment(image_id=image_id, name=name, message=message, is_approved=False)
    await db.gallery_comments.insert_one(comment.model_dump())
    return comment


@api_router.get("/gallery/{image_id}/likes", response_model=GalleryLikeCount)
async def get_image_likes(image_id: str):
    count = await db.gallery_likes.count_documents({"image_id": image_id})
    return {"count": count}

@api_router.post("/gallery/{image_id}/like")
@limiter.limit("30/minute")
async def like_image(request: Request, image_id: str):
    like = GalleryLike(image_id=image_id)
    await db.gallery_likes.insert_one(like.model_dump())
    return {"message": "Liked"}

# Admin endpoint extensions
@api_router.get("/admin/likes")
async def get_all_likes(secret: str = Query(...)):
    if secret != os.environ.get("ADMIN_SECRET"):
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    # Return all likes, grouped by image? Or just raw list?
    # User wants "see which people liked". We only have timestamps.
    likes = await db.gallery_likes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return likes


# Admin Endpoints (Simple Secret Key Auth)
@api_router.get("/admin/comments", response_model=List[GalleryComment])
async def get_all_comments_for_moderation(secret: str = Query(...)):
    if secret != os.environ.get("ADMIN_SECRET"):
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    comments = await (
        db.gallery_comments.find({}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(100)
    )
    return comments

@api_router.put("/admin/comments/{comment_id}/approve")
async def approve_comment(comment_id: str, secret: str = Query(...)):
    if secret != os.environ.get("ADMIN_SECRET"):
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    result = await db.gallery_comments.update_one(
        {"id": comment_id},
        {"$set": {"is_approved": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment approved"}

@api_router.delete("/admin/comments/{comment_id}")
async def delete_comment(comment_id: str, secret: str = Query(...)):
    if secret != os.environ.get("ADMIN_SECRET"):
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    result = await db.gallery_comments.delete_one({"id": comment_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment deleted"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


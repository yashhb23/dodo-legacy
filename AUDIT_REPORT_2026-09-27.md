# Dodo Legacy: site audit and monetisation report

Date: 27 September 2026
Scope: dodolegacy.com (frontend on Vercel, API on Railway, MongoDB Atlas), repository `yashhb23/dodo-legacy` at commit `76c8006`.
Author: Claude (automated audit session). Nothing on the live site was changed. This document is the only file added.

---

## 1. Summary

**The site is half down.** The page renders and looks polished, but the API that powers comments, likes, the community guestbook and the admin dashboard has had **no running deployment on Railway since 14 September 2026**. Every visitor currently sees a red "Failed to fetch" under the guestbook and inside every gallery photo. The last backend build (16 August) succeeded, so this is not a code problem: the deployment was removed, which is what Railway does when a plan or credit lapses or when a deployment is removed by hand. One click in Railway (or one push to `main`) brings it back once billing is confirmed.

**Bug count from a full feature-by-feature pass:** 4 critical, 9 high, 9 medium, 6 low. The critical items are the dead backend, the missing privacy policy and consent banner (while three trackers and session recording run), fabricated social proof (invented like counts and unverifiable "Verified" testimonials), and image-licensing exposure (Getty stock files in the repo and on the live domain, plus Wikimedia images without the required attribution).

**Money today: zero.** Google AdSense is loaded but there are no ad units on the page, and AdSense cannot be approved or run legally without a privacy policy and an EU consent tool. With one indexable URL and no email list, ads would earn pocket money at best. The realistic paths are (1) tours-and-experiences affiliate links that map one-to-one onto the content, (2) sponsorship from Mauritian brands with CSR and heritage budgets, (3) digital and print products built from the timeline, and (4) licensing the experience to hotels, tour operators and schools.

**Selling it:** as it stands, a marketplace buyer would pay starter-site money (low hundreds of dollars, perhaps one to two thousand for the design and code), because sites are priced on profit and traffic and this one has neither. The better route is a strategic buyer or licensee in Mauritius, and even that needs six to twelve months of traffic data, working features, clean licensing, and some recurring revenue first. Section 7 lays this out.

Section 8 is a numbered action plan. Reply with the numbers you approve and I will implement them on this branch.

---

## 2. How this audit was done and what it could not see

**Done**
- Read every source file: 45 React components, all data files, the FastAPI server, configs, docs, and the 50-commit git history.
- Inspected the Railway workspace: four projects, found the API in project `graceful-comfort`, service `dodo-legacy` (root `/backend`, start command `uvicorn server:app --host 0.0.0.0 --port $PORT`), full deployment history and the last build log.
- Crawled the live site (home, www redirect, admin, a missing route, ads.txt, the JS bundle) to confirm what visitors see and which API URL is compiled in.
- Built the frontend from source (compiles clean, main bundle 154 KB gzipped) and drove it in headless Chromium at 1366x768, 390x844 and 360x740: every navigation link, hero badge, modal, timeline card, district, culture topic, gallery filter, viewer, like, share, quiz, search, guestbook, festival notice, footer, admin login and 404 route.
- Ran Lighthouse (mobile and desktop presets) and an axe-core WCAG 2.1 AA scan against that build.
- Ran the backend locally without a database and exercised validation, profanity filtering, admin auth, CORS, body limits and rate limiting with real HTTP requests.

**Not possible from this sandbox**
- Direct requests to dodolegacy.com were blocked by the sandbox network policy, so Lighthouse ran against the local production build, not the CDN. Real-world load times will differ (probably better on Vercel's CDN, but the 6 MB of images is the same).
- Third-party hosts (Google Fonts, ui-avatars, analytics) were blocked locally. Fallback rendering caused by that was not counted as a bug.
- No access to the Vercel, Google AdSense, Search Console, PostHog, Clarity or MongoDB Atlas dashboards, to Railway billing, or to the Railway variable values (reading secrets was denied, only variable names were visible).

---

## 3. Feature-by-feature status

| Feature | Live status | Findings |
|---|---|---|
| Top announcement banner | Works | Rotates every 5 s, click scrolls to section, close works |
| Navigation (desktop and mobile) | Works | Explore "guided tour" cannot be cancelled (H4); nav links are dead on `/admin` (M6) |
| Hero, badges, Discover More, Watch Story | Works | Hero districts label towns, not districts (M1) |
| Island Story timeline modal | **Layout broken** | Header renders beside the grid instead of above it (H1) |
| Dodo modal | Works | Header image hotlinked from a third-party blog (M4) |
| 3D history stack (16 cards) | Works | Shared link lands on the hero, not the timeline (H2); cards are tiny touch targets on phones (M3); 6 MB of eager images (H8) |
| Milestone modal, arrows, keyboard | Works | Fine |
| Share sheet (X, Facebook, WhatsApp, LinkedIn, copy) | Works | Shares a hash URL that does not scroll on arrival (H2) |
| Districts (9) and modals | Works | Two factual errors (M1); share buttons share the bare homepage (H2) |
| Culture (5) and modals | Works | Same share issue |
| Gallery grid and filters | Works | Like counts are invented (C3) |
| Gallery viewer | Works visually | "Failed to fetch" shown raw; Like does nothing and says nothing (H5); Share copies a `?image=` link that opens nothing (H2) |
| Voices testimonials | Renders | Hard-coded, "Verified", avatars from a third-party service (C3, M4) |
| Community: quote, proverbs, festivals | Works | Fine |
| Community guestbook | **Down** | API unreachable (C1); raw error text (H5) |
| Next-festival notice | **Wrong** | Shows a festival that already passed (H3) |
| Discovery widget and quiz | Works | Progress is not preserved despite the code comment (M7) |
| Search | Works | Results limited to name/summary text |
| Footer and credits modal | Works | Credits omit Wikimedia Commons attribution (C4) |
| Admin dashboard | **Down** | API unreachable (C1); wrong-secret and API-down errors are indistinguishable (M6) |
| 404 route | Works | Returns HTTP 200 (soft 404) (M2) |
| Email notifications to owner | **Not configured** | NOTIFY_EMAIL and NOTIFY_PASSWORD are not set on Railway (H9) |

---

## 4. Findings in detail

Severity: Critical = site broken or legal exposure. High = visible bug or real risk. Medium = quality, accuracy, SEO, accessibility. Low = polish.

### Critical

**C1. The backend has no running deployment; all interactive features are dead.**
Evidence: Railway service `dodo-legacy` in project `graceful-comfort` lists 30 deployments, every one with status REMOVED. The newest (a redeploy of commit `76c8006`, created 16 Aug 2026) was removed on 14 Sep 2026. Its build log ends with "image push" and no errors. `https://dodo-legacy-production.up.railway.app/api/health` now returns Railway's own 404 page ("The train has not arrived at the station"). The live JavaScript bundle has that hostname compiled in, and the live page shows "Failed to fetch" in the guestbook.
Likely cause: plan or credit lapse on the Railway account, or a manual removal. Not a code failure.
Fix: check Railway billing and usage, then redeploy the last deployment (I can trigger this on your go-ahead) or push any commit to `main`. Then verify `/api/health` returns `{"status":"ok"}`. Also check MongoDB Atlas: free-tier clusters can be auto-paused after long inactivity. Add a free uptime monitor (for example UptimeRobot) on `/api/health` so this cannot go unnoticed for two weeks again.
Also related: the frontend's Content Security Policy in `frontend/vercel.json` hard-codes this Railway hostname, so if the API ever moves, the browser will block it until the CSP is updated.

**C2. No privacy policy, cookie consent or terms, while the page runs three trackers and session recording.**
`frontend/public/index.html` loads PostHog (with session replay), Microsoft Clarity (heatmaps and recordings) and Google AdSense; `@vercel/analytics` is also mounted. There is no privacy page, no consent banner, no terms, and no data-controller identity anywhere on the site.
Why it matters: EU visitors (France is Mauritius's largest tourist market) are covered by GDPR; the Mauritius Data Protection Act 2017 applies at home; Google requires a certified consent management platform for ads shown to EEA and UK users and requires a privacy policy for AdSense approval at all. This is also the first thing a buyer's due diligence flags.
Fix: add `/privacy`, `/terms` and a consent banner that gates PostHog, Clarity and AdSense until accepted; reduce to one analytics tool (see M5); name the owner and contact.

**C3. Fabricated social proof.**
- Gallery like counts: `frontend/src/components/GallerySection.jsx` line 22 adds a fixed pseudo-random base of 250 to 650 to every image ("for social proof"). With the API down, the numbers on the live site right now are entirely invented (267, 454, 471, ...).
- Voices section: ten hard-coded testimonials in `frontend/src/data/testimonials.js`, each flagged `verified: true`, under headings "Real experiences from people across the island" and "Unbiased and unfiltered" (`VoicesSection.jsx` lines 19 and 22). Several read like reviews lifted from travel sites (usernames such as "Travel by LG" and "Dream Explorer", guide names, "remember the insect repellent"). If they were copied, that is a copyright problem; if they were written in-house, the "Verified" and "Real" labels are misrepresentation.
Why it matters: undermines the trust the whole site is built on, conflicts with Google's misrepresentative-content policies, and would surface in any acquisition.
Fix: show real counts only (or hide counts until there are real ones); replace the testimonials with genuine, permissioned quotes or with approved guestbook entries, and drop the "Verified" badge unless you can verify.

**C4. Image licensing and attribution exposure.**
- Two Getty Images watermarked stock files are committed: `gallery/gettyimages-471439854-612x612.jpg` and `frontend/public/assets/images/gettyimages-143069965-1024x1024.jpg`. The second is publicly served at `dodolegacy.com/assets/images/gettyimages-143069965-1024x1024.jpg` even though no page links to it. Getty pursues unlicensed use aggressively. Delete both from the repo and from history.
- The 16 timeline photos come from Wikimedia Commons (`frontend/public/assets/images/history/stack/CREDITS.md`). Most Commons photos are CC BY or CC BY-SA, which require author and licence credit where the image is shown. The site's credits modal (`frontend/src/components/CreditsModal.jsx`) does not mention Wikimedia Commons at all, and the credits file still says "FAILED, needs manual image" for several entries and was not updated when the 1968 photo was swapped in August, so the origin and licence of at least that image are undocumented.
- The Dodo modal hotlinks `pictureboxblue.com` and the Open Graph image hotlinks Unsplash: both can disappear or change without notice.
Fix: remove the Getty files; add a per-image credits list (title, author, licence, link) to the credits modal; self-host the two hotlinked images; record the licence of every image in one place.

### High

**H1. The Island Story timeline modal is laid out wrongly.**
The title block renders as a narrow column beside the card grid instead of above it, and the close button overlaps the grid edge. Verified with computed styles: the dialog is `display: flex; align-items: center; justify-content: center`, coming from the global rule at `frontend/src/index.css` line 551 (`[role="dialog"] { ... }`), which overrides the component library's grid layout for every dialog. Fix: delete that block and the related `[role="dialog"] > div` rules at lines 560 to 584, then re-check each modal on mobile (they already handle their own scrolling).

**H2. Sharing is broken in four ways.** Sharing is this site's main growth mechanic, so this matters more than it looks.
1. Duplicate social tags: `index.html` (og:image = `dodo-icon.png`, twitter:card = summary) and the Helmet block in `LandingPage.jsx` (og:image = an Unsplash URL, twitter:card = summary_large_image) both emit tags; crawlers take the first, so WhatsApp and Facebook previews show a 416x416 icon rather than a hero image, and the description tag is duplicated.
2. The share sheet shares `https://dodolegacy.com/#history-stack` (`ShareDialog.jsx` line 83), but a fresh load of a hash URL does not scroll because the section is rendered after load. Tested: the page stays at the top. Recipients land on the hero and never see the moment that was shared.
3. The gallery viewer's Share copies `dodolegacy.com?image=N` (`GalleryViewer.jsx` line 39), but nothing on the site reads that parameter. Tested: `/?image=12` opens nothing.
4. District and culture modals' share buttons share the bare homepage URL.
Fix: one canonical set of social tags with a 1200x630 image; on mount, honour the hash and `?image=` (scroll or open the viewer); better still, give each district, culture topic and milestone its own URL (this also fixes M2).

**H3. "Next festival" shows a date that has already passed.**
On 27 September the notice read "Père Laval Pilgrimage, 9 September 2026". `getNextFestival` in `frontend/src/data/community.js` line 189 compares months only, so anything in the current month counts as upcoming even after its date. Eid is also pinned to March (line 171) although it moves about 11 days earlier each year. Fix: compare full dates, keep a small per-year table for the movable feasts (or label them "date varies"), and show "today" on the day itself.

**H4. The Explore guided tour cannot be interrupted.**
`handleExploreClick` in `LandingPage.jsx` line 87 chains timeouts for about 15 seconds. Tested: after the visitor scrolled back to the top, the tour yanked the page down again. It also keeps firing if a modal is opened. Fix: cancel the timers on wheel, touch, key or modal open, or replace the tour with a "next section" button.

**H5. Failures are silent or raw.**
Like click with the API down: nothing changes and nothing is shown (the error goes to the console only). Comments and guestbook show the raw browser string "Failed to fetch" in red. Admin login shows the same string for a wrong secret and for a dead API. Fix: friendly messages with a retry, and hide or disable likes and comments when `/api/health` is not OK.

**H6. Rate limiting is keyed on the proxy's IP, not the visitor's.**
`server.py` line 125 keys the limiter on `request.client.host`. Uvicorn 0.25 only trusts `X-Forwarded-For` from `127.0.0.1` by default; on Railway the connection comes from the edge proxy, so every visitor shares one bucket: 10 comments and 30 likes per minute for the whole site, and the admin-failure log records the proxy address. Reproduced locally by starting uvicorn with an untrusted proxy: twelve requests from twelve different forwarded IPs were throttled after ten. Fix: set the Railway variable `FORWARDED_ALLOW_IPS=*` or add `--proxy-headers --forwarded-allow-ips="*"` to the start command.

**H7. Leftover unauthenticated write endpoint.**
`POST /api/status` (template boilerplate) inserts a document per request with no rate limit, and `GET /api/status` dumps up to 1,000 of them. Anyone can fill the free 512 MB Atlas tier. Fix: delete both routes and the `status_checks` collection.

**H8. Page weight and load time.**
Lighthouse mobile: performance 60, Largest Contentful Paint 9.1 s, total transfer 6.2 MB, "improve image delivery" 5.6 MB. Desktop scores 95 only because of bandwidth. Causes: three 1536x1024 PNG banners of 2.5 to 2.8 MB each (`festivals.png`, `religion.png`, `culinary.png`), the 16 timeline JPEGs (200 to 630 KB each) loaded eagerly, `le-morne.jpg` at 2560 px (980 KB) shown in a 400 px grid cell, and no long-lived cache headers for `/images` and `/assets` in `vercel.json`. Fix: convert to WebP or AVIF at 1200 px or less, add `srcset`, load only the front four or five stack cards eagerly, and add `Cache-Control: public, max-age=31536000, immutable` for image paths.

**H9. Owner notifications are not configured and moderation has a blind spot.**
The Railway service variables are `ADMIN_SECRET, CORS_ORIGINS, DB_NAME, MONGO_URL, PYTHON_VERSION`; `NOTIFY_EMAIL` and `NOTIFY_PASSWORD` are absent, so the email-on-new-comment feature never fires. The admin list also caps at the 100 newest comments (`server.py` line 493), so older pending comments become invisible. Fix: set the two variables (Gmail app password) or switch to a transactional mail API; paginate or filter the admin list by pending.

### Medium

**M1. Content accuracy.**
- `districts.js` line 24: the Le Morne kite festival "on March 1st marks abolition of slavery". Abolition Day is 1 February, as the site's own festival list says.
- `districts.js` lines 69 to 74: Grand Baie and Pereybere are listed under Pamplemousses. Both are in Rivière du Rempart district.
- `historyMilestones.ts` line 25: the first card is labelled "2 Billion Y.A." while its text speaks of 3-billion-year-old zircons and a fragment that sank 84 million years ago. Pick one honest label ("Deep time" or "84 Million Y.A.").
- `DiscoveryWidget.jsx` line 45: fallback "on this day" facts print US-style dates ("11/2: 1834 ...") to a day-first audience.
- Hero corner labels (Port Louis, Curepipe, Vacoas, Grand Baie) are three towns and one village, not districts. Harmless decoration, but a Mauritian reader notices.
- Minor: "Universal Suffrage 1959" (the constitution granting it dates from 1958; first election under it 1959) and the specific day given for the Cantino map are stated more precisely than the sources support.

**M2. Search visibility is one page.**
A `site:dodolegacy.com` search returns exactly one result. Everything lives at `/` behind hash links, so nothing can rank for "Flacq history", "sega origins" or "Aapravasi Ghat" style queries. Unknown routes return HTTP 200 with a "Page Not Found" screen (soft 404). `sitemap.xml` lists one URL with a March lastmod. The structured data uses `window.location.href`. There is no French version even though the island's everyday languages are Kreol and French and France is the largest visitor market. Fix: real URLs for the 9 districts, 5 culture topics and 16 milestones (pre-rendered or a static framework), a real 404 status via a rewrite rule, a generated sitemap, hreflang for a French edition.

**M3. Accessibility.**
axe-core: 32 colour-contrast failures (blue "View details" links and the muted like counts on dark cards). Lighthouse: 16 touch-target failures for the stacked cards (on a phone each card's exposed strip is roughly 15 px wide, so only the arrows are reliably tappable), heading-order skip in Voices, unsized gallery images (layout shift risk). Measured: the gallery viewer close button is 24 px wide on mobile, guestbook inputs are 36 px tall (44 px is the accepted minimum). Modals render the same title twice (a screen-reader-only one and a visible one).

**M4. Runtime dependence on third parties.**
Ten avatars from `ui-avatars.com`, fonts from Google Fonts, the dodo image from `pictureboxblue.com`, the OG image from Unsplash, and a debug script from `assets.emergent.sh` injected whenever the site is framed (`index.html` line 62, left over from the builder tool). Each is a breakage point and an unnecessary disclosure of visitor IPs. Fix: self-host fonts and images, render initials in CSS, delete the Emergent snippet and the `frontend/plugins/` dev tooling.

**M5. Analytics overkill.** PostHog with session recording, Clarity, and Vercel Analytics all run at once, and Clarity is wired twice (inline in `index.html` and again in `lib/analytics.js` if `REACT_APP_CLARITY_ID` is set). Keep one (Vercel Analytics is cookieless and simplest; PostHog if you want funnels) and drop recordings unless you actively review them.

**M6. Admin dashboard usability.** Nav links do nothing on `/admin/comments`; guestbook entries show "on Unknown Image" because the lookup only knows gallery ids; no way to un-approve; no pagination; wrong-secret and API-down errors read the same.

**M7. Quiz.** State resets whenever the modal is reopened although a code comment claims it is preserved (`QuizModal.jsx` lines 15 to 20); `stateInitialized` is unused. Results cannot be shared, which wastes a natural viral loop.

**M8. Repository hygiene (matters for a buyer's code review).**
15 unused images (about 2.5 MB) and duplicates (`black-river.jpg` vs `.avif`, `religion.png` vs `.jpg`, `port-louis.jpg` vs `.webp`, `grandport.jpg` vs `grand-port.jpg`); a stray Rive file at the root; a `gallery/` folder of "download (1).jpg" files; an empty root `yarn.lock` and empty `tests/`; README links to two missing documents and describes features that no longer exist; PROJECT.md still documents `?secret=` admin URLs; dead code (`RelatedContent`, `HistoryFactModal`, `timeline.js`, `historyFacts.js`, `districtFacts`, `cultureFacts`); dev-only Python tools (pytest, black, mypy, 15 MB) installed into the production image; `requests`, `cryptography`, `email-validator`, `python-multipart` pinned but unused; no CI, no tests, no branch protection.

**M9. Security posture.** Mostly good: CSP, security headers, constant-time admin compare, docs disabled, body-size cap, anchored CORS regex, `.env` not committed. Remaining: `'unsafe-inline'` scripts in the CSP (needed by the inline snippets), a very wide `img-src https:`, a single shared admin password with no lockout (add rate limiting to `/api/admin/*`), and the reverse-proxy issue in H6.

### Low

- L1 `GET /api/` answers "Hello World".
- L2 "Contact Us" is a personal Gmail address; no social profiles are linked.
- L3 No web-app manifest although `index.html` refers to one.
- L4 "© 2026 Dodo Legacy" names no owner or entity.
- L5 The discovery widget covers part of the hero illustration on first paint (desktop).
- L6 Milestone ids 6 and 7 are out of order in the data (harmless, intentional chronology).

---

## 5. Measurements

| Metric | Value | Source |
|---|---|---|
| Lighthouse mobile: performance / accessibility / best practices / SEO | 60 / 91 / 96 / 100 | local production build |
| Lighthouse desktop | 95 / 95 / 96 / 100 | local production build |
| Largest Contentful Paint (mobile) | 9.1 s | Lighthouse |
| Total transfer on first load | 6.2 MB | Lighthouse |
| Potential image savings | 5.6 MB | Lighthouse |
| Main JavaScript bundle (gzipped) | 154 KB | `yarn build` |
| Images in `frontend/public` | 21 MB on disk, 9.4 MB referenced on the page | `du` |
| Indexed URLs | 1 | `site:` search |
| Backend deployments active | 0 (last removed 14 Sep 2026) | Railway |
| Browser feature checks | 74 checks; failures all traced to the findings above | Playwright |

---

## 6. What is genuinely good (use this in any pitch)

- Art direction: the hero, the 3D card deck, the milestone modal and the mobile layout all hold up in screenshots at three viewport sizes.
- Editorial depth: 16 written milestones, 9 districts with five sections each, 5 culture essays, a quiz, Kreol proverbs and a multi-faith festival calendar. Content is the hard part and it exists.
- Engineering: clean build with no warnings, code-split modals, small bundle, reduced-motion support, sensible security headers, moderated comments with a profanity filter.
- Assets: a memorable name, a working custom domain, HTTPS, analytics already wired, an AdSense publisher ID already issued.

---

## 7. Making money from the site

### 7.1 Where you actually are

- Revenue: none. AdSense script present, no ad units, approval status unknown, compliance blockers (C2).
- Audience: unknown to me; check Vercel Analytics, PostHog and Clarity for the last 90 days before deciding anything. One indexable page means search traffic is close to zero; whatever exists comes from direct shares.
- Costs: Vercel free tier, Railway roughly 5 USD a month, Atlas free tier, domain about 12 USD a year.

### 7.2 A reality check on ads

Display ads pay per thousand page views. Travel and culture content commonly earns in the low single-digit dollars per thousand views, sometimes more for Western visitors. A site with, say, 3,000 page views a month earns single-digit dollars a month. Ads also cheapen a "digital museum". Treat AdSense as an afterthought, not a plan, and only after C2 is fixed and there are many more pages.

### 7.3 Options ranked by fit

1. **Tours and experiences affiliate links (best fit, lowest effort).** GetYourGuide and Viator pay a minimum of 8 percent of each booking, paid monthly, and Mauritius tours are well stocked on both. The content already maps to bookable products: Le Morne hike, Île aux Aigrettes, Chamarel and Black River Gorges, Grand Bassin, sega evenings, street-food tours, Port Louis market walks. Add a small "Experience this" card to each district, culture and milestone modal. This converts tourists planning a trip, which is exactly who searches for this content. Needs traffic to matter, but it is free to set up and it gives a buyer a revenue line.
2. **Sponsorship from Mauritian companies.** Mauritian companies must put 2 percent of profits into CSR, part of which they may direct to approved programmes themselves; heritage, education and nation-building themes fit. Realistic sponsors: hotel groups that market Mauritian culture (Attitude with its Otentik programme, Beachcomber, LUX, Constance, Sun), Air Mauritius, banks (MCB, SBM), telecoms (my.t, Emtel), Phoenix Beverages. Offer "Presented by" on the timeline, a sponsored new chapter (Rodrigues, Chagos, the sugar story), or the guestbook. A sponsor pitch needs the analytics numbers and the fixes in Section 4.
3. **Digital and print products (no backend needed).** A 16-moment timeline poster (print on demand), Kreol proverb prints, a "16 Moments that made Mauritius" PDF, and printable history worksheets aligned to the Mauritian primary and secondary syllabus. Sell through Gumroad or Payhip and link from the relevant sections. Small but real, and it works for the diaspora audience.
4. **Licensing to businesses.** Hotels want in-room and lobby cultural content; tour operators want guide-training material; schools and tuition centres want interactive history. A white-label or co-branded version of the timeline is a product you can sell several times.
5. **Email newsletter.** "This week in Mauritian history" from the existing on-this-day data (Buttondown or MailerLite, free at small scale). A list is a sponsorship asset and raises sale value.
6. **Hotel and flight affiliates.** Lower conversion for this kind of content; add later.
7. **Donations or memberships.** Negligible for a site like this.

### 7.4 The traffic prerequisite (nothing above works without it)

- Real URLs for districts, culture topics and milestones (30-plus indexable pages), submitted in Search Console.
- A French edition (doubles the addressable search market and speaks to Mauritians and Réunionnais).
- Fix sharing (H2) so every WhatsApp share lands on the right content with a proper preview.
- Short-video cuts of the timeline for Reels and TikTok, pinned posts in diaspora Facebook groups, and a pitch to Mauritian media to feature it around 12 March and 2 November.
- One analytics tool with goals for shares, quiz completions and affiliate clicks.

---

## 8. Selling the site

### 8.1 What it is worth now

Marketplaces price content sites at roughly 30 to 40 times monthly profit. With no profit and little traffic, buyers treat a site as a "starter site": typically low hundreds of dollars, up to one or two thousand for unusually good design and code. The domain by itself has little resale value; "dodo" brands are common. The honest answer is that today the asset is the content and the code, not a business.

### 8.2 Who could pay more, and why

Strategic buyers or licensees value the finished experience, not the traffic:
- Mauritian hotel groups and destination-management companies building content marketing.
- Tour operators and travel agencies (Mautourco, Summertimes, Solis and similar).
- Media houses (La Sentinelle / lexpress.mu, Defimedia) that could run it as a cultural microsite.
- Education companies and tuition brands.
- The Mauritius Tourism Promotion Authority and the culture ministry (more likely grants or partnership than purchase; slow).
- Diaspora associations in France, the UK, Australia and Canada.
Frame the conversation as "a ready-made digital museum and brand you can license or own", with a demo, a one-page deck, and the analytics.

### 8.3 What raises the price

1. Everything in Critical and High fixed, with an uptime monitor showing 30-plus days of green.
2. Six to twelve months of clean analytics in one tool.
3. Any recurring revenue at all (even 100 USD a month changes the multiple).
4. An email list.
5. A French edition and per-topic URLs.
6. Clean intellectual property: licence recorded for every image, no Getty files, no borrowed reviews.
7. Transferability: move Vercel, Railway, Atlas, the domain, AdSense and analytics under a dedicated business mailbox (today they hang off a personal Gmail), and document the handover (the repo's existing guides are a good start once corrected).

### 8.4 Where to sell

Flippa for a marketplace listing (expect starter-site money until 8.3 is done); Acquire.com only once there is revenue; otherwise direct outreach to the strategic list above with a deck and a demo link.

---

## 9. Proposed action plan (reply with the numbers you approve)

**Phase 0: restore service (no code changes, needs you)**
1. Check Railway billing and usage for project `graceful-comfort`, then let me trigger a redeploy of the last deployment (or push any commit to `main`). Verify `/api/health`.
2. Check MongoDB Atlas is not paused and the connection string still works.
3. Set Railway variables `NOTIFY_EMAIL`, `NOTIFY_PASSWORD` (Gmail app password) and `FORWARDED_ALLOW_IPS=*`.
4. Add an uptime monitor on `/api/health` and on the homepage.
5. Verify the site in Google Search Console and look at 90 days of Vercel Analytics or PostHog so we know the real traffic.

**Phase 1: bug fixes I can do on this branch this week**
6. Remove the global `[role="dialog"]` CSS override (H1) and re-test every modal on mobile.
7. Fix the next-festival date logic and movable feasts (H3).
8. Make the Explore tour cancellable (H4).
9. Friendly error states; hide likes and comments when the API is down (H5).
10. Delete the `/api/status` routes; rate-limit admin endpoints (H7, M9).
11. One canonical set of social tags with a 1200x630 image; honour `#section` and `?image=` on load (H2 parts 1 to 3).
12. Correct the content errors listed in M1.
13. Image pipeline: WebP/AVIF at 1200 px, `srcset`, eager-load only the front stack cards, cache headers in `vercel.json` (H8).
14. Remove the Getty files and unused assets, delete dead code and the Emergent tooling, fix the docs (C4 part, M4, M8).

**Phase 2: compliance and monetisation plumbing**
15. Privacy policy, terms, consent banner; reduce to one analytics tool (C2, M5).
16. Replace invented like counts and the hard-coded "Verified" testimonials with real data or permissioned quotes (C3).
17. Per-image credits with licences in the credits modal; self-host the hotlinked images and fonts (C4, M4).
18. Affiliate "Experience this" cards on districts, culture and milestones (GetYourGuide or Viator account needed from you).
19. Email capture and a first newsletter template.

**Phase 3: growth and sale readiness**
20. Real URLs for districts, culture topics and milestones, generated sitemap, true 404 status (M2).
21. French edition with hreflang.
22. Quiz result sharing and a "16 Moments" digital product page.
23. Sponsor one-pager and a strategic-buyer deck built from the analytics.

---

## Appendix A: evidence

**Railway deployment history (service `dodo-legacy`, environment production)**
30 deployments from 29 Jan to 16 Aug 2026, all now REMOVED; latest created 16 Aug 2026 (redeploy of `76c8006`), removed 14 Sep 2026; its build log ends with a successful image push and no error lines; deploy log for it is empty. Service config: repo `yashhb23/dodo-legacy`, root `/backend`, builder Railpack, start `uvicorn server:app --host 0.0.0.0 --port $PORT`, domain `dodo-legacy-production.up.railway.app` on port 8080, variables `ADMIN_SECRET, CORS_ORIGINS, DB_NAME, MONGO_URL, PYTHON_VERSION`.

**Live site checks (crawler)**
Home page: renders fully; guestbook shows "Failed to fetch". `www` redirects to the apex. `/admin/comments` shows the login form with a noindex tag. A random path returns the Not Found screen with HTTP 200. `ads.txt` serves `google.com, pub-6363250687790220, DIRECT, f08c47fec0942fa0`. The bundle `main.14676c14.js` contains the Railway hostname as the API base. Search index: one URL.

**Backend smoke test (local, no database)**
Health returns 503 when the database is down; `/docs` is disabled (404); admin without or with a wrong secret returns 403; invalid image ids return 400; names "X" and "Yash123" return 422 with the real-name message; 41-character name and 501-character message return 422; "sh1t" is blocked (400) while "Scunthorpe class assist" passes the filter; a 20 KB body returns 413; CORS preflight from `dodolegacy.com.evil.com` is refused and from both real origins is allowed; security headers present; the eleventh comment in a minute returns 429; with an untrusted proxy, twelve requests from twelve forwarded IPs are throttled after ten. `pip check` reports no conflicts.

**Browser audit (local production build)**
Desktop 1366x768, iPhone 390x844, Android 360x740; 74 scripted checks. All failures map to findings H1 to H5, M3, M6 and M7 above; no horizontal overflow on either phone size; the festival notice and the floating dodo button do not overlap (43 to 73 px gap); timeline steppers, milestone modal, gallery viewer, quiz, search, district and culture modals, guestbook form, footer, admin login and 404 all function.

**Accessibility**
axe-core (WCAG 2.1 A and AA): one violation type, colour contrast, 32 elements. Lighthouse accessibility 91 (mobile) and 95 (desktop).

## Appendix B: files referenced

`backend/server.py`, `backend/requirements.txt`, `frontend/public/index.html`, `frontend/vercel.json`, `frontend/src/index.css`, `frontend/src/pages/LandingPage.jsx`, `frontend/src/components/GallerySection.jsx`, `frontend/src/components/GalleryViewer.jsx`, `frontend/src/components/GalleryComments.jsx`, `frontend/src/components/HistoryStack/ShareDialog.jsx`, `frontend/src/components/FestivalNotice.jsx`, `frontend/src/components/DiscoveryWidget.jsx`, `frontend/src/components/QuizModal.jsx`, `frontend/src/components/CreditsModal.jsx`, `frontend/src/components/DodoModal.jsx`, `frontend/src/components/VoicesSection.jsx`, `frontend/src/data/community.js`, `frontend/src/data/districts.js`, `frontend/src/data/historyMilestones.ts`, `frontend/src/data/testimonials.js`, `frontend/public/assets/images/history/stack/CREDITS.md`.

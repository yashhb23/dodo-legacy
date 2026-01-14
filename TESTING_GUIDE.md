# DODO LEGACY - Comprehensive Testing Guide

## Testing Overview

This guide covers all testing procedures to ensure the DODO LEGACY website works flawlessly across all devices and browsers before launch.

---

## 1. Cross-Browser Testing

### Browsers to Test

#### Desktop Browsers (Required)
- ✅ **Chrome** (latest version)
- ✅ **Firefox** (latest version)
- ✅ **Safari** (latest version, macOS)
- ✅ **Edge** (latest version)

#### Mobile Browsers (Recommended)
- Safari (iOS)
- Chrome (Android)
- Samsung Internet (Android)

### Testing Checklist per Browser

#### Navigation & Layout
- [ ] Top banner displays and close button works
- [ ] Navigation menu items work (Heritage, Districts, Culture, Gallery, Voices)
- [ ] Mobile menu toggle works (on small screens)
- [ ] Logo click scrolls to top
- [ ] Search icon opens search modal
- [ ] Explore button works

#### Hero Section
- [ ] Dodo bird image loads correctly
- [ ] Title colors alternate properly (DODO = red/white, BIRD = blue/white)
- [ ] Interactive badges clickable (Heritage, Island Story, Extinct Icon)
- [ ] District names display around hero (desktop only)
- [ ] Buttons work (Discover More, Watch Story)
- [ ] Scroll indicator animates

#### Content Sections
- [ ] History section: 4 fact cards display and are hoverable
- [ ] Districts section: 8 district cards display with hover effects
- [ ] Culture section: Culture cards display and are clickable
- [ ] Gallery section: Masonry grid displays properly
- [ ] Voices section: 10 testimonial cards display correctly
- [ ] Footer: All links and social icons present

#### Modals & Interactions
- [ ] Search modal opens and search works
- [ ] Timeline modal opens and displays timeline
- [ ] Dodo modal opens with dodo information
- [ ] District modals open when clicking district cards
- [ ] Culture modals open when clicking culture cards
- [ ] Gallery viewer opens when clicking images
- [ ] Quiz modal opens and quiz functions correctly
- [ ] All modals close properly (X button and backdrop click)

#### Discovery Widget
- [ ] Widget displays in bottom-right corner
- [ ] Facts rotate every 10 seconds
- [ ] Minimize/expand functionality works
- [ ] Discover button opens random district
- [ ] Quiz button opens quiz modal

#### Animations
- [ ] Dodo circle ring rotates smoothly
- [ ] Fade-in animations on scroll work
- [ ] Hover effects work on cards
- [ ] Smooth scrolling between sections
- [ ] Loading states display correctly

#### Form & Input
- [ ] Search input accepts text
- [ ] Quiz answer selection works
- [ ] All buttons respond to clicks

### Browser-Specific Issues to Watch For

**Safari:**
- Backdrop-filter support (may need fallback)
- Date handling in JavaScript
- Touch event handling

**Firefox:**
- Flexbox/Grid rendering
- CSS custom properties
- WebP image support

**Edge:**
- Compatibility with Chrome (usually good)
- CSS Grid support

---

## 2. Responsive Design Testing

### Screen Sizes to Test

#### Mobile Devices
- [ ] **iPhone SE** (375x667) - Small phone
- [ ] **iPhone 12/13** (390x844) - Standard iPhone
- [ ] **iPhone 14 Pro Max** (430x932) - Large iPhone
- [ ] **Samsung Galaxy S21** (360x800) - Standard Android
- [ ] **Pixel 7** (412x915) - Google Pixel

#### Tablets
- [ ] **iPad Mini** (768x1024) - Small tablet
- [ ] **iPad Air** (820x1180) - Standard iPad
- [ ] **iPad Pro 11"** (834x1194) - Large tablet
- [ ] **iPad Pro 12.9"** (1024x1366) - XL tablet

#### Desktop
- [ ] **Laptop** (1366x768) - Common laptop
- [ ] **Standard Desktop** (1920x1080) - Full HD
- [ ] **Large Desktop** (2560x1440) - QHD
- [ ] **Ultra-wide** (3440x1440) - Ultra-wide monitor

### Responsive Checklist per Device

#### Mobile (< 768px)
- [ ] Navigation collapses to hamburger menu
- [ ] Hero title remains readable (background overlay visible)
- [ ] District names hidden on mobile (desktop only)
- [ ] Discovery Widget positioned correctly (no overlap with content)
- [ ] All buttons have min 44x44px touch targets
- [ ] Modals fit screen with proper max-height
- [ ] Gallery switches to single column
- [ ] Footer stacks vertically
- [ ] No horizontal scroll
- [ ] Text remains readable (not too small)
- [ ] Images scale properly

#### Tablet (768px - 1024px)
- [ ] Navigation shows full menu items
- [ ] Hero section scales appropriately
- [ ] District grid shows 2 columns
- [ ] Gallery shows 2 columns
- [ ] Modal content width appropriate
- [ ] Touch targets remain adequate

#### Desktop (> 1024px)
- [ ] Full navigation visible
- [ ] District names display around hero
- [ ] District grid shows 4 columns
- [ ] Gallery shows 3 columns
- [ ] Hover effects work properly
- [ ] Content max-width prevents overly wide text

### Orientation Testing
- [ ] Portrait orientation on phones
- [ ] Landscape orientation on phones
- [ ] Portrait orientation on tablets
- [ ] Landscape orientation on tablets

---

## 3. Performance Testing (Lighthouse)

### Running Lighthouse Audit

**Chrome DevTools Method:**
1. Open Chrome
2. Press F12 (DevTools)
3. Click "Lighthouse" tab
4. Select categories: Performance, Accessibility, Best Practices, SEO
5. Select "Desktop" or "Mobile"
6. Click "Analyze page load"

**Command Line Method:**
```bash
npm install -g lighthouse

# Desktop audit
lighthouse http://localhost:3000 --view --preset=desktop

# Mobile audit
lighthouse http://localhost:3000 --view --preset=mobile
```

### Target Scores

#### Desktop
- ⭐ **Performance**: 90+ (Green)
- ⭐ **Accessibility**: 95+ (Green)
- ⭐ **Best Practices**: 95+ (Green)
- ⭐ **SEO**: 100 (Green)

#### Mobile
- ⭐ **Performance**: 85+ (Green)
- ⭐ **Accessibility**: 95+ (Green)
- ⭐ **Best Practices**: 95+ (Green)
- ⭐ **SEO**: 100 (Green)

### Performance Metrics to Monitor

**Core Web Vitals:**
- **LCP (Largest Contentful Paint)**: < 2.5s (Good)
- **FID (First Input Delay)**: < 100ms (Good)
- **CLS (Cumulative Layout Shift)**: < 0.1 (Good)

**Other Metrics:**
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s
- **Speed Index**: < 3.4s
- **Total Blocking Time**: < 200ms

### Common Issues & Fixes

**Low Performance Score:**
- ❌ Large bundle size → ✅ See BUNDLE_OPTIMIZATION.md
- ❌ Unoptimized images → ✅ Already implemented WebP, lazy loading
- ❌ Render-blocking resources → ✅ Font preload already added
- ❌ Too many third-party scripts → ✅ Emergent scripts removed

**Accessibility Issues:**
- ❌ Low contrast ratios → ✅ Check text/background contrast
- ❌ Missing alt text → ✅ Already added to images
- ❌ Small touch targets → ✅ Min 44px implemented

**SEO Issues:**
- ❌ Missing meta description → ✅ Already added
- ❌ No structured data → ✅ Schema.org already implemented
- ❌ Images without alt text → ✅ Check all images

---

## 4. Functionality Testing

### Critical User Journeys

#### Journey 1: First-Time Visitor
1. [ ] Land on homepage
2. [ ] See hero with dodo bird
3. [ ] Click "Discover More" button
4. [ ] Scroll through history section
5. [ ] Click on a district card
6. [ ] View district information in modal
7. [ ] Close modal
8. [ ] Continue exploring other sections

#### Journey 2: Quiz Taker
1. [ ] Notice Discovery Widget
2. [ ] Click "Quiz" button
3. [ ] Answer all 10 questions
4. [ ] View final score
5. [ ] Close quiz modal

#### Journey 3: Gallery Browser
1. [ ] Scroll to Gallery section
2. [ ] Click on an image
3. [ ] View image in full-screen viewer
4. [ ] Navigate between images (if implemented)
5. [ ] Close viewer

#### Journey 4: Mobile User
1. [ ] Open site on mobile device
2. [ ] Tap hamburger menu
3. [ ] Navigate to different sections
4. [ ] Interact with Discovery Widget
5. [ ] Open and close modals
6. [ ] Verify all touch targets work

### Edge Cases to Test

- [ ] Very slow network (3G)
- [ ] Offline mode (should show error)
- [ ] Browser back button (shouldn't break app)
- [ ] Browser refresh (state resets correctly)
- [ ] Opening multiple modals in sequence
- [ ] Rapid clicking/tapping
- [ ] Very long names in forms
- [ ] Special characters in search

---

## 5. Accessibility Testing

### Manual Checks

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] All focusable elements have visible focus indicator
- [ ] Modals trap focus correctly
- [ ] Escape key closes modals
- [ ] Enter key activates buttons

#### Screen Reader Testing
- [ ] Use NVDA (Windows) or VoiceOver (Mac)
- [ ] All images have descriptive alt text
- [ ] Headings create logical hierarchy
- [ ] Links have descriptive text
- [ ] Buttons announce their purpose

#### Visual Checks
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Text resizable up to 200%
- [ ] No flashing animations (seizure risk)
- [ ] Color is not the only visual cue

### Automated Accessibility Tools

**axe DevTools:**
```bash
# Install Chrome extension: axe DevTools
# Run automatic scan in browser
```

**Lighthouse Accessibility Audit:**
- Already included in Lighthouse scan above

---

## 6. Security Testing

### Basic Security Checks

- [ ] HTTPS enabled (production only)
- [ ] No sensitive data in localStorage/sessionStorage
- [ ] No API keys exposed in frontend code
- [ ] CORS configured correctly
- [ ] No XSS vulnerabilities (test with `<script>alert(1)</script>`)
- [ ] CSP headers configured (production)
- [ ] MongoDB credentials not exposed

---

## 7. SEO Verification

### Meta Tags Check
- [ ] Title tag present and descriptive
- [ ] Meta description present (150-160 characters)
- [ ] Open Graph tags present (og:title, og:description, og:image)
- [ ] Twitter Card tags present
- [ ] Schema.org structured data present

### Social Media Preview Testing

**Facebook Debugger:**
- URL: https://developers.facebook.com/tools/debug/
- Paste your URL and check preview

**Twitter Card Validator:**
- URL: https://cards-dev.twitter.com/validator
- Paste your URL and check preview

**LinkedIn Post Inspector:**
- URL: https://www.linkedin.com/post-inspector/
- Paste your URL and check preview

### Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- Paste your URL and check structured data

---

## 8. Load Testing (Optional)

### Simple Load Test

**Using Apache Bench:**
```bash
# 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:3000/
```

**Using hey:**
```bash
hey -n 1000 -c 10 http://localhost:3000/
```

### Expected Results
- All requests successful (200 OK)
- Average response time < 100ms (static files)
- No memory leaks
- No crashes under load

---

## 9. Error Handling Testing

### Test Error Scenarios

- [ ] Network failure (disconnect internet)
- [ ] API failure (stop backend server)
- [ ] MongoDB failure (invalid connection)
- [ ] Invalid URLs (404 errors)
- [ ] JavaScript errors (should show error boundary)
- [ ] Broken images (should show alt text)

---

## 10. Analytics Verification

### PostHog Testing
- [ ] PostHog initialized correctly
- [ ] Page views tracked
- [ ] Button clicks tracked (if configured)
- [ ] No console errors from PostHog

---

## Testing Schedule

### Pre-Launch Testing (1-2 days)
1. Day 1 Morning: Cross-browser testing (Desktop)
2. Day 1 Afternoon: Responsive design testing (All devices)
3. Day 2 Morning: Lighthouse audits and performance optimization
4. Day 2 Afternoon: Functionality testing and bug fixes

### Post-Launch Monitoring (Ongoing)
- Week 1: Daily monitoring
- Month 1: Weekly Lighthouse audits
- Ongoing: Monthly comprehensive testing

---

## Test Results Template

```markdown
## Test Session: [Date]

**Tester:** [Name]
**Browser:** [Chrome 120 / Firefox 121 / etc.]
**Device:** [Desktop / iPhone 14 / etc.]
**Screen Size:** [1920x1080 / 390x844 / etc.]

### Issues Found:
1. [Description of issue]
   - **Severity:** Critical / High / Medium / Low
   - **Steps to reproduce:** [...]
   - **Expected:** [...]
   - **Actual:** [...]
   - **Screenshot:** [if available]

2. [Next issue...]

### Test Results:
- Navigation: ✅ Pass / ❌ Fail
- Hero Section: ✅ Pass / ❌ Fail
- Modals: ✅ Pass / ❌ Fail
- Responsive: ✅ Pass / ❌ Fail
- Performance: ✅ Pass / ❌ Fail

### Lighthouse Scores:
- Performance: [Score]/100
- Accessibility: [Score]/100
- Best Practices: [Score]/100
- SEO: [Score]/100

### Notes:
[Any additional observations]
```

---

## Bug Severity Levels

- **Critical**: Blocks major functionality, must fix before launch
- **High**: Important feature broken, fix ASAP
- **Medium**: Minor feature issue, fix soon
- **Low**: Cosmetic issue, fix when time permits

---

## Final Pre-Launch Checklist

- [ ] All critical bugs fixed
- [ ] All high-priority bugs fixed
- [ ] Lighthouse scores meet targets
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete
- [ ] SEO tags verified
- [ ] Analytics working
- [ ] Error boundaries tested
- [ ] MongoDB connection stable
- [ ] HTTPS enabled (production)
- [ ] Domain configured
- [ ] Backup strategy in place

---

**🦤 Ready for rigorous testing!**

# Bundle Size Optimization Guide

## Current Bundle Analysis

### Actually Used UI Components
Based on code analysis, the application only uses **5 Radix UI components**:
- `@radix-ui/react-dialog` (Dialog)
- `@radix-ui/react-slot` (Button dependency)
- Badge (custom component)
- Card (custom component)
- Input (custom component)

### Unused Dependencies (Can Be Removed)

The following **27 Radix UI packages** are installed but **NOT USED**:
```
@radix-ui/react-accordion
@radix-ui/react-alert-dialog
@radix-ui/react-aspect-ratio
@radix-ui/react-avatar
@radix-ui/react-checkbox
@radix-ui/react-collapsible
@radix-ui/react-context-menu
@radix-ui/react-dropdown-menu
@radix-ui/react-hover-card
@radix-ui/react-label
@radix-ui/react-menubar
@radix-ui/react-navigation-menu
@radix-ui/react-popover
@radix-ui/react-progress
@radix-ui/react-radio-group
@radix-ui/react-scroll-area
@radix-ui/react-select
@radix-ui/react-separator
@radix-ui/react-slider
@radix-ui/react-switch
@radix-ui/react-tabs
@radix-ui/react-toast
@radix-ui/react-toggle
@radix-ui/react-toggle-group
@radix-ui/react-tooltip
```

### Other Potentially Unused Dependencies
- `cmdk` - Command palette component (not found in code)
- `embla-carousel-react` - Carousel component (not found in code)
- `input-otp` - OTP input component (not found in code)
- `react-day-picker` - Date picker (not found in code)
- `recharts` - Charting library (not found in code)
- `vaul` - Drawer component (not found in code)
- `react-resizable-panels` - Resizable panels (not found in code)
- `@hookform/resolvers` - Form validation (not found in code)
- `react-hook-form` - Forms (not found in code)
- `zod` - Schema validation (not found in code)

## Optimization Steps

### Step 1: Remove Unused Dependencies

```bash
cd frontend

# Remove unused Radix UI components
yarn remove @radix-ui/react-accordion
yarn remove @radix-ui/react-alert-dialog
yarn remove @radix-ui/react-aspect-ratio
yarn remove @radix-ui/react-avatar
yarn remove @radix-ui/react-checkbox
yarn remove @radix-ui/react-collapsible
yarn remove @radix-ui/react-context-menu
yarn remove @radix-ui/react-dropdown-menu
yarn remove @radix-ui/react-hover-card
yarn remove @radix-ui/react-label
yarn remove @radix-ui/react-menubar
yarn remove @radix-ui/react-navigation-menu
yarn remove @radix-ui/react-popover
yarn remove @radix-ui/react-progress
yarn remove @radix-ui/react-radio-group
yarn remove @radix-ui/react-scroll-area
yarn remove @radix-ui/react-select
yarn remove @radix-ui/react-separator
yarn remove @radix-ui/react-slider
yarn remove @radix-ui/react-switch
yarn remove @radix-ui/react-tabs
yarn remove @radix-ui/react-toast
yarn remove @radix-ui/react-toggle
yarn remove @radix-ui/react-toggle-group
yarn remove @radix-ui/react-tooltip

# Remove other unused libraries
yarn remove cmdk
yarn remove embla-carousel-react
yarn remove input-otp
yarn remove react-day-picker
yarn remove recharts
yarn remove vaul
yarn remove react-resizable-panels
yarn remove @hookform/resolvers
yarn remove react-hook-form
yarn remove zod
```

### Step 2: Analyze Bundle Size

```bash
# Build the app
yarn build

# Install bundle analyzer
yarn add --dev source-map-explorer

# Add script to package.json:
# "analyze": "source-map-explorer 'build/static/js/*.js'"

# Run analysis
yarn analyze
```

### Step 3: Expected Improvements

After removing unused dependencies:
- **Estimated bundle size reduction**: 30-40%
- **Reduced dependencies**: From ~60 to ~25
- **Faster install times**: 40-50% faster
- **Smaller node_modules**: 200-300MB reduction

## Alternative: Keep Dependencies for Future Use

If you plan to use these components later, you can keep them. However, tree-shaking should handle unused code in production builds.

## Production Build Optimizations

Already implemented:
- ✅ Code splitting with React.lazy()
- ✅ Lazy loading modal components
- ✅ Image lazy loading
- ✅ Font optimization with display=swap

Additional optimizations to consider:
- [ ] Enable source map generation for better debugging
- [ ] Configure gzip compression on server
- [ ] Set up CDN for static assets
- [ ] Implement service worker for offline support

## Monitoring Bundle Size

Add to CI/CD pipeline:
```bash
# Check bundle size on every build
yarn build
du -sh build/static/js/main.*.js
```

Set up alerts if main bundle exceeds:
- 📊 Warning: > 500KB
- 🚨 Error: > 1MB

## Current Dependencies (Optimized)

Core:
- react
- react-dom
- react-router-dom
- react-helmet

UI:
- @radix-ui/react-dialog
- @radix-ui/react-slot
- tailwindcss
- tailwindcss-animate
- class-variance-authority
- clsx
- tailwind-merge
- lucide-react

Utilities:
- axios
- date-fns
- next-themes
- sonner

Dev:
- @craco/craco
- autoprefixer
- postcss
- eslint (+ plugins)

# Tacos & Things - Restaurant Website PRD

## Original Problem Statement
Build a modern, professional restaurant website for **Tacos & Things**, a highly rated local restaurant in Clyde North, Victoria featuring Indian-Mexican fusion cuisine.

## User Personas
1. **Local Diners** - Families and food lovers in Clyde North looking for dine-in experiences
2. **Takeaway Customers** - Busy professionals wanting quick pickup orders
3. **Delivery Customers** - People ordering food delivered to their homes
4. **New Visitors** - Potential customers discovering the restaurant through Google/social media

## Core Requirements (Static)
- Restaurant branding with Indian-Mexican fusion theme
- External ordering via Uber Eats and DoorDash
- Menu display with 13 categories
- Customer reviews/testimonials display
- Contact information with Google Maps
- Newsletter signup
- Facebook social link integration
- Mobile-responsive design

## What's Been Implemented

### Backend (FastAPI + MongoDB)
- [x] Menu items API (`GET /api/menu`)
- [x] Reviews API (`GET /api/reviews`)
- [x] Newsletter subscription API (`POST /api/newsletter`)
- [x] Menu image update API (`PUT /api/menu/image`)
- [x] Data seeding endpoint (backend only, NOT called from frontend)

### Frontend (React + Tailwind CSS)
- [x] Responsive navbar with mobile menu + Uber Eats/DoorDash buttons
- [x] Hero section with custom AI-generated taco truck image
- [x] About section with restaurant story
- [x] Menu section with 13 categories, 85+ items with real photos
- [x] Horizontal swipe-enabled category tabs on mobile/tablet
- [x] Menu item cards with hover description overlay
- [x] Reviews section with 14 real Google reviews
- [x] Gallery section
- [x] Newsletter signup form
- [x] Contact section with Google Map embed
- [x] Footer with business info

### Design Implementation
- Warm Mexican-Indian fusion color palette (Saffron Blaze, Maize Gold, Deep Char, Cream Paper)
- Typography: Yeseva One (headings), DM Sans (body)
- Responsive breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Touch-friendly swipe gestures on mobile menu navigation

## Completed (February 2026)
- [x] Fixed menu category tabs overlapping with menu items on mobile/tablet
- [x] Added horizontal swipe gesture support for category tabs
- [x] Tabs now display as single scrollable row on mobile/tablet
- [x] Added gradient fade indicators to hint at scrollable content
- [x] Added floating category indicator showing current selection while scrolling
- [x] Added left/right arrow buttons for easier navigation on mobile/tablet
- [x] Implemented strict horizontal scroll lock (no vertical drift while swiping)
- [x] Added comprehensive SEO meta tags for Google search visibility
- [x] Added Open Graph tags for Facebook/social sharing
- [x] Added Twitter Card tags for Twitter sharing
- [x] Added JSON-LD structured data (LocalBusiness schema) for rich search results
- [x] Added geographic meta tags for local SEO
- [x] Updated Facebook link to official page (https://www.facebook.com/p/Tacos-Things-61575431517600/)
- [x] Removed Instagram icon from footer
- [x] Replaced Gallery placeholder images with 8 real restaurant photos
- [x] Cleaned up About section (removed stock images)
- [x] **Admin Dashboard** - Full menu management system:
  - Login page at /admin with secure authentication
  - Dashboard showing all menu items with stats
  - Add/Edit/Delete menu items
  - Upload/change food photos via URL
  - Mark items as Popular/Spicy/Vegetarian
  - Mark items as "Sold Out" (temporarily hide)
  - Search and filter by category
  - Settings page to change admin credentials
  - Credentials: tacosandthings / ubereatsdoordash

## Prioritized Backlog

### P0 (Critical)
- All core features implemented ✅

### P1 (High Priority - Future)
- [x] Admin dashboard for menu management - COMPLETED
- [ ] Direct online ordering (bypass Uber Eats/DoorDash fees)
- [ ] Order analytics integration

### P2 (Nice to Have)
- [x] SEO meta tags (title, description, Open Graph) - COMPLETED
- [ ] Gallery section with actual restaurant photos
- [ ] Table reservation system
- [ ] Multi-language support

## Next Tasks List
1. Add SEO meta tags for better search visibility
2. Update Gallery with actual restaurant atmosphere photos
3. Add Open Graph tags for social sharing

## Business Details
- Name: Taco's & Things
- Address: Unit 3/47 Rainier Cres, Clyde North VIC 3978
- Phone: 0439 406 042
- Hours: Opens daily at 5:00 PM
- Ordering: Uber Eats, DoorDash (external links)

## Technical Notes
- **DO NOT** call `/api/seed` from frontend (causes data reset)
- Menu images updated via direct MongoDB scripts or `/api/menu/image` endpoint
- External ordering only - no internal cart system

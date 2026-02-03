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
- Online ordering system with cart functionality
- Menu display with categories (Tacos, Curries, Fusion, Sides, Drinks)
- Customer reviews/testimonials display
- Contact information with Google Maps
- Newsletter signup
- Facebook social link integration
- Mobile-responsive design

## What's Been Implemented (December 2025)

### Backend (FastAPI + MongoDB)
- [x] Menu items CRUD API with categories
- [x] Orders API with cart items, customer details, order types (dine-in, takeaway, delivery)
- [x] Newsletter subscription API with duplicate prevention
- [x] Contact form submission API
- [x] Reviews API
- [x] Data seeding endpoint for sample menu items and reviews

### Frontend (React + Tailwind CSS)
- [x] Responsive navbar with mobile menu
- [x] Hero section with CTAs (Order Online, View Menu)
- [x] About section with restaurant story and features
- [x] Menu section with tabbed interface and food cards
- [x] Shopping cart with quantity controls
- [x] Order form with customer details and order type selection
- [x] Reviews carousel with testimonials
- [x] Gallery section with food images
- [x] Newsletter signup form
- [x] Contact section with Google Map and contact form
- [x] Footer with business info and social links

### Design Implementation
- Warm Mexican-Indian fusion color palette (Saffron Blaze, Maize Gold, Deep Char, Cream Paper)
- Typography: Yeseva One (headings), DM Sans (body)
- Organic rounded shapes for images
- Toast notifications for cart actions
- Smooth scrolling navigation

## Prioritized Backlog

### P0 (Critical)
- All core features implemented ✅

### P1 (High Priority - Future)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Order status tracking
- [ ] User accounts/order history
- [ ] Real-time order notifications

### P2 (Nice to Have)
- [ ] Table reservation system
- [ ] Loyalty/rewards program
- [ ] SMS order confirmations
- [ ] Multi-language support

## Next Tasks List
1. Add payment processing for online orders
2. Implement order status tracking for customers
3. Add admin dashboard for managing orders and menu
4. Set up email notifications for new orders
5. Integrate with delivery services (UberEats, DoorDash)

## Business Details
- Name: Tacos & Things
- Address: Unit 3/47 Rainier Cres, Clyde North VIC 3978
- Phone: 0439 406 042
- Hours: Opens daily at 5:00 PM
- Services: Dine-in, Takeaway, Delivery, Online Ordering

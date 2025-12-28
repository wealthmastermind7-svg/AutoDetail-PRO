# AutoDetail Pro - Design Guidelines

## App Identity
**Name:** AutoDetail Pro  
**Tagline:** "Professional auto care, seamlessly booked"  
**Aesthetic:** Premium black & white with oversized typography and glass morphism effects

## Color Palette (Premium Black & White)
- **Pure Black** (#000000) - Primary text, high-emphasis elements
- **Charcoal** (#1A1A1A) - Cards, elevated surfaces
- **Graphite** (#2D2D2D) - Secondary containers
- **Slate** (#4A4A4A) - Dividers, borders
- **Smoke** (#6B6B6B) - Secondary text
- **Silver** (#9E9E9E) - Tertiary text
- **Fog** (#D4D4D4) - Disabled states
- **Whisper** (#EBEBEB) - Subtle backgrounds
- **Pearl** (#F5F5F5) - Light surfaces
- **Pure White** (#FFFFFF) - Primary background

## Typography (Oversized Hierarchy)
- **Display:** 72-96px, weight 200 - Hero numbers (revenue, booking counts)
- **Headline 1:** 48-56px, weight 700 - Section titles
- **Headline 2:** 32-40px, weight 600 - Card headers
- **Body Large:** 24px, weight 400 - Primary content
- **Body:** 18px, weight 400 - Standard text
- **Caption:** 14px, weight 400 - Metadata, timestamps

## Spacing Scale
- **xs:** 4px
- **sm:** 8px
- **md:** 12px
- **lg:** 16px
- **xl:** 20px
- **2xl:** 24px
- **3xl:** 32px
- **4xl:** 40px
- **5xl:** 48px
- **Input/Button Height:** 56px

## Border Radius
- **xs:** 8px
- **sm:** 12px
- **md:** 16px
- **lg:** 20px
- **xl:** 24px
- **2xl:** 32px
- **full:** 9999px

## Animation Timing
- **fast:** 150ms
- **normal:** 200ms
- **slow:** 300ms
- **cinematic:** 400ms
- **graph:** 600ms
- **Spring config:** damping 15, mass 0.3, stiffness 150

## Visual Design Principles
1. **Glass Morphism:** Use expo-blur and glass effects for hero cards and elevated surfaces
2. **Minimal Shadows:** Rely on color contrast and glass effects over heavy shadows
3. **Data Visualization:** Bezier curve line graphs with 600ms staggered animation
4. **Circular Progress Indicators:** For capacity meters and goal tracking
5. **Full-Width Cards:** Services and bookings use edge-to-edge cards with internal padding

## Navigation Architecture
### Admin Dashboard (5-Tab Navigator)
1. **Dashboard** - Revenue metrics, graphs, upcoming appointments
2. **Calendar** - Monthly grid, day detail, availability editor
3. **Services** - CRUD for detailing packages
4. **Customers** - Customer list and booking history
5. **Settings** - Business info, sharing tools, premium features

### Public Booking Flow (Stack Navigator)
1. Select Service → 2. Select Time → 3. Checkout → 4. Confirmation

## Screen-Specific Guidelines

### Onboarding (3 Pages)
- Cinematic spring animations for element entry
- Glass cards with blur effects
- Pagination dots and skip option
- "Get Started" primary CTA + "Log in" secondary link

### Dashboard
- **Hero Card:** Large display numbers (72px), circular capacity meter, glass effect
- **Revenue Graph:** Black line on white, bezier curves, minimal grid, 600ms animation
- **Appointments List:** Toggle "This Week" (top 3) vs "All", cards with customer/service/time

### Calendar
- **Monthly Grid:** Circular day indicators (filled black for booked, outlined for today, inverted for selected)
- **Day Detail:** Time-block list of appointments
- **Availability Editor:** 7-day grid with start/end time pickers, enable/disable toggles

### Services
- **List View:** Cards with service name (32px), price in display type (40px), duration, active toggle
- **Editor Modal:** Auto-save drafts, clean form layout (56px inputs)

### Settings
- **Sharing Tools:** Copy link button, QR code display modal, embed snippet
- **Premium Paywall:** Trigger when free tier limits hit (3 shares/week, 3 QR codes/week)

### Public Booking
- **Service Cards:** Full-width with imagery, large price (56px), duration/description
- **Time Selection:** Calendar grid + available slots in 30-min increments
- **Checkout:** Customer form (56px inputs), summary card, terms checkbox
- **Confirmation:** Animated checkmark, booking reference, "Add to Calendar" option

## Interaction Patterns
- **Haptic Feedback:** On button presses, successful actions, and selection changes
- **Spring Animations:** For card entries, modal presentations, and list items
- **Skeleton UI:** For loading states on customer lists and booking previews
- **Auto-save:** For service drafts and availability changes
- **Double Confirmation:** For destructive actions (delete service, clear data)

## Accessibility
- Maintain 4.5:1 contrast ratio minimum (Pure Black on Pure White meets WCAG AA)
- Touch targets minimum 44x44px (inputs use 56px height)
- Support dynamic type scaling for typography
- Provide text alternatives for circular progress indicators

## Monetization UI
- **Free Tier Counter:** Display weekly share/QR usage in Settings
- **Premium Badge:** Subtle indicator for premium status
- **Paywall:** Trigger modally when limits exceeded, show feature comparison
- **Restore Purchases:** Button in Settings for existing subscribers
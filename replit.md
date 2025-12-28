# AutoDetail Pro - Professional Auto Detailing Booking Platform

## Overview
AutoDetail Pro is a professional auto detailing booking platform built with Expo and React Native. It features a premium black & white design system with glass morphism effects, targeting both business owners (admin dashboard) and customers (public booking flow).

## Current State
- **Status**: MVP Complete
- **Last Updated**: December 2025
- **Platform**: Expo (React Native) with Express backend

## Architecture

### Frontend (client/)
- **Framework**: Expo/React Native with React Navigation 7+
- **State Management**: React Query for server state, AsyncStorage for persistence
- **Styling**: Premium black & white design system with glass morphism effects
- **Animations**: React Native Reanimated with spring animations (damping: 15, mass: 0.3, stiffness: 150)

### Backend (server/)
- **Framework**: Express.js with TypeScript
- **Database**: AsyncStorage (MVP) - designed for future PostgreSQL migration
- **API**: RESTful endpoints for data operations

## Key Features

### Admin Dashboard (5-Tab Navigation)
1. **Dashboard**: Revenue graphs (SVG Bezier curves), capacity meters, upcoming bookings
2. **Calendar**: Monthly view, day selection, business hours editing
3. **Services**: CRUD operations, active/inactive toggles, pricing management
4. **Customers**: List with search, detail views, booking history
5. **Settings**: Business info, booking link sharing, QR code generation, demo data

### Public Booking Flow
1. Service selection with pricing
2. Date/time slot selection
3. Customer info checkout
4. Animated confirmation screen

### Onboarding (3 Pages)
1. Welcome screen
2. Feature overview
3. Get started prompt

## File Structure
```
client/
├── screens/           # All app screens
│   ├── DashboardScreen.tsx
│   ├── CalendarScreen.tsx
│   ├── ServicesScreen.tsx
│   ├── CustomersScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── BookingSelectServiceScreen.tsx
│   ├── BookingSelectTimeScreen.tsx
│   ├── BookingCheckoutScreen.tsx
│   ├── BookingConfirmationScreen.tsx
│   ├── ServiceEditorScreen.tsx
│   ├── CustomerDetailScreen.tsx
│   ├── AvailabilityEditorScreen.tsx
│   └── QRCodeScreen.tsx
├── navigation/        # Navigation configuration
│   ├── RootStackNavigator.tsx
│   └── AdminTabNavigator.tsx
├── components/        # Reusable components
├── constants/         # Theme and design tokens
│   └── theme.ts
├── lib/               # Utilities
│   └── storage.ts     # AsyncStorage data management
└── hooks/             # Custom hooks
```

## Design System

### Typography
- Display: 72-96px (thin weight)
- Headlines: 48-56px
- Card Headers: 32-40px
- Body: 16px
- Caption: 12-14px

### Colors (Premium Black & White)
- Pure Black: #000000
- Pure White: #FFFFFF
- Fog: #F5F5F5
- Stone: #8E8E93
- Obsidian: #1C1C1E

### Animation Spring Config
```typescript
spring: {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
}
```

## Data Management

### Storage Keys
- `autodetail_services` - Service offerings
- `autodetail_bookings` - Customer bookings
- `autodetail_customers` - Customer records
- `autodetail_availability` - Weekly availability schedule
- `autodetail_business` - Business information
- `autodetail_onboarding` - Onboarding completion status

### Default Services (6)
1. Full Detail - $249.99
2. Interior Detail - $149.99
3. Exterior Detail - $99.99
4. Paint Correction - $399.99
5. Ceramic Coating - $599.99
6. Express Wash - $49.99

## Commands
- `npm run dev` - Start development server
- Port 8081: Expo web app
- Port 5000: Express API server

## User Preferences
- Premium black & white aesthetic
- Glass morphism effects
- Oversized typography
- Spring animations with specific parameters
- Expo Go compatible only

## Recent Changes
- December 2025: Initial MVP complete with all 17 screens
- Full admin dashboard with 5 tabs
- Complete public booking flow
- QR code generation with custom SVG rendering
- Demo data loading capability

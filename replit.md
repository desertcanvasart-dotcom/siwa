# Soléi Travel Platform

## Overview

Soléi is a modern travel platform showcasing Egypt's North Coast and Siwa Oasis destinations. Built as a full-stack web application, it combines a React frontend with an Express.js backend, featuring a clean, tourism-focused design with luxury travel experiences.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: TSX for TypeScript execution
- **API Structure**: RESTful API with `/api` prefix routing
- **Error Handling**: Centralized error middleware
- **Logging**: Custom request/response logging middleware

### Data Storage Solutions
- **Database**: PostgreSQL (configured but not actively used yet)
- **ORM**: Drizzle ORM with schema definitions
- **Connection**: Neon Database serverless driver
- **Current Storage**: In-memory storage implementation (MemStorage class)
- **Migration**: Drizzle Kit for database migrations

### Database Schema
```typescript
// User entity with basic authentication fields
users {
  id: serial (primary key)
  username: text (unique, not null)
  password: text (not null)
}
```

## Key Components

### Frontend Components
- **Navigation**: Fixed header with smooth scrolling navigation
- **Hero Section**: Full-screen landing with call-to-action buttons
- **Destinations Overview**: Interactive preview cards for both destinations
- **North Coast Section**: Detailed showcase of Mediterranean luxury experiences
- **Siwa Section**: Desert oasis adventure and cultural experiences
- **Experiences Section**: Curated activity highlights
- **Contact Section**: Lead generation form with validation
- **Footer**: Brand information and legal links

### Custom Hooks
- **useIntersectionObserver**: Scroll-based element visibility detection
- **useLazyVideo**: Performance-optimized video loading and playback
- **useIsMobile**: Responsive design breakpoint detection
- **useToast**: User notification system

### Backend Services
- **Storage Interface**: Abstracted CRUD operations for data persistence
- **Route Registration**: Modular API endpoint setup
- **Vite Integration**: Development server with HMR support

## Data Flow

### Client-Side Flow
1. React application loads with Vite dev server
2. TanStack Query manages API state and caching
3. Components use custom hooks for enhanced functionality
4. Form submissions trigger toast notifications
5. Smooth scrolling navigation between sections

### Server-Side Flow
1. Express server handles API requests under `/api` prefix
2. Requests logged with timing and response data
3. Storage interface abstracts data operations
4. Error middleware provides consistent error handling
5. Vite middleware serves frontend in development

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Framework**: Radix UI components, Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query for server state
- **Utilities**: clsx, date-fns, class-variance-authority
- **Development**: Vite, TypeScript, PostCSS

### Backend Dependencies
- **Core**: Express.js, TypeScript, TSX runtime
- **Database**: Drizzle ORM, Neon Database driver, PostgreSQL
- **Validation**: Zod for schema validation
- **Session**: Connect-pg-simple for PostgreSQL sessions
- **Build**: esbuild for production bundling

### Development Tools
- **Replit Integration**: Custom plugins for development environment
- **Error Handling**: Runtime error overlay for development
- **Code Quality**: TypeScript strict mode, ESLint configuration

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reload**: Vite HMR with backend restart on changes

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server to `dist/index.js`
- **Assets**: Static file serving from build output
- **Environment**: Production NODE_ENV with optimizations

### Deployment Configuration
- **Platform**: Replit autoscale deployment
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Health Check**: Port 5000 availability check

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

✓ September 17, 2025 - Added hotel navigation links and improved UX:
  - Added proper navigation links to all hotel cards on North Coast page
  - Connected hotel cards to individual hotel pages with correct routes
  - Improved horizontal scrolling with complete card sets and smooth snap scrolling
  - Enhanced responsive behavior with proper breakpoints for different screen sizes
  - Added dual navigation options: hover overlay buttons and main content links

✓ July 9, 2025 - Fixed critical admin dashboard issues:
  - Resolved Select component validation errors by replacing empty string values with "all"
  - Fixed Zod validation error in experience updates by handling updatedAt field properly
  - Implemented tiered pricing system with custom rates for 2-8 guests
  - Added comprehensive pricing fields to admin experience editor
  - Created public API endpoint for experience data retrieval
  - Updated booking pages to display dynamic pricing based on guest count

✓ July 9, 2025 - Enhanced admin content management:
  - Improved image upload and filtering system
  - Added page-specific image organization
  - Fixed authentication token handling in API requests

## Payment Processing Strategy

**Current Approach**: Request-based booking system without online payment processing
- Customers can browse hotels and send booking requests
- No payment collection at booking time
- Stripe implementation kept in codebase for future activation
- When Stripe account is available, payment processing can be easily enabled

**Future Plans**: Stripe integration ready for activation
- Complete Stripe infrastructure already implemented
- Payment components and forms ready to use
- Secure payment processing ready to activate when Stripe account is set up

## Changelog

Changelog:
- June 23, 2025. Initial setup
- July 9, 2025. Admin dashboard improvements and tiered pricing system
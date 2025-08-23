# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
bun install          # Install dependencies
bun run dev          # Start local development server (Vinxi)
npx convex dev       # Start Convex backend development server

# Testing  
bun run test         # Run test suite with Vitest
bun run test -- path/to/test.spec.tsx  # Run a specific test file

# Building & Production
bun run build        # Create production build
bun run start        # Start production server

# Note: This project uses Bun as the runtime, not Node.js
```

## Architecture Overview

This is a **test/exam management platform** with two primary user roles:
- **Organizers**: Create and manage tests through `/app/*` routes
- **Participants**: Take tests through participant routes

### Tech Stack
- **Runtime**: Bun (not Node.js)
- **Frontend**: TanStack Start (React 19 meta-framework) with file-based routing
- **Backend**: Convex (serverless backend) with real-time capabilities
- **Database**: Convex's built-in database with schema validation
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Editor**: TipTap for rich text editing in questions
- **Build/Deploy**: Vinxi bundler, AWS Lambda with streaming support

### Key Architectural Patterns

**Route Organization**:
- `(organizer)/app/*` - Protected organizer dashboard and test management
- `(participant)/*` - Public-facing test-taking interface
- Routes use TanStack Router with type-safe file-based routing

**Data Flow**:
1. Convex server functions handle all backend logic (in `convex/` directory)
2. Frontend uses generated Convex React hooks for type-safe data fetching
3. Real-time updates via Convex subscriptions
4. TanStack Query integration for caching and synchronization

**Component Structure**:
- `components/pages/` - Full page components for specific routes
- `components/shared/` - Reusable business components
- `components/ui/` - Base UI primitives from shadcn/ui
- Custom hooks in `hooks/` for business logic abstraction

**Authentication**:
- Convex Auth handles authentication
- Protected routes use `<Authenticated>` wrapper
- Role-based access control between organizers and participants

**Real-time Features**:
- Test presence tracking with heartbeat system for live monitoring
- Live participant status updates during tests
- Real-time test submission and result processing

### Database Schema

Key entities:
- `test`, `testSection`, `question` - Test structure
- `testAttempt`, `testAttemptAnswer` - Participant submissions  
- `testPresence` - Real-time presence tracking
- `organization`, `organizer` - Multi-tenant support

### Testing Approach

Tests use Vitest with React Testing Library. Test files should follow the pattern `*.test.tsx` or `*.spec.tsx`.
**Note**: Testing infrastructure is configured but no test files currently exist in the codebase.

### Deployment

The app is configured for AWS Lambda deployment via Vinxi with streaming support.
- TypeScript path aliases: `@/*` → `./src/*`, `@convex/*` → `convex/*`
- Environment configuration: `.env.local` for Convex deployment settings
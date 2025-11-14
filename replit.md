# Overview

This is a 3D endless runner game called "Digital Safety Runner" (عداء الأمان الرقمي) built with React Three Fiber. The game features an Arabic/RTL interface where players control a character running through a futuristic cityscape, collecting coins and power-ups while avoiding obstacles. The game includes educational messages about digital safety and cybersecurity.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript running in a Vite development environment.

**3D Rendering**: React Three Fiber (@react-three/fiber) serves as the core 3D rendering engine, with Three.js as the underlying WebGL framework. The architecture uses @react-three/drei for helper components and utilities, and @react-three/postprocessing for visual effects.

**UI Component Library**: Radix UI primitives provide accessible, unstyled components. These are styled using Tailwind CSS with a custom design system defined through CSS variables for theming (colors, borders, spacing). The combination allows for rapid development of accessible UI components while maintaining design consistency.

**State Management**: Zustand is used for global state management with two primary stores:
- `useStepChallenge`: Manages game state (score, distance, player position, lane switching, obstacles)
- `useAudio`: Manages sound effects and background music

The architecture uses Zustand's subscribeWithSelector middleware for reactive state updates.

**Routing Strategy**: Single-page application without routing - the game uses phase-based rendering (menu → playing → gameover) controlled by state.

## Game Architecture

**Scene Structure**: The game uses a modular component architecture:
- `GameScene`: Canvas wrapper containing all 3D elements
- `Player`: Character model with physics (jumping, sliding)
- `Ground`: Infinite scrolling ground tiles
- `Environment`: Procedurally generated buildings
- `Obstacles`: Dynamic obstacle generation with collision detection
- `Collectibles`: Coin and power-up spawning system
- `Camera`: Dynamic camera following the player with speed-based positioning

**Physics System**: Custom physics implementation using React Three Fiber's `useFrame` hook for:
- Gravity and jump mechanics
- Lane switching with lerp smoothing
- Collision detection based on player bounds and object positions
- Progressive difficulty through speed increases

**Asset Loading**: Uses @react-three/drei's `useGLTF` for loading 3D models (GLB format). Models are cloned for instancing to optimize performance.

## Backend Architecture

**Server Framework**: Express.js server with TypeScript, configured for both development (with Vite middleware) and production builds.

**Storage Layer**: In-memory storage implementation (`MemStorage`) following an interface-based design (`IStorage`). This allows for easy migration to database storage without changing application code. Currently implements basic user CRUD operations.

**Development vs Production**: 
- Development: Vite dev server with HMR integrated via middleware
- Production: Static file serving with pre-built client assets

**API Design**: RESTful API pattern with `/api` prefix for all endpoints. Currently minimal backend functionality as the game runs entirely client-side.

## Data Storage

**Database**: PostgreSQL via Neon serverless (@neondatabase/serverless)

**ORM**: Drizzle ORM with schema-first approach. Schema is defined in `shared/schema.ts` and shared between client and server. The configuration uses push-based migrations rather than traditional migration files.

**Schema Design**: Currently implements a minimal `users` table with username/password authentication. The schema uses Drizzle-Zod for runtime validation of insert operations.

**Rationale**: Drizzle was chosen for its TypeScript-first design and lightweight footprint. Neon provides serverless PostgreSQL with edge compatibility and automatic scaling.

## Styling System

**CSS Framework**: Tailwind CSS with a custom configuration extending the default theme. Uses CSS custom properties for theming, enabling dynamic color schemes and dark mode support.

**Design Tokens**: Centralized design system using CSS variables (--primary, --secondary, --accent, etc.) mapped to HSL color values. This approach allows runtime theme changes and consistent styling across components.

**RTL Support**: The application supports right-to-left layout for Arabic text, configured at the HTML level with `dir="rtl"` and appropriate Tailwind utilities.

## External Dependencies

**Third-party Libraries**:
- `@tanstack/react-query`: Data fetching and caching (configured but minimal usage due to client-side game logic)
- `date-fns`: Date manipulation utilities
- `nanoid`: Unique ID generation
- `zod`: Runtime type validation and schema definition
- `class-variance-authority` & `clsx`: Conditional className utilities

**3D Assets**: The game expects GLB model files in `/public/models/` (player.glb, coin.glb, virus.glb) and audio files in `/public/sounds/` (hit.mp3, success.mp3, background.mp3).

**Font Loading**: Inter font loaded via @fontsource/inter for consistent typography.

**Build Tools**:
- Vite: Development server and build tool with React plugin
- esbuild: Server-side bundling for production
- tsx: TypeScript execution for development server
- vite-plugin-glsl: GLSL shader support for custom 3D effects

**Development Environment**: Configured for Replit with custom error overlay (@replit/vite-plugin-runtime-error-modal) for enhanced debugging experience.
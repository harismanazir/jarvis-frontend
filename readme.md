# Jarvis - Personal AI Assistant

## Overview

Jarvis is a personal AI assistant application that provides a conversational interface through both text and voice interactions. The application features a modern React frontend with a webcam feed and chat interface, designed to create an immersive AI assistant experience. The project is built as a full-stack web application with a clean, responsive UI that supports both text-based conversations and voice recordings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a component-based architecture:

- **Framework**: React 18+ with Vite for fast development and building
- **Styling**: Tailwind CSS with a comprehensive design system using CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible components
- **State Management**: React hooks with local state management and React Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Layout**: Two-column responsive design with webcam stream on the left and chat interface on the right

### Component Structure
The application is organized into several key components:

- **JarvisUI**: Main container component managing the overall layout and state
- **WebcamStream**: Handles live camera feed using react-webcam
- **ChatBox**: Manages text-based conversations with scrollable message history
- **AudioRecorder**: Handles voice recording functionality with media recorder API
- **VoicePlayer**: Plays AI-generated audio responses with progress tracking
- **Navbar**: Fixed navigation with app branding and dark/light mode toggle

### Backend Architecture
The backend follows a modular Express.js architecture:

- **Framework**: Express.js with TypeScript for type safety
- **Development**: Hot reloading with Vite integration during development
- **Storage Interface**: Abstracted storage layer with in-memory implementation (expandable to database)
- **API Structure**: RESTful endpoints with `/api` prefix for clear separation

### Data Management
- **Database**: Configured for PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: User management schema with username/password fields
- **Migrations**: Database migrations managed through Drizzle Kit
- **Session Storage**: Connect-pg-simple for PostgreSQL-backed session storage

### Real-time Features
- **Webcam Integration**: Live camera feed using getUserMedia API
- **Audio Recording**: Real-time audio capture with MediaRecorder API
- **Voice Playback**: Audio response playback with progress controls
- **Chat Interface**: Real-time message exchange with loading states

### Styling and Theming
- **Design System**: Comprehensive CSS variable-based theming supporting light/dark modes
- **Color Palette**: Neutral base with primary blue accent and custom Jarvis green
- **Typography**: Multiple font families (Inter, Georgia, Menlo) for different contexts
- **Responsive Design**: Mobile-first approach with flexible layouts

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database connection for PostgreSQL
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **drizzle-zod**: Schema validation integration
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Frontend Libraries
- **react-webcam**: Webcam component for camera integration
- **@tanstack/react-query**: Server state management and caching
- **axios**: HTTP client for API communication
- **wouter**: Lightweight React router
- **date-fns**: Date manipulation and formatting

### UI Framework
- **@radix-ui/***: Comprehensive collection of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **cmdk**: Command palette component

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

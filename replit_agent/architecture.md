# Kubra Market Admin Panel - Architecture Documentation

## Overview

The Kubra Market Admin Panel is a web application designed to manage an e-commerce marketplace. It provides functionality for managing shop categories, shops, orders, and transactions. The application follows a client-server architecture with a React frontend and a Node.js/Express backend. Data is stored in a PostgreSQL database, accessed through the Drizzle ORM.

## System Architecture

The application uses a monorepo structure with clear separation between client and server code:

```
project/
├── client/         # Frontend React application
├── server/         # Backend Express API
├── shared/         # Shared code (schemas, types)
├── migrations/     # Database migrations
└── public/         # Static assets
```

### Key Technologies

- **Frontend**: React, React Query, Wouter (routing), ShadCN UI components
- **Backend**: Node.js, Express, PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based authentication
- **Build Tools**: Vite, esbuild, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state

## Key Components

### Frontend Architecture

The frontend is a single-page application built with React, featuring:

1. **Routing**: Uses Wouter for lightweight client-side routing
2. **Component Structure**:
   - Pages - Container components for each route
   - Layout components - Sidebar, Header, etc.
   - UI components - Reusable UI elements (based on ShadCN UI)
   - Feature-specific components - For shops, orders, etc.
3. **State Management**:
   - React Query for server state and API calls
   - React Context for authentication and global state
4. **Styling**: Tailwind CSS with custom theme variables

### Backend Architecture

The backend is an Express.js application with the following components:

1. **API Routes**: RESTful endpoints for resources (shops, orders, etc.)
2. **Authentication**: Passport.js with session-based authentication
3. **Database Access**: Drizzle ORM for database operations
4. **Middleware**: For request logging, error handling, session management
5. **Static File Serving**: For the client application

### Data Model

The application uses PostgreSQL with Drizzle ORM. The main entities are:

1. **Users**: System administrators with authentication information
2. **Shop Categories**: Categories for shops 
3. **Shops**: Marketplace vendors grouped by categories
4. **Orders**: Customer orders placed on the marketplace
5. **Transactions**: Financial transactions related to orders

The schemas are defined in `shared/schema.ts` and used by both frontend and backend.

### Authentication and Authorization

The application implements a session-based authentication system:

1. **Login**: Username/password authentication via Passport.js
2. **Session Management**: Express-session with PostgreSQL store for persistence
3. **Protected Routes**: React components wrapped with authentication checks
4. **Password Security**: Scrypt for password hashing and verification

## Data Flow

### API Request Flow

1. Client makes a request to the server API endpoint
2. Server middleware (authentication, logging) processes the request
3. Route handler executes appropriate business logic
4. Database queries are executed via Drizzle ORM
5. Response is sent back to the client
6. React Query manages the data cache and UI updates

### Authentication Flow

1. User submits credentials via login form
2. Credentials are validated on the server
3. On success, a session is created and stored
4. Session ID is stored in a cookie on the client
5. Subsequent requests include the session cookie
6. Protected routes check for valid session

## External Dependencies

### Frontend Dependencies

- React ecosystem (react, react-dom)
- Tailwind CSS for styling
- ShadCN UI for UI components
- React Query for API state management
- Wouter for client-side routing
- Zod for validation
- Lucide React for icons

### Backend Dependencies

- Express.js for API server
- Passport.js for authentication
- Drizzle ORM for database operations
- PostgreSQL for data storage
- Express-session for session management
- Neon Serverless for PostgreSQL connection (when deployed)

## Deployment Strategy

The application supports multiple deployment strategies:

1. **Development**: 
   - Using `npm run dev` to start both client and server
   - Hot module replacement via Vite
   - In-memory session store

2. **Production**:
   - Client is built to static assets with Vite
   - Server is bundled with esbuild
   - PostgreSQL is used for session storage
   - Environment variables control configuration

3. **Containerization**:
   - The application can be containerized for deployment
   - Database credentials are injected via environment variables

4. **Replit Deployment**:
   - Configuration for Replit hosting is included
   - Adapts to the Replit environment using environment detection

### Environment Configuration

- `NODE_ENV` determines the runtime environment
- `DATABASE_URL` for PostgreSQL connection
- `SESSION_SECRET` for securing session cookies

## Development Workflow

The project supports a standard development workflow:

1. Local development with hot reloading
2. Type checking with TypeScript
3. Database schema management with Drizzle
4. Production builds for deployment

For Windows users, a specific setup guide and batch file are provided to simplify the development experience.
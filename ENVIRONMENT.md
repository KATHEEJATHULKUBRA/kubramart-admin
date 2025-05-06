# Environment Configuration Guide

This document provides information about the environment variables used in the Kubra Market Admin application.

## Setup Instructions

1. Copy the `.env.example` file to create a new `.env` file:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file with your specific configuration values.

3. Ensure that your `.env` file is listed in `.gitignore` to avoid committing sensitive information.

## Available Environment Variables

### Server Configuration
- `PORT`: The port number the server will listen on (default: 5000)
- `NODE_ENV`: The environment mode (development, production, test)
- `SESSION_SECRET`: Secret key for session management (important for security)

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `PGHOST`: PostgreSQL host
- `PGUSER`: PostgreSQL username
- `PGDATABASE`: PostgreSQL database name
- `PGPORT`: PostgreSQL port
- `PGPASSWORD`: PostgreSQL password

### Authentication
- `JWT_SECRET`: Secret key for JWT token generation (for future implementation)
- `JWT_EXPIRES_IN`: JWT token expiration period (for future implementation)

### Application URLs
- `CLIENT_URL`: Front-end application URL
- `API_URL`: Back-end API URL

### Feature Flags
- `ENABLE_EMAIL_NOTIFICATIONS`: Enable/disable email notifications
- `ENABLE_SMS_NOTIFICATIONS`: Enable/disable SMS notifications

### External Services (Commented Out - For Future Use)
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `EMAIL_FROM`: Default sender email address

## Replit Environment

When deploying on Replit, the database connection details are automatically provided in the environment.
These variables should not be modified in the Replit environment.

## Development vs Production

Different environment variables might be needed for development and production environments.
Make sure to set appropriate values depending on your environment.
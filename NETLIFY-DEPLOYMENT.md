# Deploying Kubra Market Admin to Netlify

This guide will walk you through deploying the Kubra Market Admin application to Netlify for free.

## Prerequisites

1. A Netlify account (free tier is sufficient)
2. Git repository with your project

## Step 1: Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

## Step 2: Connect to Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your Kubra Market Admin repository

## Step 3: Configure Build Settings

In the Netlify deployment settings, configure:

- Build command: `npm run build`
- Publish directory: `dist`

These settings are already defined in the `netlify.toml` file, but it's good to verify them.

## Step 4: Configure Environment Variables

1. In the Netlify site dashboard, go to Site settings > Build & deploy > Environment
2. Add the following environment variables:
   - `NODE_ENV`: Set to `production`
   - `SESSION_SECRET`: A secure random string for session management
   - `DATABASE_URL`: Your PostgreSQL connection string

## Step 5: Connect to a Database

For the backend functionality, you'll need a PostgreSQL database:

### Option 1: Neon (Serverless PostgreSQL)
1. Create a free account on [Neon](https://neon.tech/)
2. Create a new project and database
3. Copy the connection string and set it as the `DATABASE_URL` environment variable in Netlify

### Option 2: Supabase
1. Create a free account on [Supabase](https://supabase.com/)
2. Create a new project and get the PostgreSQL connection details
3. Use these details to form a connection string and set it as the `DATABASE_URL` in Netlify

## Step 6: Deploy

1. Click "Deploy site" in Netlify
2. Netlify will build and deploy your application
3. Once deployment is complete, Netlify will provide you with a URL for your site (e.g., https://kubra-market-admin.netlify.app)

## Step 7: Verify Deployment

1. Visit your Netlify site URL
2. Try logging in with your admin credentials
3. Verify that all functions are working as expected

## Troubleshooting

If you encounter issues:

1. Check the Netlify deployment logs for errors
2. Verify that all environment variables are set correctly
3. Ensure your database is accessible from Netlify's servers
4. Check the browser console for any client-side errors
5. Make sure the serverless functions are working by visiting `/.netlify/functions/api/health`

## Limitations

When using the free tier of Netlify:

1. Serverless functions have a timeout of 10 seconds
2. There's a limit of 125,000 function invocations per month
3. Functions are limited to 128MB of memory

These limits should be sufficient for a small to medium-sized admin panel.

## Custom Domain (Optional)

To use a custom domain:

1. In the Netlify site dashboard, go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your domain's DNS settings

Netlify provides free SSL certificates for all sites, including those with custom domains.
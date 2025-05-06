# Windows Setup Guide for Kubra Market Admin

This guide provides instructions for setting up and running the Kubra Market Admin application on Windows systems.

## Prerequisites

1. **Node.js**: Make sure you have Node.js installed (v16 or higher).
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation by running `node -v` in Command Prompt or PowerShell

2. **Git**: Install Git for Windows
   - Download from [git-scm.com](https://git-scm.com/download/win)

## Installation Steps

1. **Clone or Download the Repository**
   - Clone using Git: `git clone <repository-url>`
   - Or download and extract the ZIP file

2. **Install Dependencies**
   - Open Command Prompt or PowerShell in the project directory
   - Run: `npm install`

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Edit `.env` file to set any custom configuration
   - Note: For local development, you don't need to set up a database

## Running the Application

### Option 1: Using the Batch File (Recommended)

The easiest way to run the application on Windows is using the provided batch file:

1. Double-click on `start-app.bat` in the project directory
   - Or run it from Command Prompt: `.\start-app.bat`

2. The application will start using in-memory storage (no database needed)

3. Open your browser and navigate to: `http://localhost:5000`

4. Log in with the default credentials:
   - Username: `admin`
   - Password: `admin123`

### Option 2: Using npm with cross-env

If you prefer using npm commands:

1. Open Command Prompt or PowerShell in the project directory

2. Run the following command:
   ```
   npx cross-env NODE_ENV=development npx tsx server/index.ts
   ```

3. Access the application at: `http://localhost:5000`

## Troubleshooting

### Issue: "NODE_ENV is not recognized as an internal or external command"
- Solution: Use the batch file `start-app.bat` or use the cross-env approach

### Issue: Application fails to start with database errors
- Solution: The application is set up to use in-memory storage by default
- Make sure you're not trying to use DATABASE_URL in your environment

### Issue: Windows Security Warning
- Solution: If Windows shows a security warning when running the batch file, click "More info" and then "Run anyway"

### Issue: Port Already in Use
- Solution: Change the port in your .env file (e.g., PORT=3000)

## Setting Up a Database (Optional)

If you want to use a real database:

1. Install PostgreSQL locally or use a cloud service
2. Set DATABASE_URL in your .env file
3. Edit start-app.bat to use your database connection

## Additional Resources

- Check the `ENVIRONMENT.md` file for details on configuring environment variables
- Check the `NETLIFY-DEPLOYMENT.md` file for information on deploying to Netlify
# VS Code Setup for Kubra Market Admin

This guide shows you how to run Kubra Market Admin directly from VS Code.

## Running the Application in VS Code

### Method 1: Using VS Code Debugger (Recommended)

1. Press `F5` or click the "Run and Debug" icon in the left sidebar
2. Select "Launch Kubra Market Admin" from the dropdown menu
3. The application will start with debugging enabled
4. Open your browser and navigate to [http://localhost:5000](http://localhost:5000)

### Method 2: Using VS Code Task

1. Press `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)
2. The "Start Kubra Market Admin" task will run automatically
3. Open your browser and navigate to [http://localhost:5000](http://localhost:5000)

### Method 3: Using VS Code Terminal

1. Open Terminal in VS Code: `Ctrl+` or View → Terminal
2. Run the command:
   ```
   npx cross-env NODE_ENV=development npx tsx server/index.ts
   ```
3. Open your browser and navigate to [http://localhost:5000](http://localhost:5000)

## Login Credentials

- Username: `admin`
- Password: `admin123`

## Troubleshooting

- **Port Already in Use**: If port 5000 is already being used, edit the port in `server/index.ts` and update the port in these instructions.
- **Node.js Version**: This application requires Node.js v16 or higher. Check your version with `node -v` in terminal.
- **Dependencies**: If you encounter missing dependency errors, run `npm install` to install all required packages.

## VS Code Features

This project is configured with:

- Debugging support with source maps
- Task automation for starting the application
- Recommended settings for TypeScript and JavaScript
- Improved terminal configuration for Windows compatibility
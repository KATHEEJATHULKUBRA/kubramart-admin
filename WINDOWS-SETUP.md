# Running Kubra Market Admin Panel on Windows

This guide will help you run the Kubra Market Admin Panel on Windows without requiring a database.

## Prerequisites
- Node.js (version 16 or later)
- npm (comes with Node.js)
- VS Code or another code editor

## Setup Steps

### 1. Clone or download the repository
Download the project and extract it to a folder of your choice.

### 2. Open the project folder in VS Code
- Open VS Code
- Go to File -> Open Folder
- Select the project's root folder (not the client subfolder)

### 3. Install dependencies
Open a terminal in VS Code (Terminal -> New Terminal) and run:
```
npm install
```

### 4. Start the application

#### Option 1: Using the provided batch file
Simply double-click the `start-app.bat` file in the project's root directory, or run it from the terminal:
```
.\start-app.bat
```

#### Option 2: Using npx directly
Run the following command in your terminal:
```
set NODE_ENV=development && npx tsx server/index.ts
```

#### Option 3: Using cross-env (recommended for different environments)
We've installed the cross-env package which makes it easier to set environment variables across platforms:
```
npx cross-env NODE_ENV=development tsx server/index.ts
```

### 5. Access the application
Open your browser and navigate to:
```
http://localhost:5000
```

You should see the login page for the Kubra Market Admin Panel.

## Login Credentials
Use these credentials to log in:
- Username: `admin`
- Password: `admin123`

These credentials are for the default admin user that is automatically created in the in-memory storage.

## Notes
- This setup uses in-memory storage, so no database connection is required
- All data will be reset when the server restarts
- The application includes sample data for testing
- Changes made during a session will be lost when the server stops

## Troubleshooting

### "tsx is not recognized as an internal or external command"
This can happen if the global node_modules path is not in your system's PATH. Try using the npx prefix:
```
npx tsx server/index.ts
```

### Port 5000 is already in use
If port 5000 is already in use, you'll need to modify the server to use a different port:
1. Open `server/index.ts`
2. Find the line that sets the port (likely `const PORT = process.env.PORT || 5000;`)
3. Change 5000 to another port (e.g., 3000)
4. Save and restart the application

### Other issues
If you encounter other issues, try:
1. Delete the `node_modules` folder
2. Run `npm install` again
3. Restart your computer
4. Try running the application again
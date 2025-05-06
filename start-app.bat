@echo off
echo Starting Kubra Market Admin Panel...
set NODE_ENV=development
REM Comment this line out if you have a real database to connect to
echo Using in-memory storage (no database)

npx tsx server/index.ts
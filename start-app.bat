@echo off
echo Starting Kubra Market Admin Panel...

REM Setting NODE_ENV directly for this process
set NODE_ENV=development

REM Comment this line out if you have a real database to connect to
echo Using in-memory storage (no database)

REM Use cross-env to ensure NODE_ENV is properly set
npx cross-env NODE_ENV=development npx tsx server/index.ts
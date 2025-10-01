@echo off
REM FlowVeda Backend Startup Script for Windows

echo Starting FlowVeda Backend...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env from example...
    copy .env.example .env
    echo Please configure .env with your settings
)

REM Start the server
echo Starting server on port 8000...
call npm start


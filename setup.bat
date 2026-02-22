@echo off
REM pH Bandage System - Setup Script (Windows)
REM This script automates the installation and startup process

color 0A
echo.
echo ================================================
echo pH Bandage System - Automated Setup (Windows)
echo ================================================
echo.

REM Check Node.js installation
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)
echo OK - Node.js found
echo.

REM Check MongoDB
echo Checking MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: MongoDB not found in PATH
    echo Make sure MongoDB is running as a Windows Service before starting the backend!
    echo.
    pause
) else (
    echo OK - MongoDB found
    echo.
)

REM Setup Backend
echo ================================================
echo Setting up Backend...
echo ================================================
echo.

cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Backend installation failed
        pause
        exit /b 1
    )
    echo OK - Backend dependencies installed
) else (
    echo OK - Backend dependencies already installed
)

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env >nul
    echo OK - .env created
) else (
    echo OK - .env already exists
)

echo.
echo ================================================
echo Database Seeding
echo ================================================
echo.
set /p SEED="Would you like to seed sample data? (y/n): "
if /i "%SEED%"=="y" (
    echo.
    echo Seeding database with sample data...
    call npm run seed
    if errorlevel 1 (
        echo.
        echo WARNING: Database seeding failed. Check MongoDB is running.
        echo.
    ) else (
        echo.
        echo OK - Database seeded successfully
        echo.
        echo Test Credentials:
        echo   Admin:  admin@hospital.com / password123
        echo   Doctor: sarah@hospital.com / password123
        echo   Nurse:  emily@hospital.com / password123
        echo.
    )
) else (
    echo Skipping database seeding
)

cd ..
echo.

REM Setup Frontend
echo ================================================
echo Setting up Frontend...
echo ================================================
echo.

cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Frontend installation failed
        pause
        exit /b 1
    )
    echo OK - Frontend dependencies installed
) else (
    echo OK - Frontend dependencies already installed
)

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env >nul
    echo OK - .env created
) else (
    echo OK - .env already exists
)

cd ..
echo.

REM Completion
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo To start the application:
echo.
echo Command Prompt 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Command Prompt 2 (Frontend):
echo   cd frontend
echo   npm start
echo.
echo Frontend will open at: http://localhost:3000
echo Backend API running at: http://localhost:5000
echo.
echo For more information, see:
echo   - QUICKSTART.md (5-minute setup)
echo   - README.md (full documentation)
echo   - API.md (API reference)
echo.
echo ================================================
echo.

pause

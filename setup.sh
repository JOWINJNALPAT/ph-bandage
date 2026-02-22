#!/bin/bash

# pH Bandage System - Setup Script
# This script automates the installation and startup process

echo "================================================"
echo "🏥 pH Bandage System - Automated Setup"
echo "================================================"
echo ""

# Check Node.js installation
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version) found"
echo ""

# Check MongoDB
echo "🗄️  Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH. Make sure it's running before starting the backend!"
    echo "   - Windows: Search for 'Services' and start MongoDB"
    echo "   - Mac: brew services start mongodb-community"
    echo "   - Linux: sudo systemctl start mongod"
else
    echo "✅ MongoDB found"
fi
echo ""

# Setup Backend
echo "================================================"
echo "⚙️  Setting up Backend..."
echo "================================================"
echo ""

cd backend

if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Backend installation failed"
        exit 1
    fi
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies already installed"
fi

# Check and copy .env
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env created (using defaults)"
else
    echo "✅ .env already exists"
fi

echo ""
echo "================================================"
echo "📊 Would you like to seed sample data? (y/n)"
echo "================================================"
read -p "Seed database (y/n)? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database with sample data..."
    npm run seed
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully"
        echo ""
        echo "Test Credentials:"
        echo "  👤 Admin:  admin@hospital.com / password123"
        echo "  👨‍⚕️  Doctor: sarah@hospital.com / password123"
        echo "  👩‍⚕️  Nurse:  emily@hospital.com / password123"
    else
        echo "❌ Database seeding failed. Check MongoDB is running."
    fi
else
    echo "⏭️  Skipping database seeding"
fi

echo ""

# Navigate back
cd ..

# Setup Frontend
echo "================================================"
echo "⚙️  Setting up Frontend..."
echo "================================================"
echo ""

cd frontend

if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Frontend installation failed"
        exit 1
    fi
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi

# Check and copy .env
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env created (using defaults)"
else
    echo "✅ .env already exists"
fi

echo ""
cd ..

# Completion
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  $ cd backend"
echo "  $ npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  $ cd frontend"
echo "  $ npm start"
echo ""
echo "Frontend will open at: http://localhost:3000"
echo "Backend API running at: http://localhost:5000"
echo ""
echo "📖 For more information, see:"
echo "  - QUICKSTART.md (5-minute setup)"
echo "  - README.md (full documentation)"
echo "  - API.md (API reference)"
echo ""
echo "================================================"

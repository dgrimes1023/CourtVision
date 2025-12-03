#!/bin/bash
# CourtVision Quick Start Script
# This script sets up and runs the entire application

echo "🏀 CourtVision - Checkpoint 2 Setup"
echo "===================================="

# Check if PostgreSQL is running
echo ""
echo "Step 1: Checking PostgreSQL..."
if ! sudo service postgresql status > /dev/null 2>&1; then
    echo "Starting PostgreSQL..."
    sudo service postgresql start
fi

# Create database
echo ""
echo "Step 2: Setting up database..."
read -p "Enter PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Enter PostgreSQL password: " DB_PASS
echo ""

# Create database if it doesn't exist
export PGPASSWORD=$DB_PASS
psql -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw courtvision
if [ $? -ne 0 ]; then
    echo "Creating courtvision database..."
    psql -U $DB_USER -c "CREATE DATABASE courtvision;"
fi

# Run schema
echo "Running schema..."
psql -U $DB_USER -d courtvision -f schema/schema.sql > /dev/null 2>&1

# Run functions
echo "Creating SQL functions..."
psql -U $DB_USER -d courtvision -f schema/functions.sql > /dev/null 2>&1

# Optional: Run seed data
read -p "Load sample data? (y/n): " LOAD_SEED
if [ "$LOAD_SEED" = "y" ]; then
    echo "Loading sample data..."
    psql -U $DB_USER -d courtvision -f schema/seed.sql
fi

# Setup Python API
echo ""
echo "Step 3: Setting up Python API..."
cd api

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=courtvision
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
EOF

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate and install dependencies
source venv/bin/activate
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

cd ..

# Setup Frontend
echo ""
echo "Step 4: Setting up Next.js frontend..."
cd frontend

# Install Node dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install --silent
fi

cd ..

# Done
echo ""
echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo ""
echo "Terminal 1 (API):"
echo "  cd api"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"

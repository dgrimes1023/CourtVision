#!/bin/bash
# CourtVision Complete Setup Script
# Automates database creation, schema loading, and data import

set -e  # Exit on error

echo "======================================"
echo "🏀 CourtVision Setup Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if database name is provided
DB_NAME=${1:-courtvision}

echo -e "${YELLOW}Setting up database: $DB_NAME${NC}"
echo ""

# Step 1: Create database
echo "📦 Step 1: Creating database..."
if createdb $DB_NAME 2>/dev/null; then
    echo -e "${GREEN}✓ Database '$DB_NAME' created${NC}"
else
    echo -e "${YELLOW}⚠ Database '$DB_NAME' already exists, skipping creation${NC}"
fi
echo ""

# Step 2: Load schema
echo "📊 Step 2: Loading schema (tables, indexes, constraints)..."
if psql -d $DB_NAME -f schema/schema.sql > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Schema loaded successfully${NC}"
else
    echo -e "${RED}✗ Failed to load schema${NC}"
    exit 1
fi
echo ""

# Step 3: Load functions
echo "⚙️  Step 3: Loading functions and triggers..."
if psql -d $DB_NAME -f schema/functions.sql > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Functions and triggers loaded${NC}"
else
    echo -e "${RED}✗ Failed to load functions${NC}"
    exit 1
fi
echo ""

# Step 4: Load seed data
echo "🌱 Step 4: Loading seed data..."
if psql -d $DB_NAME -f schema/seed.sql > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Seed data loaded${NC}"
else
    echo -e "${RED}✗ Failed to load seed data${NC}"
    exit 1
fi
echo ""

# Step 5: Verify setup
echo "🔍 Step 5: Verifying setup..."
TABLE_COUNT=$(psql -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
TABLE_COUNT=$(echo $TABLE_COUNT | tr -d ' ')

if [ "$TABLE_COUNT" -ge "22" ]; then
    echo -e "${GREEN}✓ Database has $TABLE_COUNT tables${NC}"
else
    echo -e "${RED}✗ Expected at least 22 tables, found $TABLE_COUNT${NC}"
    exit 1
fi
echo ""

echo "======================================"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Configure your database credentials in api/.env"
echo "  2. Run: python3 load_data.py (to import CSV datasets)"
echo "  3. Run: cd api && python main.py (to start API)"
echo "  4. Run: cd frontend && npm run dev (to start UI)"
echo ""
echo "Access the application:"
echo "  - Frontend: http://localhost:3000"
echo "  - API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""

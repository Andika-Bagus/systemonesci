#!/bin/bash

echo "🚀 Starting Laravel Deployment Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Rename .env
echo -e "${YELLOW}Step 1: Setting up environment file...${NC}"
if [ -f ".env-server" ]; then
    cp .env-server .env
    echo -e "${GREEN}✅ .env configured${NC}"
else
    echo -e "${RED}❌ .env-server not found!${NC}"
    exit 1
fi
echo ""

# Step 2: Set permissions
echo -e "${YELLOW}Step 2: Setting permissions...${NC}"
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
echo -e "${GREEN}✅ Permissions set${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${YELLOW}Step 3: Installing composer dependencies...${NC}"
if command -v composer &> /dev/null; then
    composer install --no-dev --optimize-autoloader
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Composer not found! Please install composer first.${NC}"
    echo "Run: php -d memory_limit=-1 /usr/local/bin/composer install --no-dev --optimize-autoloader"
fi
echo ""

# Step 4: Clear cache
echo -e "${YELLOW}Step 4: Clearing cache...${NC}"
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
echo -e "${GREEN}✅ Cache cleared${NC}"
echo ""

# Step 5: Run migrations
echo -e "${YELLOW}Step 5: Running migrations...${NC}"
php artisan migrate --force
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations completed${NC}"
else
    echo -e "${RED}❌ Migration failed! Check database credentials.${NC}"
fi
echo ""

# Step 6: Create super admin
echo -e "${YELLOW}Step 6: Creating super admin...${NC}"
php artisan make:superadmin itmaintainance@gmail.com SuperAdmin123! "IT Maintenance"
echo ""

# Step 7: Optimize for production
echo -e "${YELLOW}Step 7: Optimizing for production...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo -e "${GREEN}✅ Optimization complete${NC}"
echo ""

# Final checks
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment setup completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test API: curl https://speed-api.syntax.co.id/"
echo "2. Test login with: itmaintainance@gmail.com / SuperAdmin123!"
echo "3. Check logs: tail -f storage/logs/laravel.log"
echo ""
echo -e "${YELLOW}If you encounter issues:${NC}"
echo "- Check storage/logs/laravel.log"
echo "- Verify database credentials in .env"
echo "- Run: php artisan optimize:clear"
echo ""

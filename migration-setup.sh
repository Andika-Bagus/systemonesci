#!/bin/bash

echo "🔄 Starting Server Migration Setup..."
echo ""
echo "⚠️  IMPORTANT: Database harus sudah di-import sebelum run script ini!"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Confirmation
read -p "Apakah database sudah di-import? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo -e "${RED}❌ Import database dulu sebelum melanjutkan!${NC}"
    exit 1
fi
echo ""

# Step 1: Setup .env
echo -e "${YELLOW}Step 1: Setting up environment file...${NC}"
if [ -f ".env-production-new" ]; then
    cp .env-production-new .env
    echo -e "${GREEN}✅ .env configured${NC}"
elif [ -f ".env-server" ]; then
    echo -e "${YELLOW}⚠️  Using .env-server as fallback${NC}"
    cp .env-server .env
    echo -e "${YELLOW}⚠️  JANGAN LUPA update domain & database credentials!${NC}"
else
    echo -e "${RED}❌ .env-production-new or .env-server not found!${NC}"
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
    echo -e "${RED}❌ Composer not found!${NC}"
    echo "Run manually: php -d memory_limit=-1 /usr/local/bin/composer install --no-dev --optimize-autoloader"
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

# Step 5: Test database connection
echo -e "${YELLOW}Step 5: Testing database connection...${NC}"
php artisan tinker --execute="echo 'Total users: ' . App\Models\User::count();" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database connected successfully!${NC}"
else
    echo -e "${RED}❌ Database connection failed!${NC}"
    echo -e "${YELLOW}Check your .env database credentials${NC}"
fi
echo ""

# Step 6: Optimize for production
echo -e "${YELLOW}Step 6: Optimizing for production...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo -e "${GREEN}✅ Optimization complete${NC}"
echo ""

# Final summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Migration setup completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT NOTES:${NC}"
echo ""
echo "1. ✅ Database sudah ter-import dengan semua data users"
echo "2. ✅ TIDAK perlu run migrations (data sudah ada)"
echo "3. ✅ APP_KEY harus SAMA dengan server lama"
echo "4. ⚠️  Update .env jika belum:"
echo "   - APP_URL (domain baru)"
echo "   - DB_DATABASE, DB_USERNAME, DB_PASSWORD"
echo "   - SESSION_DOMAIN"
echo "   - SANCTUM_STATEFUL_DOMAINS"
echo "   - FRONTEND_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify .env configuration"
echo "2. Test: curl https://your-new-domain.com/"
echo "3. Test login dengan user lama"
echo "4. Check logs: tail -f storage/logs/laravel.log"
echo ""
echo -e "${GREEN}Migration ready! 🚀${NC}"

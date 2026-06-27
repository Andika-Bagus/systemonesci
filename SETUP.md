# Setup Environment

## Environment Files

Proyek ini memiliki beberapa file environment untuk berbagai keperluan:

### 1. Production Environment (`.env`)
- Digunakan untuk server production
- Domain: `speed-api.syntax.co.id` (backend) dan `pagespeed.syntax.co.id` (frontend)
- Database: MySQL production
- Debug: OFF
- Session: Secure cookies enabled

### 2. Local Development Environment (`.env.local`)
- Digunakan untuk development lokal
- URL: `http://localhost:8000` (backend) dan `http://localhost:3000` (frontend)
- Database: SQLite (default) atau MySQL lokal
- Debug: ON
- Session: Non-secure cookies untuk localhost

### 3. Template Environment (`.env.example`)
- Template untuk setup baru
- Copy ke `.env.local` untuk development

## Setup untuk Development Lokal

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Generate application key:**
   ```bash
   php artisan key:generate --env=local
   ```

3. **Setup database:**
   - Untuk SQLite (default): File sudah ada di `database/database.sqlite`
   - Untuk MySQL: Uncomment konfigurasi MySQL di `.env.local` dan buat database

4. **Run migrations:**
   ```bash
   php artisan migrate --env=local
   ```

5. **Seed database (optional):**
   ```bash
   php artisan db:seed --env=local
   ```

6. **Start development server:**
   ```bash
   php artisan serve --env=local
   ```

## Frontend Setup

File environment frontend sudah dikonfigurasi:
- **Production:** `frontend/.env.production` → `https://speed-api.syntax.co.id/api`
- **Local:** `frontend/.env.local` → `http://localhost:8000/api`

## CORS Configuration

CORS sudah dikonfigurasi untuk mendukung:
- Production: `pagespeed.syntax.co.id`, `syntax.co.id`
- Development: `localhost:3000`, `localhost:5173` (Vite dev server)

## Sanctum Configuration

Sanctum stateful domains sudah dikonfigurasi untuk:
- Production: `pagespeed.syntax.co.id`, `syntax.co.id`, `speed-api.syntax.co.id`
- Development: `localhost:3000`, `localhost:5173`, `localhost:8000`
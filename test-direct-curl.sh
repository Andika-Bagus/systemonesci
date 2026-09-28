#!/bin/bash

echo "=== DIRECT CURL TEST ==="
echo ""

# Get user and create token
echo "1. Creating test token..."
TOKEN=$(php -r "
require 'vendor/autoload.php';
\$app = require_once 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
\$user = \App\Models\User::find(27);
if (!\$user) { \$user = \App\Models\User::first(); }
\$token = \$user->createToken('curl-test')->plainTextToken;
echo \$token;
")

echo "Token: ${TOKEN:0:40}..."
echo ""

# Test 1: Try without full URL (internal)
echo "2. Testing authenticate endpoint (internal)..."
curl -X POST \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"ojs_admin","password":"OJS_Secure_2026!"}' \
  http://localhost/api/ojs-secure/authenticate

echo -e "\n"

# Test 2: Try with full URL
echo "3. Testing authenticate endpoint (external URL)..."
curl -X POST \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"ojs_admin","password":"OJS_Secure_2026!"}' \
  https://api.itmsci.com/api/ojs-secure/authenticate

echo -e "\n"

# Test 3: Try verify endpoint (should work)
echo "4. Testing verify endpoint..."
curl -X POST \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"session_token":"test"}' \
  https://api.itmsci.com/api/ojs-secure/verify

echo -e "\n"

# Cleanup
php -r "
require 'vendor/autoload.php';
\$app = require_once 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
\App\Models\User::find(27)->tokens()->delete();
"

echo "Done."

<?php

/**
 * Quick fix: Add authenticate route dynamically
 * This is temporary test to verify if adding route fixes the issue
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "\n=== CHECKING ROUTES ===\n\n";

// Get all routes
$routes = \Route::getRoutes();

echo "Looking for ojs-secure routes...\n\n";

$ojsRoutes = [];
foreach ($routes as $route) {
    $uri = $route->uri();
    if (str_contains($uri, 'ojs-secure')) {
        $methods = implode('|', $route->methods());
        $ojsRoutes[] = sprintf("%-10s %s", $methods, $uri);
    }
}

if (empty($ojsRoutes)) {
    echo "✗ No ojs-secure routes found!\n";
} else {
    echo "Found " . count($ojsRoutes) . " ojs-secure routes:\n";
    foreach ($ojsRoutes as $route) {
        echo "  {$route}\n";
    }
}

echo "\n";

// Check if authenticate route exists
$authenticateExists = false;
foreach ($routes as $route) {
    if ($route->uri() === 'api/ojs-secure/authenticate') {
        $authenticateExists = true;
        echo "✓ /api/ojs-secure/authenticate EXISTS\n";
        echo "  Methods: " . implode(', ', $route->methods()) . "\n";
        echo "  Action: " . $route->getActionName() . "\n";
        break;
    }
}

if (!$authenticateExists) {
    echo "✗ /api/ojs-secure/authenticate DOES NOT EXIST\n";
    echo "\nThis means routes/api.php needs to be updated on server!\n";
    echo "\nExpected route definition:\n";
    echo "Route::post('/authenticate', [OjsSecureController::class, 'authenticate']);\n";
}

echo "\n";

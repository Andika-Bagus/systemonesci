<?php

/**
 * Verify All OJS Secure Files on Server
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n";
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║   VERIFY OJS SECURE FILES - SERVER                        ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

$issues = [];
$checks = 0;
$passed = 0;

// 1. Check Controller
echo "1. BACKEND CONTROLLER\n";
echo str_repeat("-", 60) . "\n";

$controllerPath = __DIR__ . '/app/Http/Controllers/OjsSecureController.php';
if (file_exists($controllerPath)) {
    echo "✓ OjsSecureController.php exists\n";
    $content = file_get_contents($controllerPath);
    
    // Check for required methods
    $methods = ['authenticate', 'verify', 'getInstances', 'logout', 'sessionInfo'];
    foreach ($methods as $method) {
        $checks++;
        if (strpos($content, "function {$method}") !== false) {
            echo "  ✓ Method {$method}() found\n";
            $passed++;
        } else {
            echo "  ✗ Method {$method}() MISSING\n";
            $issues[] = "Controller missing method: {$method}()";
        }
    }
    
    // Check for user ID usage
    $checks++;
    if (strpos($content, '$request->user()->id') !== false) {
        echo "  ✓ Uses \$request->user()->id\n";
        $passed++;
    } else {
        echo "  ✗ Not using \$request->user()->id\n";
        $issues[] = "Controller not using Laravel auth user";
    }
} else {
    echo "✗ OjsSecureController.php NOT FOUND\n";
    $issues[] = "Controller file missing";
    $checks++;
}
echo "\n";

// 2. Check Models
echo "2. MODELS\n";
echo str_repeat("-", 60) . "\n";

$models = [
    'OjsSecureSession' => __DIR__ . '/app/Models/OjsSecureSession.php',
    'OjsInstance' => __DIR__ . '/app/Models/OjsInstance.php',
];

foreach ($models as $name => $path) {
    $checks++;
    if (file_exists($path)) {
        echo "✓ {$name}.php exists\n";
        $passed++;
    } else {
        echo "✗ {$name}.php MISSING\n";
        $issues[] = "Model {$name} missing";
    }
}
echo "\n";

// 3. Check Routes
echo "3. ROUTES\n";
echo str_repeat("-", 60) . "\n";

$routes = \Route::getRoutes();
$ojsRoutes = [];
foreach ($routes as $route) {
    if (str_contains($route->uri(), 'ojs-secure')) {
        $methods = implode('|', $route->methods());
        $ojsRoutes[] = sprintf("%-10s %s", $methods, $route->uri());
    }
}

$requiredRoutes = [
    'api/ojs-secure/authenticate',
    'api/ojs-secure/verify',
    'api/ojs-secure/instances',
    'api/ojs-secure/logout',
    'api/ojs-secure/session',
];

foreach ($requiredRoutes as $required) {
    $checks++;
    $found = false;
    foreach ($routes as $route) {
        if ($route->uri() === $required) {
            echo "✓ {$required}\n";
            $found = true;
            $passed++;
            break;
        }
    }
    if (!$found) {
        echo "✗ {$required} MISSING\n";
        $issues[] = "Route missing: {$required}";
    }
}
echo "\n";

// 4. Check Database
echo "4. DATABASE\n";
echo str_repeat("-", 60) . "\n";

$checks++;
if (\Schema::hasTable('ojs_secure_sessions')) {
    echo "✓ ojs_secure_sessions table exists\n";
    $passed++;
    
    // Check indexes
    $indexes = \DB::select("SHOW INDEX FROM ojs_secure_sessions");
    $indexNames = [];
    foreach ($indexes as $idx) {
        $indexNames[] = $idx->Key_name;
    }
    
    $checks++;
    if (in_array('PRIMARY', $indexNames)) {
        echo "  ✓ PRIMARY key exists\n";
        $passed++;
    } else {
        echo "  ✗ PRIMARY key MISSING\n";
        $issues[] = "Table missing PRIMARY key";
    }
    
    // Check for (session_token, user_id) index
    $hasCorrectIndex = false;
    $indexGroups = [];
    foreach ($indexes as $idx) {
        $indexGroups[$idx->Key_name][] = $idx->Column_name;
    }
    
    $checks++;
    foreach ($indexGroups as $name => $columns) {
        if (in_array('session_token', $columns) && in_array('user_id', $columns)) {
            echo "  ✓ Index (session_token, user_id) exists\n";
            $hasCorrectIndex = true;
            $passed++;
            break;
        }
    }
    
    if (!$hasCorrectIndex) {
        echo "  ✗ Index (session_token, user_id) MISSING\n";
        $issues[] = "Table missing required index - run migration 2026_07_09";
    }
} else {
    echo "✗ ojs_secure_sessions table MISSING\n";
    $issues[] = "Table ojs_secure_sessions not found - run migrations";
}
echo "\n";

// 5. Check Config
echo "5. CONFIGURATION\n";
echo str_repeat("-", 60) . "\n";

$corsConfig = config('cors');
$checks++;
if (in_array('X-OJS-Session', $corsConfig['exposed_headers'])) {
    echo "✓ X-OJS-Session in exposed_headers\n";
    $passed++;
} else {
    echo "✗ X-OJS-Session NOT in exposed_headers\n";
    $issues[] = "CORS config missing X-OJS-Session";
}

$checks++;
if (env('OJS_SECURE_USERNAME')) {
    echo "✓ OJS_SECURE_USERNAME set\n";
    $passed++;
} else {
    echo "✗ OJS_SECURE_USERNAME NOT SET\n";
    $issues[] = "Environment variable OJS_SECURE_USERNAME missing";
}

$checks++;
if (env('OJS_SECURE_PASSWORD')) {
    echo "✓ OJS_SECURE_PASSWORD set\n";
    $passed++;
} else {
    echo "✗ OJS_SECURE_PASSWORD NOT SET\n";
    $issues[] = "Environment variable OJS_SECURE_PASSWORD missing";
}
echo "\n";

// Summary
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║   SUMMARY                                                  ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

$percentage = $checks > 0 ? round(($passed / $checks) * 100) : 0;

echo "Total Checks: {$checks}\n";
echo "Passed: {$passed}\n";
echo "Failed: " . ($checks - $passed) . "\n";
echo "Success Rate: {$percentage}%\n\n";

if (count($issues) > 0) {
    echo "ISSUES FOUND:\n";
    echo str_repeat("-", 60) . "\n";
    foreach ($issues as $i => $issue) {
        echo ($i + 1) . ". {$issue}\n";
    }
    echo "\n";
} else {
    echo "✓✓✓ ALL CHECKS PASSED! ✓✓✓\n\n";
}

echo "Next Steps:\n";
if (count($issues) > 0) {
    echo "1. Fix the issues listed above\n";
    echo "2. Run: php artisan migrate\n";
    echo "3. Run: php artisan route:clear\n";
    echo "4. Run: php artisan config:clear\n";
    echo "5. Re-run this script\n";
} else {
    echo "1. All backend files verified\n";
    echo "2. Upload frontend dist/ folder\n";
    echo "3. Test in browser with Console open (F12)\n";
}

echo "\n";

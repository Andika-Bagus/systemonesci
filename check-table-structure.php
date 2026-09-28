<?php

/**
 * Check ojs_secure_sessions table structure on server
 * Compare with wp_secure_sessions
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n";
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║   CHECK TABLE STRUCTURE - OJS vs WP Secure                ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

// Check if tables exist
$ojsExists = \Schema::hasTable('ojs_secure_sessions');
$wpExists = \Schema::hasTable('wp_secure_sessions');

echo "Tables Existence:\n";
echo "  ojs_secure_sessions: " . ($ojsExists ? "✓ EXISTS" : "✗ NOT FOUND") . "\n";
echo "  wp_secure_sessions:  " . ($wpExists ? "✓ EXISTS" : "✗ NOT FOUND") . "\n\n";

if (!$ojsExists) {
    echo "✗ ojs_secure_sessions table not found!\n";
    echo "  Run: php artisan migrate\n\n";
    exit(1);
}

// Get table structure
echo "OJS Secure Sessions Table Structure:\n";
echo str_repeat("-", 60) . "\n";

$ojsColumns = \DB::select("DESCRIBE ojs_secure_sessions");
foreach ($ojsColumns as $col) {
    $null = $col->Null === 'YES' ? 'NULL' : 'NOT NULL';
    $key = $col->Key ? " [{$col->Key}]" : "";
    echo sprintf("  %-20s %-20s %-10s%s\n", $col->Field, $col->Type, $null, $key);
}
echo "\n";

// Get indexes
echo "OJS Secure Sessions Indexes:\n";
echo str_repeat("-", 60) . "\n";
$ojsIndexes = \DB::select("SHOW INDEX FROM ojs_secure_sessions");
$indexGroups = [];
foreach ($ojsIndexes as $idx) {
    $indexGroups[$idx->Key_name][] = $idx->Column_name;
}
foreach ($indexGroups as $name => $columns) {
    echo "  {$name}: " . implode(', ', $columns) . "\n";
}
echo "\n";

if ($wpExists) {
    echo "WP Secure Sessions Table Structure:\n";
    echo str_repeat("-", 60) . "\n";
    
    $wpColumns = \DB::select("DESCRIBE wp_secure_sessions");
    foreach ($wpColumns as $col) {
        $null = $col->Null === 'YES' ? 'NULL' : 'NOT NULL';
        $key = $col->Key ? " [{$col->Key}]" : "";
        echo sprintf("  %-20s %-20s %-10s%s\n", $col->Field, $col->Type, $null, $key);
    }
    echo "\n";
    
    echo "WP Secure Sessions Indexes:\n";
    echo str_repeat("-", 60) . "\n";
    $wpIndexes = \DB::select("SHOW INDEX FROM wp_secure_sessions");
    $indexGroups = [];
    foreach ($wpIndexes as $idx) {
        $indexGroups[$idx->Key_name][] = $idx->Column_name;
    }
    foreach ($indexGroups as $name => $columns) {
        echo "  {$name}: " . implode(', ', $columns) . "\n";
    }
    echo "\n";
}

// Compare and recommend
echo "COMPARISON & RECOMMENDATIONS:\n";
echo str_repeat("-", 60) . "\n";

$issues = [];

// Check if OJS has correct indexes
$ojsHasCorrectIndex = false;
foreach ($indexGroups as $name => $columns) {
    if (in_array('session_token', $columns) && in_array('user_id', $columns)) {
        $ojsHasCorrectIndex = true;
        break;
    }
}

if (!$ojsHasCorrectIndex) {
    $issues[] = "OJS table missing index (session_token, user_id)";
    echo "  ✗ OJS table missing index (session_token, user_id)\n";
    echo "    → Run migration: 2026_07_09_000000_update_ojs_secure_sessions_indexes.php\n";
    echo "    → Command: php artisan migrate\n\n";
} else {
    echo "  ✓ OJS table has correct indexes\n\n";
}

// Check user_agent column type
$ojsUserAgent = collect($ojsColumns)->firstWhere('Field', 'user_agent');
if ($ojsUserAgent) {
    if (strpos($ojsUserAgent->Type, 'varchar') !== false) {
        $issues[] = "user_agent column is varchar (should be text)";
        echo "  ⚠ user_agent is varchar(255) - should be text for long user agents\n";
        echo "    → Will be fixed by migration\n\n";
    } else {
        echo "  ✓ user_agent is text type\n\n";
    }
}

if (count($issues) === 0) {
    echo "  ✓ All checks passed! Table structure is correct.\n\n";
} else {
    echo "\nACTION REQUIRED:\n";
    echo "  1. Upload migration: 2026_07_09_000000_update_ojs_secure_sessions_indexes.php\n";
    echo "  2. Run: php artisan migrate\n";
    echo "  3. Re-run this script to verify\n\n";
}

echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║   CHECK COMPLETED                                          ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

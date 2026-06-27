<?php
/**
 * Simple script to test API connectivity and data availability
 * Upload this file to your server and access it via browser:
 * https://api.itmsci.com/test-api-connection.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [],
    'database_test' => [],
    'environment_check' => [],
    'api_tests' => [],
];

// 1. Server Info
$results['server_info'] = [
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
    'http_host' => $_SERVER['HTTP_HOST'] ?? 'Unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
];

// 2. Check if Laravel bootstrap exists
$laravelPath = __DIR__ . '/bootstrap/app.php';
if (file_exists($laravelPath)) {
    $results['environment_check']['laravel_found'] = true;
    
    try {
        // Bootstrap Laravel
        require $laravelPath;
        $app = require_once $laravelPath;
        $results['environment_check']['laravel_bootstrapped'] = true;
        
        // Try to load environment
        if (file_exists(__DIR__ . '/.env')) {
            $results['environment_check']['env_file_exists'] = true;
            
            // Read .env manually to check DB config
            $envContent = file_get_contents(__DIR__ . '/.env');
            $results['environment_check']['has_db_config'] = 
                (strpos($envContent, 'DB_CONNECTION') !== false);
        } else {
            $results['environment_check']['env_file_exists'] = false;
        }
        
    } catch (Exception $e) {
        $results['environment_check']['laravel_error'] = $e->getMessage();
    }
} else {
    $results['environment_check']['laravel_found'] = false;
    $results['environment_check']['error'] = 'Laravel not found at: ' . $laravelPath;
}

// 3. Database Connection Test
try {
    // Try to connect using credentials from .env-server
    $dbHost = '127.0.0.1';
    $dbName = 'submitj1_speednew';
    $dbUser = 'submitj1_speednew';
    $dbPass = 'dika170805?';
    
    $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    $results['database_test']['connection'] = 'SUCCESS';
    
    // Count tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $results['database_test']['tables_count'] = count($tables);
    $results['database_test']['tables'] = $tables;
    
    // Check specific tables
    if (in_array('websites', $tables)) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM websites");
        $results['database_test']['websites_count'] = $stmt->fetch()['count'];
        
        // Get sample websites
        $stmt = $pdo->query("SELECT id, url, holding, has_ads FROM websites LIMIT 5");
        $results['database_test']['sample_websites'] = $stmt->fetchAll();
    }
    
    if (in_array('page_speeds', $tables)) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM page_speeds");
        $results['database_test']['page_speeds_count'] = $stmt->fetch()['count'];
        
        // Get sample page speeds
        $stmt = $pdo->query("
            SELECT ps.id, ps.website_id, w.url, 
                   ps.desktop_performance_score, ps.mobile_performance_score,
                   ps.checked_at
            FROM page_speeds ps
            LEFT JOIN websites w ON w.id = ps.website_id
            ORDER BY ps.checked_at DESC
            LIMIT 5
        ");
        $results['database_test']['sample_page_speeds'] = $stmt->fetchAll();
    }
    
    if (in_array('users', $tables)) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $results['database_test']['users_count'] = $stmt->fetch()['count'];
    }
    
} catch (PDOException $e) {
    $results['database_test']['connection'] = 'FAILED';
    $results['database_test']['error'] = $e->getMessage();
}

// 4. API Endpoint Tests
$results['api_tests']['test_endpoint'] = [
    'url' => 'https://api.itmsci.com/api/test',
    'description' => 'Test this endpoint in your browser or via curl',
    'curl_command' => 'curl -X GET https://api.itmsci.com/api/test',
];

$results['api_tests']['page_speeds_endpoint'] = [
    'url' => 'https://api.itmsci.com/api/page-speeds',
    'description' => 'Requires authentication - test after login',
    'curl_command' => 'curl -X GET https://api.itmsci.com/api/page-speeds -H "Authorization: Bearer YOUR_TOKEN"',
];

// 5. Recommendations
$results['recommendations'] = [];

if (!isset($results['database_test']['page_speeds_count']) || 
    $results['database_test']['page_speeds_count'] == 0) {
    $results['recommendations'][] = 'No PageSpeed data found. Run page speed checks for websites.';
}

if (!isset($results['database_test']['websites_count']) || 
    $results['database_test']['websites_count'] == 0) {
    $results['recommendations'][] = 'No websites found. Add websites first before checking page speeds.';
}

if ($results['database_test']['connection'] === 'FAILED') {
    $results['recommendations'][] = 'Database connection failed. Check .env file and database credentials.';
}

if (empty($results['recommendations'])) {
    $results['recommendations'][] = 'Everything looks good! If frontend still shows no data, check CORS and authentication.';
}

// Output results
echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

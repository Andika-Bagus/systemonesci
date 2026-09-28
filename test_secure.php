<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $websites = App\Models\Website::select([
        'id',
        'holding',
        'jenis_website',
        'url',
        'wp_username',
        'wp_password',
        'letak_server',
        'cdn_provider',
        'pic',
        'created_at',
        'updated_at'
    ])
    ->where('jenis_website', 'WordPress')
    ->orderBy('holding')
    ->get();
    
    echo "WP Secure count: " . $websites->count() . "\n";
    
    $instances = App\Models\OjsInstance::select([
        'id',
        'holding as name',
        'url',
        'versi_ojs as version',
        'ojs_username',
        'ojs_password',
        'letak_cdn as server_location',
        'letak_server as cdn_location',
        'created_at',
        'updated_at'
    ])->orderBy('holding')->get();
    
    echo "OJS Secure count: " . $instances->count() . "\n";
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

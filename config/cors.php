<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    'allowed_origins' => [
        'https://pagespeed.syntax.co.id', 
        'https://syntax.co.id',
        'https://www.syntax.co.id',
        'https://itmsci.com',
        'https://www.itmsci.com',
        'https://api.itmsci.com',
        'https://speed-api.syntax.co.id',
        'http://localhost:3000', // untuk development
        'http://localhost:5173', // untuk Vite dev server
        'http://localhost:5174', // untuk Vite dev server (port alternatif)
        'http://127.0.0.1:3000', // untuk development
        'http://127.0.0.1:5173', // untuk Vite dev server
        'http://127.0.0.1:5174', // untuk Vite dev server (port alternatif)
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Authorization'],
    'max_age' => 86400,
    'supports_credentials' => true,
];

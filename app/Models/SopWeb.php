<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SopWeb extends Model
{
    protected $fillable = [
        'holding',
        'url',
        'ganti_wp_admin',
        'plugin_wordfence',
        'update_all_plugin',
        'konfigurasi_rate_limit',
        'last_update',
        'pic',
    ];

    protected $casts = [
        'last_update' => 'datetime',
    ];
}

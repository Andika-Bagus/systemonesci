<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OjsInstance extends Model
{
    protected $fillable = [
        'holding',
        'url',
        'letak_cdn',
        'letak_server',
        'versi_ojs',
        'keterangan',
        'ojs_username',
        'ojs_password',
        'domain_expires_at',
        'domain_registrar',
        'domain_registered_at',
        'domain_last_checked',
        'domain_status',
        'days_until_expiry',
    ];
}

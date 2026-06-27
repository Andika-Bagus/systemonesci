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
    ];
}

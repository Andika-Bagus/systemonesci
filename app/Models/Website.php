<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Website extends Model
{
    protected $fillable = [
        'holding',
        'jenis_website',
        'url',
        'letak_server',
        'cdn_provider',
        'pic',
        'has_ads',
        'domain_registered_at',
        'domain_expires_at',
        'domain_registrar',
        'domain_last_checked',
        'domain_status',
        'days_until_expiry',
    ];

    protected $casts = [
        'has_ads' => 'boolean',
        'domain_registered_at' => 'date',
        'domain_expires_at' => 'date',
        'domain_last_checked' => 'datetime',
    ];

    public function pageSpeed()
    {
        return $this->hasOne(PageSpeed::class)->latest();
    }

    public function pageSpeeds()
    {
        return $this->hasMany(PageSpeed::class);
    }

    public function pageSpeedHistory()
    {
        return $this->hasMany(PageSpeedHistory::class)->orderBy('checked_at', 'desc');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UptimeIncident extends Model
{
    use HasFactory;

    protected $fillable = [
        'website_id',
        'started_at',
        'ended_at',
        'duration',
        'reason',
        'is_resolved',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'is_resolved' => 'boolean',
    ];

    public function website()
    {
        return $this->belongsTo(Website::class);
    }
}

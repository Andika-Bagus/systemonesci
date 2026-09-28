<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GamblingScan extends Model
{
    protected $fillable = [
        'website_id',
        'status',
        'keywords_found',
        'keyword_count',
        'confidence_score',
        'scan_details',
        'scanned_at',
    ];

    protected $casts = [
        'keywords_found' => 'array',
        'scan_details' => 'array',
        'scanned_at' => 'datetime',
    ];

    public function website()
    {
        return $this->belongsTo(Website::class);
    }
}

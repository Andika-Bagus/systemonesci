<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSpeed extends Model
{
    protected $fillable = [
        'website_id',
        'desktop_performance_score',
        'desktop_accessibility_score',
        'desktop_best_practices_score',
        'desktop_seo_score',
        'desktop_lcp',
        'desktop_fid',
        'desktop_cls',
        'desktop_recommendations',
        'mobile_performance_score',
        'mobile_accessibility_score',
        'mobile_best_practices_score',
        'mobile_seo_score',
        'mobile_lcp',
        'mobile_fid',
        'mobile_cls',
        'mobile_recommendations',
        'checked_at',
    ];

    protected $casts = [
        'desktop_recommendations' => 'array',
        'mobile_recommendations' => 'array',
        'checked_at' => 'datetime',
    ];

    public function website()
    {
        return $this->belongsTo(Website::class);
    }
}

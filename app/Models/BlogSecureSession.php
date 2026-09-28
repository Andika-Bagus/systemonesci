<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BlogSecureSession extends Model
{
    protected $fillable = [
        'session_token',
        'user_id',
        'user_agent',
        'ip_address',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }

    public static function generateToken(): string
    {
        return 'blog_' . Str::random(64) . '_' . time();
    }

    public static function cleanupExpired(): void
    {
        static::where('expires_at', '<', now())->delete();
    }
}
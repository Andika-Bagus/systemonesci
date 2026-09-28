<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WpSecureSession extends Model
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return !$this->isExpired();
    }

    /**
     * Clean up expired sessions
     */
    public static function cleanupExpired(): void
    {
        static::where('expires_at', '<', now())->delete();
    }

    /**
     * Generate secure token
     */
    public static function generateToken(): string
    {
        return bin2hex(random_bytes(32));
    }
}

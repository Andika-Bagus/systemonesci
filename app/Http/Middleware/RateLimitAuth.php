<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitAuth
{
    protected $limiter;

    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    public function handle(Request $request, Closure $next): Response
    {
        $key = 'login_attempts:' . $request->ip();
        
        // Different limits for different environments
        $maxAttempts = config('app.env') === 'local' ? 20 : 5;
        $decayMinutes = config('app.env') === 'local' ? 5 : 15;

        if ($this->limiter->tooManyAttempts($key, $maxAttempts)) {
            $availableIn = $this->limiter->availableIn($key);
            return response()->json([
                'message' => 'Too many login attempts. Please try again in ' . $availableIn . ' seconds.',
                'retry_after' => $availableIn,
            ], 429);
        }

        $this->limiter->hit($key, $decayMinutes * 60);

        return $next($request);
    }
}

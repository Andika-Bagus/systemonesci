<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserTiketRole
{
    /**
     * Handle an incoming request.
     * User dengan role 'user_tiket' hanya bisa akses endpoint tiket
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Skip middleware for secure access routes (they have their own auth)
        if ($request->is('api/ojs-secure/*') || 
            $request->is('api/wp-secure/*') || 
            $request->is('api/blog-secure/*')) {
            return $next($request);
        }

        if ($user && ($user->role === 'ticketing_user' || $user->role === 'user_tiket')) {
            // Hanya allow akses ke endpoint tiket, me, dan logout
            if (!$request->is('api/tickets*') && !$request->is('api/me') && !$request->is('api/logout')) {
                return response()->json([
                    'message' => 'Unauthorized. User tiket hanya bisa akses halaman tiket.',
                ], 403);
            }
        }

        return $next($request);
    }
}

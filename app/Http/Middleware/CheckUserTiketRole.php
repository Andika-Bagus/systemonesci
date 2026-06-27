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

        if ($user && $user->role === 'user_tiket') {
            // Hanya allow akses ke endpoint tiket
            if (!$request->is('api/tickets*')) {
                return response()->json([
                    'message' => 'Unauthorized. User tiket hanya bisa akses halaman tiket.',
                ], 403);
            }
        }

        return $next($request);
    }
}

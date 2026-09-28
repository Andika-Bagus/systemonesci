<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPageSpeedRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
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

        // If user is PageSpeed user, restrict access to PageSpeed features only
        if ($user && $user->role === 'pagespeed') {
            // PageSpeed user can only access PageSpeed endpoints and view websites
            $allowedPaths = [
                'page-speed',      // Allow PageSpeed operations
                'websites',        // Allow viewing websites (GET only)  
                'notifications',   // Allow viewing notifications
                'me',             // Allow user info
                'logout',         // Allow logout
            ];

            $currentPath = $request->path();
            $isAllowed = false;
            
            // Check if current path is allowed
            foreach ($allowedPaths as $path) {
                if (str_contains($currentPath, $path)) {
                    $isAllowed = true;
                    break;
                }
            }

            // If accessing websites, only allow GET requests
            if (str_contains($currentPath, 'websites') && !in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'])) {
                return response()->json([
                    'message' => 'PageSpeed users can only view websites, not modify them',
                    'role' => $user->role,
                    'action' => 'read-only',
                ], 403);
            }

            // Block access to non-allowed endpoints
            if (!$isAllowed) {
                return response()->json([
                    'message' => 'PageSpeed users can only access PageSpeed Monitor',
                    'role' => $user->role,
                    'action' => 'pagespeed-only',
                    'allowed_pages' => ['PageSpeed Monitor'],
                ], 403);
            }
        }

        return $next($request);
    }
}
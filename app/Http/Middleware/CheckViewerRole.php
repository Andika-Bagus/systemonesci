<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckViewerRole
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

        // If user is viewer, only allow specific actions
        if ($user && $user->role === 'viewer') {
            // Viewer can only access domain check endpoint
            $allowedPaths = [
                '/domain/check/',  // Allow domain checks
            ];

            $isAllowed = false;
            foreach ($allowedPaths as $path) {
                if (strpos($request->path(), $path) !== false) {
                    $isAllowed = true;
                    break;
                }
            }

            // If not in allowed paths and not a GET request, block it
            if (!$isAllowed && !in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'])) {
                return response()->json([
                    'message' => 'Viewers can only check domains',
                    'role' => $user->role,
                    'action' => 'read-only',
                ], 403);
            }

            // Block all other POST/PUT/DELETE requests
            if (!$isAllowed && !in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'])) {
                return response()->json([
                    'message' => 'Viewers cannot perform this action',
                    'role' => $user->role,
                    'action' => 'blocked',
                ], 403);
            }
        }

        // If user is pagespeed, only allow PageSpeed related actions
        if ($user && $user->role === 'pagespeed') {
            // PageSpeed user can only access PageSpeed endpoints
            $allowedPaths = [
                '/page-speed/',      // Allow PageSpeed operations
                '/websites',         // Allow viewing websites (GET only)
                '/notifications',    // Allow viewing notifications
            ];

            $isAllowed = false;
            foreach ($allowedPaths as $path) {
                if (strpos($request->path(), $path) !== false) {
                    $isAllowed = true;
                    break;
                }
            }

            // For PageSpeed users, allow all PageSpeed operations but restrict others
            if (!$isAllowed && !in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'])) {
                return response()->json([
                    'message' => 'PageSpeed users can only access PageSpeed Monitor',
                    'role' => $user->role,
                    'action' => 'pagespeed-only',
                ], 403);
            }

            // Block non-PageSpeed POST/PUT/DELETE requests
            if (!$isAllowed && !in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'])) {
                return response()->json([
                    'message' => 'PageSpeed users cannot perform this action',
                    'role' => $user->role,
                    'action' => 'blocked',
                ], 403);
            }
        }

        return $next($request);
    }
}

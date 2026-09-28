<?php

namespace App\Http\Controllers;

use App\Models\Website;
use App\Models\BlogSecureSession;
use Illuminate\Http\Request;

class BlogSecureController extends Controller
{
    private function getBlogCredentials(): array
    {
        return [
            'username' => env('BLOG_SECURE_USERNAME', 'blog_admin'),
            'password' => env('BLOG_SECURE_PASSWORD', 'BlogSecure_2026!'),
        ];
    }

    /**
     * Authenticate Blog secure access
     */
    public function authenticate(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $this->getBlogCredentials();
        
        \Log::info('Blog Secure: Authentication attempt', [
            'username' => $request->username,
            'expected_username' => $credentials['username'],
            'user_id' => $request->user()->id ?? 'no user'
        ]);

        if ($request->username !== $credentials['username'] || 
            $request->password !== $credentials['password']) {
            \Log::warning('Blog Secure: Invalid credentials');
            return response()->json([
                'message' => 'Invalid Blog credentials',
                'error' => 'authentication_failed'
            ], 401);
        }

        // Clean up expired sessions first
        BlogSecureSession::cleanupExpired();

        // Create new secure session
        $sessionToken = BlogSecureSession::generateToken();
        $expiresAt = now()->addMinutes(30); // 30 minutes session

        $session = BlogSecureSession::create([
            'session_token' => $sessionToken,
            'user_id' => $request->user()->id,
            'user_agent' => $request->userAgent(),
            'ip_address' => $request->ip(),
            'expires_at' => $expiresAt,
        ]);

        \Log::info('Blog Secure: Session created', [
            'session_id' => $session->id,
            'token' => substr($sessionToken, 0, 10) . '...'
        ]);

        return response()->json([
            'message' => 'Blog secure access granted',
            'session_token' => $sessionToken,
            'expires_at' => $expiresAt->toISOString(),
            'expires_in_minutes' => 30,
        ]);
    }

    /**
     * Verify Blog secure session
     */
    public function verify(Request $request)
    {
        $sessionToken = $request->header('X-Blog-Session') ?? $request->get('session_token');

        if (!$sessionToken) {
            return response()->json([
                'valid' => false,
                'message' => 'No session token provided'
            ], 401);
        }

        $session = BlogSecureSession::where('session_token', $sessionToken)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$session || $session->isExpired()) {
            return response()->json([
                'valid' => false,
                'message' => 'Session invalid or expired'
            ], 401);
        }

        return response()->json([
            'valid' => true,
            'expires_at' => $session->expires_at->toISOString(),
            'message' => 'Session valid'
        ]);
    }

    /**
     * Get Blog websites with credentials (protected)
     */
    public function getBlogs(Request $request)
    {
        \Log::info('Blog Secure: getBlogs called', [
            'user_id' => $request->user()->id ?? 'no user',
            'has_session_header' => $request->hasHeader('X-Blog-Session'),
            'has_auth_header' => $request->hasHeader('Authorization')
        ]);

        // Verify session first
        $verifyResponse = $this->verify($request);
        if ($verifyResponse->getStatusCode() !== 200) {
            \Log::warning('Blog Secure: getBlogs - session verification failed', [
                'status' => $verifyResponse->getStatusCode()
            ]);
            return $verifyResponse;
        }

        // Get Blog websites with credentials - simple exact match
        $blogs = Website::select([
            'id',
            'holding',
            'jenis_website',
            'url',
            'blog_username',
            'blog_password',
            'blog_admin_url',
            'letak_server',
            'cdn_provider',
            'pic',
            'created_at',
            'updated_at'
        ])
        ->where(function($query) {
            $query->where('jenis_website', 'Blog')
                  ->orWhere('jenis_website', 'blog');
        })
        ->orderBy('holding')
        ->get();

        \Log::info('Blog Secure: Fetched blogs successfully', [
            'total_count' => $blogs->count(),
            'with_credentials' => $blogs->filter(fn($b) => $b->blog_username && $b->blog_password)->count(),
            'sample_holdings' => $blogs->take(3)->pluck('holding')->toArray()
        ]);

        // Ensure we return a consistent response structure with no-cache headers
        return response()->json([
            'success' => true,
            'blogs' => $blogs,
            'total' => $blogs->count(),
            'metadata' => [
                'access_level' => 'secure',
                'session_valid' => true,
                'fetched_at' => now()->toISOString(),
                'user_id' => $request->user()->id
            ]
        ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
          ->header('Pragma', 'no-cache')
          ->header('Expires', '0');
    }

    /**
     * Get specific blog by ID with credentials
     */
    public function getBlog(Request $request, $id)
    {
        // Verify session first
        $verifyResponse = $this->verify($request);
        if ($verifyResponse->getStatusCode() !== 200) {
            return $verifyResponse;
        }

        $blog = Website::select([
            'id',
            'holding',
            'jenis_website',
            'url',
            'blog_username',
            'blog_password',
            'blog_admin_url',
            'letak_server',
            'cdn_provider',
            'pic',
            'has_ads',
            'domain_registered_at',
            'domain_expires_at',
            'domain_registrar',
            'domain_status',
            'days_until_expiry',
            'created_at',
            'updated_at'
        ])->where(function($query) {
            $query->where('jenis_website', 'Blog')
                  ->orWhere('jenis_website', 'blog');
        })->find($id);

        if (!$blog) {
            return response()->json([
                'message' => 'Blog not found or not a blog type'
            ], 404);
        }

        return response()->json([
            'blog' => $blog,
            'metadata' => [
                'access_level' => 'secure',
                'session_valid' => true,
                'fetched_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * Update blog credentials
     */
    public function updateCredentials(Request $request, $id)
    {
        // Verify session first
        $verifyResponse = $this->verify($request);
        if ($verifyResponse->getStatusCode() !== 200) {
            return $verifyResponse;
        }

        $request->validate([
            'blog_username' => 'nullable|string|max:255',
            'blog_password' => 'nullable|string|max:255',
            'blog_admin_url' => 'nullable|url|max:500',
        ]);

        $blog = Website::where(function($query) {
            $query->where('jenis_website', 'Blog')
                  ->orWhere('jenis_website', 'blog');
        })->find($id);
        if (!$blog) {
            return response()->json([
                'message' => 'Blog not found or not a blog type'
            ], 404);
        }

        $blog->update([
            'blog_username' => $request->blog_username,
            'blog_password' => $request->blog_password,
            'blog_admin_url' => $request->blog_admin_url,
        ]);

        \Log::info('Blog Secure: Credentials updated', [
            'blog_id' => $id,
            'holding' => $blog->holding,
            'has_username' => !empty($request->blog_username),
            'has_password' => !empty($request->blog_password),
            'has_admin_url' => !empty($request->blog_admin_url)
        ]);

        return response()->json([
            'message' => 'Blog credentials updated successfully',
            'blog' => $blog->refresh()
        ]);
    }

    /**
     * Logout from Blog secure session
     */
    public function logout(Request $request)
    {
        $sessionToken = $request->header('X-Blog-Session') ?? $request->get('session_token');

        if ($sessionToken) {
            BlogSecureSession::where('session_token', $sessionToken)
                ->where('user_id', $request->user()->id)
                ->delete();
        }

        return response()->json([
            'message' => 'Blog secure session terminated'
        ]);
    }

    /**
     * Get session info
     */
    public function sessionInfo(Request $request)
    {
        $sessionToken = $request->header('X-Blog-Session') ?? $request->get('session_token');

        \Log::info('Blog Secure: Session info check', [
            'has_token' => !empty($sessionToken),
            'user_id' => $request->user()->id ?? 'no user'
        ]);

        if (!$sessionToken) {
            \Log::warning('Blog Secure: No session token provided');
            return response()->json([
                'authenticated' => false,
                'message' => 'No session token provided'
            ]);
        }

        $session = BlogSecureSession::where('session_token', $sessionToken)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$session || $session->isExpired()) {
            \Log::warning('Blog Secure: Session not found or expired', [
                'session_exists' => $session ? true : false,
                'is_expired' => $session ? $session->isExpired() : 'n/a'
            ]);
            
            // Clean up expired session if it exists
            if ($session && $session->isExpired()) {
                $session->delete();
            }
            
            return response()->json([
                'authenticated' => false,
                'expired' => true,
                'message' => 'Session invalid or expired'
            ]);
        }

        // Extend session if requested or automatically extend on check
        $session->expires_at = now()->addMinutes(30);
        $session->save();
        \Log::info('Blog Secure: Session extended automatically');

        \Log::info('Blog Secure: Session valid and extended');

        return response()->json([
            'authenticated' => true,
            'expires_at' => $session->expires_at->toISOString(),
            'expires_in_minutes' => max(0, now()->diffInMinutes($session->expires_at)),
            'user' => $session->user->name,
            'session_id' => $session->id,
            'last_extended' => now()->toISOString()
        ]);
    }
}
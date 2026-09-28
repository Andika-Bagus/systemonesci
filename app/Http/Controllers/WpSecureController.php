<?php

namespace App\Http\Controllers;

use App\Models\Website;
use App\Models\WpSecureSession;
use Illuminate\Http\Request;

class WpSecureController extends Controller
{
    private function getWpCredentials(): array
    {
        return [
            'username' => env('WP_SECURE_USERNAME', 'wp_admin'),
            'password' => env('WP_SECURE_PASSWORD', 'admin123'),
        ];
    }

    /**
     * Authenticate WP secure access
     */
    public function authenticate(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $this->getWpCredentials();
        
        \Log::info('WP Secure: Authentication attempt', [
            'username' => $request->username,
            'expected_username' => $credentials['username'],
            'user_id' => $request->user()->id ?? 'no user'
        ]);

        if ($request->username !== $credentials['username'] || 
            $request->password !== $credentials['password']) {
            \Log::warning('WP Secure: Invalid credentials');
            return response()->json([
                'message' => 'Invalid WP credentials',
                'error' => 'authentication_failed'
            ], 401);
        }

        // Clean up expired sessions first
        WpSecureSession::cleanupExpired();

        // Create new secure session
        $sessionToken = WpSecureSession::generateToken();
        $expiresAt = now()->addMinutes(30); // 30 minutes session

        $session = WpSecureSession::create([
            'session_token' => $sessionToken,
            'user_id' => $request->user()->id,
            'user_agent' => $request->userAgent(),
            'ip_address' => $request->ip(),
            'expires_at' => $expiresAt,
        ]);

        \Log::info('WP Secure: Session created', [
            'session_id' => $session->id,
            'token' => substr($sessionToken, 0, 10) . '...'
        ]);

        return response()->json([
            'message' => 'WP secure access granted',
            'session_token' => $sessionToken,
            'expires_at' => $expiresAt->toISOString(),
            'expires_in_minutes' => 30,
        ]);
    }

    /**
     * Verify WP secure session
     */
    public function verify(Request $request)
    {
        $sessionToken = $request->header('X-WP-Session') ?? $request->get('session_token');

        if (!$sessionToken) {
            return response()->json([
                'valid' => false,
                'message' => 'No session token provided'
            ], 401);
        }

        $session = WpSecureSession::where('session_token', $sessionToken)
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
     * Get WordPress websites with credentials (protected)
     */
    public function getWebsites(Request $request)
    {
        // Verify session first
        $verifyResponse = $this->verify($request);
        if ($verifyResponse->getStatusCode() !== 200) {
            return $verifyResponse;
        }

        // Get WordPress websites with credentials
        $websites = Website::select([
            'id',
            'holding',
            'jenis_website',
            'url',
            'wp_username',
            'wp_password',
            'wp_login_url',
            'letak_server',
            'cdn_provider',
            'pic',
            'created_at',
            'updated_at'
        ])
        ->where('jenis_website', 'WordPress')
        ->orderBy('holding')
        ->get();

        \Log::info('WP Secure: Fetched websites', [
            'total_count' => $websites->count(),
            'with_credentials' => $websites->filter(fn($w) => $w->wp_username && $w->wp_password)->count(),
            'sample_data' => $websites->take(3)->map(fn($w) => [
                'id' => $w->id,
                'holding' => $w->holding,
                'has_username' => !empty($w->wp_username),
                'has_password' => !empty($w->wp_password)
            ])
        ]);

        return response()->json([
            'websites' => $websites,
            'total' => $websites->count(),
            'metadata' => [
                'access_level' => 'secure',
                'session_valid' => true,
                'fetched_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * Logout from WP secure session
     */
    public function logout(Request $request)
    {
        $sessionToken = $request->header('X-WP-Session') ?? $request->get('session_token');

        if ($sessionToken) {
            WpSecureSession::where('session_token', $sessionToken)
                ->where('user_id', $request->user()->id)
                ->delete();
        }

        return response()->json([
            'message' => 'WP secure session terminated'
        ]);
    }

    /**
     * Get session info
     */
    public function sessionInfo(Request $request)
    {
        $sessionToken = $request->header('X-WP-Session') ?? $request->get('session_token');

        \Log::info('WP Secure: Session info check', [
            'has_token' => !empty($sessionToken),
            'user_id' => $request->user()->id ?? 'no user'
        ]);

        if (!$sessionToken) {
            \Log::warning('WP Secure: No session token provided');
            return response()->json([
                'authenticated' => false
            ]);
        }

        $session = WpSecureSession::where('session_token', $sessionToken)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$session || $session->isExpired()) {
            \Log::warning('WP Secure: Session not found or expired', [
                'session_exists' => $session ? true : false,
                'is_expired' => $session ? $session->isExpired() : 'n/a'
            ]);
            return response()->json([
                'authenticated' => false,
                'expired' => true
            ]);
        }

        if ($request->boolean('extend')) {
            $session->expires_at = now()->addMinutes(30);
            $session->save();
            \Log::info('WP Secure: Session extended');
        }

        \Log::info('WP Secure: Session valid');

        return response()->json([
            'authenticated' => true,
            'expires_at' => $session->expires_at->toISOString(),
            'expires_in_minutes' => now()->diffInMinutes($session->expires_at),
            'user' => $session->user->name,
        ]);
    }
}

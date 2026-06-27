<?php

namespace App\Http\Controllers;

use App\Models\OjsInstance;
use App\Models\OjsSecureSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class OjsSecureController extends Controller
{
    private function getOjsCredentials(): array
    {
        return [
            'username' => env('OJS_SECURE_USERNAME', 'ojs_admin'),
            'password' => env('OJS_SECURE_PASSWORD', 'OJS_Secure_2026!'),
        ];
    }

    /**
     * Authenticate OJS secure access
     */
    public function authenticate(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $this->getOjsCredentials();

        if ($request->username !== $credentials['username'] || 
            $request->password !== $credentials['password']) {
            return response()->json([
                'message' => 'Invalid OJS credentials',
                'error' => 'authentication_failed'
            ], 401);
        }

        // Clean up expired sessions first
        OjsSecureSession::cleanupExpired();

        // Create new secure session
        $sessionToken = OjsSecureSession::generateToken();
        $expiresAt = now()->addMinutes(30); // 30 minutes session

        $session = OjsSecureSession::create([
            'session_token' => $sessionToken,
            'user_id' => $request->user()->id,
            'user_agent' => $request->userAgent(),
            'ip_address' => $request->ip(),
            'expires_at' => $expiresAt,
        ]);

        return response()->json([
            'message' => 'OJS secure access granted',
            'session_token' => $sessionToken,
            'expires_at' => $expiresAt->toISOString(),
            'expires_in_minutes' => 30,
        ]);
    }

    /**
     * Verify OJS secure session
     */
    public function verify(Request $request)
    {
        $sessionToken = $request->header('X-OJS-Session') ?? $request->get('session_token');

        if (!$sessionToken) {
            return response()->json([
                'valid' => false,
                'message' => 'No session token provided'
            ], 401);
        }

        $session = OjsSecureSession::where('session_token', $sessionToken)
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
     * Get OJS instances (protected)
     */
    public function getInstances(Request $request)
    {
        // Verify session first
        $verifyResponse = $this->verify($request);
        if ($verifyResponse->getStatusCode() !== 200) {
            return $verifyResponse;
        }

        // Get OJS instances with credentials
        $instances = \App\Models\OjsInstance::select([
            'id',
            'holding as name',
            'url',
            'versi_ojs as version',
            'ojs_username',
            'ojs_password',
            'letak_cdn as server_location',
            'letak_server as cdn_location',
            'created_at',
            'updated_at'
        ])->orderBy('holding')->get();

        return response()->json([
            'instances' => $instances,
            'total' => $instances->count(),
            'metadata' => [
                'access_level' => 'secure',
                'session_valid' => true,
                'fetched_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * Logout from OJS secure session
     */
    public function logout(Request $request)
    {
        $sessionToken = $request->header('X-OJS-Session') ?? $request->get('session_token');

        if ($sessionToken) {
            OjsSecureSession::where('session_token', $sessionToken)
                ->where('user_id', $request->user()->id)
                ->delete();
        }

        return response()->json([
            'message' => 'OJS secure session terminated'
        ]);
    }

    /**
     * Get session info
     */
    public function sessionInfo(Request $request)
    {
        $sessionToken = $request->header('X-OJS-Session') ?? $request->get('session_token');

        if (!$sessionToken) {
            return response()->json([
                'authenticated' => false
            ]);
        }

        $session = OjsSecureSession::where('session_token', $sessionToken)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$session || $session->isExpired()) {
            return response()->json([
                'authenticated' => false,
                'expired' => true
            ]);
        }

        if ($request->boolean('extend')) {
            $session->expires_at = now()->addMinutes(30);
            $session->save();
        }

        return response()->json([
            'authenticated' => true,
            'expires_at' => $session->expires_at->toISOString(),
            'expires_in_minutes' => now()->diffInMinutes($session->expires_at),
            'user' => $session->user->name,
        ]);
    }
}
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebsiteController;
use App\Http\Controllers\OjsInstanceController;
use App\Http\Controllers\SopWebController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PageSpeedController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UptimeController;
use App\Http\Controllers\DomainController;
use App\Http\Controllers\GamblingDetectionController;

Route::get('/test', function () {
    return response()->json(['message' => 'Test endpoint works!']);
});

Route::post('/test-db', function (Request $request) {
    try {
        $user = App\Models\User::where('email', 'andikabgs0508@gmail.com')->first();
        return response()->json([
            'found' => $user ? true : false,
            'name' => $user ? $user->name : null
        ]);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Auth Routes (Public) - tanpa rate limiting untuk development
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware(['auth:sanctum', 'check.viewer.role', 'check.pagespeed.role', 'check.user.tiket.role'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Websites CRUD
    Route::apiResource('websites', WebsiteController::class);
    Route::post('/websites/{website}/check-ads', [WebsiteController::class, 'checkAds']);
    Route::post('/websites/check-all-ads', [WebsiteController::class, 'checkAllAds']);

    // OJS Instances CRUD
    Route::apiResource('ojs-instances', OjsInstanceController::class);

    // OJS Secure Access
    Route::prefix('ojs-secure')->group(function () {
        Route::post('/authenticate', [App\Http\Controllers\OjsSecureController::class, 'authenticate']);
        Route::post('/verify', [App\Http\Controllers\OjsSecureController::class, 'verify']);
        Route::get('/instances', [App\Http\Controllers\OjsSecureController::class, 'getInstances']);
        Route::post('/logout', [App\Http\Controllers\OjsSecureController::class, 'logout']);
        Route::get('/session', [App\Http\Controllers\OjsSecureController::class, 'sessionInfo']);
    });

    // WP Secure Access
    Route::prefix('wp-secure')->group(function () {
        Route::post('/authenticate', [App\Http\Controllers\WpSecureController::class, 'authenticate']);
        Route::post('/verify', [App\Http\Controllers\WpSecureController::class, 'verify']);
        Route::get('/websites', [App\Http\Controllers\WpSecureController::class, 'getWebsites']);
        Route::post('/logout', [App\Http\Controllers\WpSecureController::class, 'logout']);
        Route::get('/session', [App\Http\Controllers\WpSecureController::class, 'sessionInfo']);
    });

    // Blog Secure Access
    Route::prefix('blog-secure')->group(function () {
        Route::post('/authenticate', [App\Http\Controllers\BlogSecureController::class, 'authenticate']);
        Route::post('/verify', [App\Http\Controllers\BlogSecureController::class, 'verify']);
        Route::get('/blogs', [App\Http\Controllers\BlogSecureController::class, 'getBlogs']);
        Route::get('/blogs/{id}', [App\Http\Controllers\BlogSecureController::class, 'getBlog']);
        Route::put('/blogs/{id}/credentials', [App\Http\Controllers\BlogSecureController::class, 'updateCredentials']);
        Route::post('/logout', [App\Http\Controllers\BlogSecureController::class, 'logout']);
        Route::get('/session', [App\Http\Controllers\BlogSecureController::class, 'sessionInfo']);
    });

    // SOP Webs CRUD
    Route::apiResource('sop-webs', SopWebController::class);

    // Tickets CRUD
    Route::apiResource('tickets', TicketController::class);
    Route::get('/tickets-stats', [TicketController::class, 'stats'])->middleware('throttle:60,1');

    // PageSpeed
    Route::post('/page-speed/check-external', [PageSpeedController::class, 'checkExternalUrl']);
    Route::post('/page-speed/check/{websiteId}', [PageSpeedController::class, 'checkPageSpeed']);
    Route::get('/page-speed/{websiteId}', [PageSpeedController::class, 'getPageSpeed']);
    Route::get('/page-speed/{websiteId}/history', [PageSpeedController::class, 'getPageSpeedHistory']);
    Route::get('/page-speed/{websiteId}/debug', [PageSpeedController::class, 'debugPageSpeedHistory']);
    Route::get('/page-speeds', [PageSpeedController::class, 'getAllPageSpeeds']);
    Route::get('/page-speeds/trends', [PageSpeedController::class, 'getTrendsData']);
    Route::get('/page-speed-stats-by-ads', [PageSpeedController::class, 'getPageSpeedStatsByAds']);
    Route::get('/page-speed-detailed-breakdown', [PageSpeedController::class, 'getDetailedBreakdown']);
    Route::delete('/page-speed/{websiteId}', [PageSpeedController::class, 'deletePageSpeed']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->middleware('throttle:60,1');
    Route::get('/notifications/unread', [NotificationController::class, 'getUnread'])->middleware('throttle:60,1');
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->middleware('throttle:60,1');
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->middleware('throttle:30,1');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'delete'])->middleware('throttle:30,1');

    // Uptime Monitoring
    Route::post('/uptime/check/{websiteId}', [UptimeController::class, 'checkUptime']);
    Route::get('/uptime/{websiteId}/stats', [UptimeController::class, 'getUptimeStats']);
    Route::get('/uptime/{websiteId}/history', [UptimeController::class, 'getUptimeHistory']);
    Route::get('/uptime/all-status', [UptimeController::class, 'getAllUptimeStatus']);

    // Domain Expiry Monitoring
    Route::post('/domain/check/{websiteId}', [DomainController::class, 'checkDomain']);
    Route::get('/domains', [DomainController::class, 'getAllDomains']);
    Route::get('/domains/expiring-soon', [DomainController::class, 'getExpiringSoon']);
    Route::get('/domains/stats', [DomainController::class, 'getStats']);

    // Gambling Detection
    Route::post('/gambling/scan-external', [GamblingDetectionController::class, 'scanExternal']);
    Route::post('/gambling/scan/{websiteId}', [GamblingDetectionController::class, 'scan']);
    Route::post('/gambling/bulk-scan', [GamblingDetectionController::class, 'bulkScan']);
    Route::get('/gambling/scan/{websiteId}', [GamblingDetectionController::class, 'getLatestScan']);
    Route::get('/gambling/scans', [GamblingDetectionController::class, 'getAllScans']);
    Route::get('/gambling/stats', [GamblingDetectionController::class, 'getStatistics']);
    Route::get('/gambling/status/{status}', [GamblingDetectionController::class, 'getByStatus']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


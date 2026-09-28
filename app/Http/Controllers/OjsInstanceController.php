<?php

namespace App\Http\Controllers;

use App\Models\OjsInstance;
use App\Models\Website;
use Illuminate\Http\Request;

class OjsInstanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(OjsInstance::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'holding' => 'required|string',
            'url' => 'required|url',
            'letak_cdn' => 'nullable|string',
            'letak_server' => 'nullable|string',
            'versi_ojs' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'ojs_username' => 'nullable|string',
            'ojs_password' => 'nullable|string',
        ]);

        $ojs = OjsInstance::create($validated);
        
        // Sync to Website
        Website::updateOrCreate(
            ['url' => $ojs->url],
            [
                'jenis_website' => 'OJS',
                'holding' => $ojs->holding ?? 'Unknown',
                'letak_server' => $ojs->letak_server,
                'cdn_provider' => $ojs->letak_cdn,
                'domain_registered_at' => $ojs->domain_registered_at,
                'domain_expires_at' => $ojs->domain_expires_at,
                'domain_registrar' => $ojs->domain_registrar,
                'domain_last_checked' => $ojs->domain_last_checked,
                'domain_status' => $ojs->domain_status,
                'days_until_expiry' => $ojs->days_until_expiry,
            ]
        );
        
        return response()->json($ojs, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(OjsInstance $ojsInstance)
    {
        return response()->json($ojsInstance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OjsInstance $ojsInstance)
    {
        \Log::info('[OJS Instance Update] Request received', [
            'instance_id' => $ojsInstance->id,
            'user_id' => $request->user()->id ?? 'none',
            'request_data' => $request->all(),
            'has_auth' => $request->user() ? 'yes' : 'no'
        ]);
        
        $validated = $request->validate([
            'holding' => 'sometimes|string',
            'url' => 'sometimes|url',
            'letak_cdn' => 'nullable|string',
            'letak_server' => 'nullable|string',
            'versi_ojs' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'ojs_username' => 'nullable|string',
            'ojs_password' => 'nullable|string',
        ]);

        \Log::info('[OJS Instance Update] Validated data', $validated);
        
        $ojsInstance->update($validated);
        
        // Sync to Website
        Website::updateOrCreate(
            ['url' => $ojsInstance->url],
            [
                'jenis_website' => 'OJS',
                'holding' => $ojsInstance->holding ?? 'Unknown',
                'letak_server' => $ojsInstance->letak_server,
                'cdn_provider' => $ojsInstance->letak_cdn,
                'domain_registered_at' => $ojsInstance->domain_registered_at,
                'domain_expires_at' => $ojsInstance->domain_expires_at,
                'domain_registrar' => $ojsInstance->domain_registrar,
                'domain_last_checked' => $ojsInstance->domain_last_checked,
                'domain_status' => $ojsInstance->domain_status,
                'days_until_expiry' => $ojsInstance->days_until_expiry,
            ]
        );
        
        \Log::info('[OJS Instance Update] After update', [
            'ojs_username' => $ojsInstance->ojs_username,
            'ojs_password' => $ojsInstance->ojs_password ? 'SET' : 'NULL'
        ]);
        
        return response()->json($ojsInstance);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OjsInstance $ojsInstance)
    {
        $ojsInstance->delete();
        return response()->json(null, 204);
    }
}

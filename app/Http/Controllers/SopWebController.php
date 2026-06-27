<?php

namespace App\Http\Controllers;

use App\Models\SopWeb;
use Illuminate\Http\Request;

class SopWebController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(SopWeb::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'holding' => 'required|string',
            'url' => 'required|url',
            'ganti_wp_admin' => 'nullable|string',
            'plugin_wordfence' => 'nullable|string',
            'update_all_plugin' => 'nullable|string',
            'konfigurasi_rate_limit' => 'nullable|string',
            'last_update' => 'nullable|datetime',
            'pic' => 'nullable|string',
        ]);

        $sopWeb = SopWeb::create($validated);
        return response()->json($sopWeb, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SopWeb $sopWeb)
    {
        return response()->json($sopWeb);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SopWeb $sopWeb)
    {
        $validated = $request->validate([
            'holding' => 'sometimes|string',
            'url' => 'sometimes|url',
            'ganti_wp_admin' => 'nullable|string',
            'plugin_wordfence' => 'nullable|string',
            'update_all_plugin' => 'nullable|string',
            'konfigurasi_rate_limit' => 'nullable|string',
            'last_update' => 'nullable|datetime',
            'pic' => 'nullable|string',
        ]);

        $sopWeb->update($validated);
        return response()->json($sopWeb);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SopWeb $sopWeb)
    {
        $sopWeb->delete();
        return response()->json(null, 204);
    }
}

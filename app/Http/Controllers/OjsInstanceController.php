<?php

namespace App\Http\Controllers;

use App\Models\OjsInstance;
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
        ]);

        $ojs = OjsInstance::create($validated);
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
        $validated = $request->validate([
            'holding' => 'sometimes|string',
            'url' => 'sometimes|url',
            'letak_cdn' => 'nullable|string',
            'letak_server' => 'nullable|string',
            'versi_ojs' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        $ojsInstance->update($validated);
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

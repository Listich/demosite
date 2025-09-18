<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Startup;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\StartupController;



class StartupController extends Controller
{
    public function index()
    {
        return response()->json(Startup::with('founders')->get());
    }

    public function show($id)
    {
        $startup = Startup::with('founders')->findOrFail($id);
        return response()->json($startup);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'legal_status' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'website_url' => 'nullable|url',
            'social_media_url' => 'nullable|url',
            'project_status' => 'nullable|string',
            'needs' => 'nullable|string',
            'sector' => 'nullable|string',
            'maturity' => 'nullable|string',
        ]);

        $startup = \App\Models\Startup::create($validated);

        return response()->json($startup, 201);
    }

    public function update(Request $request, $id)
    {
        $startup = \App\Models\Startup::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'legal_status' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'email' => 'sometimes|required|email',
            'phone' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'website_url' => 'nullable|url',
            'social_media_url' => 'nullable|url',
            'project_status' => 'nullable|string',
            'needs' => 'nullable|string',
            'sector' => 'nullable|string',
            'maturity' => 'nullable|string',
        ]);

        $startup->update($validated);

        return response()->json($startup);
    }

    public function destroy($id)
    {
        $startup = \App\Models\Startup::findOrFail($id);
        $startup->delete();

        return response()->json(['message' => 'Startup deleted']);
    }

}

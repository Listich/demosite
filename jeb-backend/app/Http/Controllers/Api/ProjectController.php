<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{

    public function index()
    {
        return response()->json(Project::all());
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'founders' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'website' => 'nullable|url',
            'needs' => 'nullable|array',
            'progress' => 'nullable|string',
        ]);

        $project = Project::create($validated);

        return response()->json($project, 201);
    }


    public function show($id)
    {
        $project = Project::findOrFail($id);
        return response()->json($project);
    }


    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'founders' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'website' => 'nullable|url',
            'needs' => 'nullable|array',
            'progress' => 'nullable|string',
        ]);

        $project->update($validated);

        return response()->json($project);
    }


    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Project deleted']);
    }
}

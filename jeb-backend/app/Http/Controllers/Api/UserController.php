<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{

    public function index()
    {
        $users = User::all([
            'id', 'name', 'email', 'role', 'founder_id', 'investor_id'
        ]);

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::select('id', 'name', 'email', 'role', 'founder_id', 'investor_id')->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function byEmail($email)
    {
        $user = User::select('id', 'name', 'email', 'role', 'founder_id', 'investor_id')
            ->where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function image($id)
    {
        $user = User::find($id);

        if (!$user || !$user->image_path) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        $path = storage_path('app/public/' . $user->image_path);

        if (!file_exists($path)) {
            return response()->json(['message' => 'Image file not found on disk'], 404);
        }

        return response()->file($path);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string',
            'founder_id' => 'nullable|integer|exists:founders,id',
            'investor_id' => 'nullable|integer|exists:investors,id',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|string',
            'founder_id' => 'nullable|integer|exists:founders,id',
            'investor_id' => 'nullable|integer|exists:investors,id',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }


    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function uploadImage(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('users', 'public');

        $user->image_path = $path;
        $user->save();

        return response()->json([
            'message' => 'Image uploaded successfully',
            'image_url' => asset('storage/' . $path),
        ]);
    }
}



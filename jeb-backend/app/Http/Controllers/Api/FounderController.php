<?php

namespace App\Http\Controllers\Api;
use App\Models\Founder;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Startup;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;
class FounderController extends Controller
{
    public function show($id)
    {
        $founder = Founder::find($id);

        if (!$founder) {
            return response()->json(['error' => 'Founder not found'], 404);
        }

        return response()->json([
            'id' => $founder->id,
            'name' => $founder->name,
            'startup_id' => $founder->startup_id,
        ]);
    }
    public function founderImage($startup_id, $founder_id)
    {
        $startup = Startup::find($startup_id);
        if (!$startup) {
            return response()->json(['message' => 'Startup not found'], 404);
        }

        $founder = Founder::where('id', $founder_id)
            ->where('startup_id', $startup_id)
            ->first();

        if (!$founder || !$founder->image_path) {
            return response()->json(['message' => 'Founder image not found'], 404);
        }

        $path = storage_path('app/public/' . $founder->image_path);

        if (!file_exists($path)) {
            return response()->json(['message' => 'Image file not found on disk'], 404);
        }

        return response()->file($path);
    }

}


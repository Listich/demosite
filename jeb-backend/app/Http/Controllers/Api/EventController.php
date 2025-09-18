<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index(Request $request) {
        $events = Event::query()
            ->skip($request->query('skip', 0))
            ->limit($request->query('limit', 100))
            ->get();
        return response()->json($events);
    }

    public function show($id) {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
        return response()->json($event);
    }

    public function image($id)
    {
        $event = Event::find($id);

        if (!$event || !$event->image_url) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        $path = "events/{$event->image_url}";

        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Image file not found on disk'], 404);
        }

        return response()->json(asset("storage/{$path}"));
    }


}

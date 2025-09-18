<?php

namespace App\Http\Controllers\Api;
use App\Models\News;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $news = News::query()
            ->skip($request->query('skip', 0))
            ->take($request->query('limit', 100))
            ->get();

        return response()->json($news);
    }
    public function show($id)
    {
        $news = News::findOrFail($id);

        return response()->json($news);
    }

    public function image(News $news)
    {
        return response()->json($news->image_url);
    }
}

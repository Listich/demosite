<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Investor;


class InvestorController extends Controller
{
    public function index() {
        return response()->json(Investor::all());
    }
    public function show($id) {
        $investor = Investor::find($id);

        if (!$investor) {
            return response()->json(['error' => 'Investor not found'], 404);
        }
        return response()->json($investor);
    }
}

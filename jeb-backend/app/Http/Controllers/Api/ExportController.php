<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use App\Models\Startup;
use App\Models\Project;
use App\Models\User;

class ExportController extends Controller
{
    public function pitchDeck(Request $request)
    {
        $stats = [
            'startups_count' => Startup::count(),
            'projects_count' => Project::count(),
            'users_count' => User::count(),
            'engagement_rate' => 7.81,
            'top_sector' => 'DeepTech',
        ];

        $startups = Startup::take(3)->get();

        $pdf = Pdf::loadView('pdf.pitchdeck', [
            'dashboard' => $stats,
            'startups' => $startups,
            'user' => $request->user(),
        ]);

        return $pdf->download('pitchdeck.pdf');
    }
}

<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use App\Models\Startup;
use App\Models\Project;
use App\Models\User;
use App\Models\Founder;
use App\Models\Investor;
use App\Models\Partner;
use App\Models\News;
use App\Models\Event;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {

        $data = Cache::remember('dashboard_stats', 60, function () {
            $now = Carbon::now();

            $lastUpdatedAt = collect([
                Startup::max('updated_at'),
                Project::max('updated_at'),
                News::max('updated_at'),
                Event::max('updated_at'),
            ])->filter()->max();

            return [
                'stats' => [
                    'startups_count'   => Startup::count(),
                    'projects_count'   => Project::count(),
                    'users_count'      => User::count(),
                    'founders_count'   => Founder::count(),
                    'investors_count'  => Investor::count(),
                    'partners_count'   => Partner::count(),
                    'news_count'       => News::count(),
                    'events_count'     => Event::count(),
                    'top_sector'       => Startup::query()
                        ->select('sector', DB::raw('COUNT(*) as c'))
                        ->whereNotNull('sector')
                        ->where('sector', '!=', '')
                        ->groupBy('sector')
                        ->orderByDesc('c')
                        ->value('sector'),
                    'maturity_breakdown' => Startup::query()
                        ->select('maturity', DB::raw('COUNT(*) as count'))
                        ->groupBy('maturity')
                        ->orderByDesc('count')
                        ->get(),
                    'engagement_rate' => Startup::count() > 0
                        ? round((News::count() + Event::count()) / Startup::count() * 10, 2)
                        : 0.0,
                ],
                'meta' => [
                    'generated_at'     => $now->toIso8601String(),
                    'last_updated_at'  => $lastUpdatedAt ? Carbon::parse($lastUpdatedAt)->toIso8601String() : null,
                    'cache_ttl_seconds' => 60,
                ],

            ];
        });
        return response()->json($data);
    }
}

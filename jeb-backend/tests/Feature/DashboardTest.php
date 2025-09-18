<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
    use RefreshDatabase;

    protected function authenticate()
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        return $response['token'];
    }

    public function test_dashboard_returns_statistics()
    {
        $token = $this->authenticate();

        $response = $this->withToken($token)
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'stats' => [
                    'startups_count',
                    'projects_count',
                    'users_count',
                    'founders_count',
                    'investors_count',
                    'partners_count',
                    'news_count',
                    'events_count',
                    'top_sector',
                    'maturity_breakdown',
                    'engagement_rate'
                ],
                'meta' => [
                    'generated_at',
                    'last_updated_at',
                    'cache_ttl_seconds'
                ]
            ]);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Startup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StartupTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

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

    public function test_startups_can_be_listed()
    {
        Startup::factory()->count(3)->create();

        $response = $this->getJson('/api/startups');

        $response->assertOk()
            ->assertJsonCount(3);
    }

    public function test_startup_can_be_created()
    {
        $token = $this->authenticate();

        $payload = [
            'name' => 'Startup Serena',
            'email' => 'contact@serenastartup.com',
            'sector' => 'FinTech',
            'maturity' => 'MVP',
            'address' => '42 rue des licornes',
            'phone' => '0600000000',
            'legal_status' => 'SARL'
        ];

        $response = $this->withToken($token)
            ->postJson('/api/startups', $payload);

        $response->assertCreated()
            ->assertJsonFragment([
                'name' => 'Startup Serena',
                'sector' => 'FinTech',
            ]);
    }

    public function test_startup_can_be_shown()
    {
        $startup = Startup::factory()->create();

        $response = $this->getJson("/api/startups/{$startup->id}");

        $response->assertOk()
            ->assertJsonFragment(['id' => $startup->id]);
    }

    public function test_startup_can_be_updated()
    {
        $token = $this->authenticate();

        $startup = Startup::factory()->create([
            'name' => 'Startup Originale',
            'maturity' => 'Prototype'
        ]);

        $response = $this->withToken($token)
            ->putJson("/api/startups/{$startup->id}", [
                'name' => 'Startup Modifiée',
                'maturity' => 'MVP',
            ]);

        $response->assertOk()
            ->assertJsonFragment([
                'name' => 'Startup Modifiée',
                'maturity' => 'MVP'
            ]);
    }

    public function test_startup_can_be_deleted()
    {
        $token = $this->authenticate();

        $startup = Startup::factory()->create();

        $response = $this->withToken($token)
            ->deleteJson("/api/startups/{$startup->id}");

        $response->assertOk()
            ->assertJson(['message' => 'Startup deleted']);
    }
}

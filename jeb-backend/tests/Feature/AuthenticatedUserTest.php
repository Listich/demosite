<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticatedUserTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'email' => 'admin@jeb.com',
            'password' => bcrypt('password'),
        ]);
    }

    public function test_it_returns_authenticated_user_info_with_me()
    {
        $response = $this->actingAs($this->user)->getJson('/api/me');

        $response->assertOk();
        $response->assertJsonFragment([
            'email' => 'admin@jeb.com',
            'id' => $this->user->id,
        ]);
    }

    public function test_it_logs_out_user_with_logout()
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/logout');

        $response->assertOk();
        $response->assertJson(['message' => 'Déconnecté avec succès']);
    }
}

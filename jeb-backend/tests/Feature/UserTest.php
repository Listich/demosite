<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class UserTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $admin = User::factory()->create([
            'email' => 'admin@jeb.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Login pour obtenir le token
        $response = $this->postJson('/api/login', [
            'email' => 'admin@jeb.com',
            'password' => 'password',
        ]);

        $this->token = $response->json('token');
    }

    public function test_user_can_be_listed()
    {
        User::factory()->count(3)->create();

        $response = $this->withToken($this->token)->getJson('/api/users');

        $response->assertOk();
        $response->assertJsonStructure([[
            'id', 'name', 'email', 'role',
        ]]);
    }

    public function test_user_can_be_created()
    {
        $payload = [
            'name' => 'Serena Test',
            'email' => 'serena@example.com',
            'password' => 'password',
            'role' => 'founder',
        ];

        $response = $this->withToken($this->token)->postJson('/api/users', $payload);

        $response->assertCreated();
        $response->assertJsonFragment([
            'name' => 'Serena Test',
            'email' => 'serena@example.com',
            'role' => 'founder',
        ]);
    }

    public function test_user_can_be_shown()
    {
        $user = User::factory()->create();

        $response = $this->withToken($this->token)->getJson("/api/users/{$user->id}");

        $response->assertOk();
        $response->assertJsonFragment(['email' => $user->email]);
    }

    public function test_user_can_be_updated()
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'role' => 'founder',
        ]);

        $response = $this->withToken($this->token)->putJson("/api/users/{$user->id}", [
            'name' => 'New Name',
            'role' => 'admin',
        ]);

        $response->assertOk();
        $response->assertJsonFragment([
            'name' => 'New Name',
            'role' => 'admin',
        ]);
    }

    public function test_user_can_be_deleted()
    {
        $user = User::factory()->create();

        $response = $this->withToken($this->token)->deleteJson("/api/users/{$user->id}");

        $response->assertOk();
        $response->assertJson(['message' => 'User deleted']);
    }
}

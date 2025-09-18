<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    /**
     * A basic feature test example.
     */
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

    public function test_project_can_be_listed()
    {
        Project::factory()->count(3)->create();

        $response = $this->getJson('/api/projects');

        $response->assertOk()
            ->assertJsonCount(3);
    }

    public function test_project_can_be_created()
    {
        $token = $this->authenticate();

        $payload = [
            'name' => 'Projet Test',
            'description' => 'Description du projet',
            'contact_email' => 'test@project.com',
            'website' => 'https://project.com',
            'needs' => ['mentorat'],
            'progress' => 'MVP',
            'legal_status' => 'SAS',
            'address' => '123 rue des tests',
            'phone' => '0123456789',
            'sector' => 'Tech',
            'maturity' => 'Prototype'
        ];

        $response = $this->withToken($token)
            ->postJson('/api/projects', $payload);

        $response->assertCreated()
            ->assertJsonFragment(['name' => 'Projet Test']);
    }

    public function test_project_can_be_shown()
    {
        $project = Project::factory()->create();

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertOk()
            ->assertJsonFragment(['id' => $project->id]);
    }

    public function test_project_can_be_updated()
    {
        $token = $this->authenticate();

        $project = Project::factory()->create([
            'progress' => 'Idea',
        ]);

        $response = $this->withToken($token)
            ->putJson("/api/projects/{$project->id}", [
                'progress' => 'Product-Market Fit',
                'name' => 'Projet Mis à jour'
            ]);

        $response->assertOk()
            ->assertJsonFragment(['progress' => 'Product-Market Fit']);
    }

    public function test_project_can_be_deleted()
    {
        $token = $this->authenticate();

        $project = Project::factory()->create();

        $response = $this->withToken($token)
            ->deleteJson("/api/projects/{$project->id}");

        $response->assertOk()
            ->assertJson(['message' => 'Project deleted']);
    }
}

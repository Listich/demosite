<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Startup;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Startup>
 */
class StartupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Startup::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company,
            'legal_status' => $this->faker->randomElement(['SARL', 'SAS', 'Auto-entrepreneur']),
            'address' => $this->faker->address,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'description' => $this->faker->paragraph,
            'website_url' => $this->faker->url,
            'social_media_url' => $this->faker->url,
            'project_status' => $this->faker->randomElement(['En cours', 'Finalisé', 'Abandonné']),
            'needs' => $this->faker->words(3, true),
            'sector' => $this->faker->randomElement(['HealthTech', 'EdTech', 'DeepTech']),
            'maturity' => $this->faker->randomElement(['Idea', 'Prototype', 'MVP']),
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'description' => $this->faker->paragraphs(2, true),
            'founders' => $this->faker->name(),
            'contact_email' => $this->faker->unique()->safeEmail(),
            'website' => $this->faker->url(),
            'needs' => $this->faker->randomElements(['funding','mentorship','hiring','marketing'], rand(1,3)),
            'progress' => $this->faker->randomElement(['idea','prototype','early-stage','growth']),
        ];
    }
}

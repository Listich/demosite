<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('founders')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('website')->nullable();
            $table->json('needs')->nullable();
            $table->string('progress')->nullable();
            $table->string('legal_status')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('sector')->nullable();
            $table->string('maturity')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

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
        Schema::create('startups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('legal_status')->nullable();
            $table->string('address')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('description')->nullable();
            $table->string('website_url')->nullable();
            $table->string('social_media_url')->nullable();
            $table->string('project_status')->nullable();
            $table->string('needs')->nullable();
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
        Schema::dropIfExists('startups');
    }

};

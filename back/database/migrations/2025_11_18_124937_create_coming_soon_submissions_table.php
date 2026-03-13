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
        Schema::create('coming_soon_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('nom'); // Last name
            $table->string('prenom'); // First name
            $table->string('telephone');
            $table->string('email');
            $table->string('ville')->nullable(); // City
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coming_soon_submissions');
    }
};

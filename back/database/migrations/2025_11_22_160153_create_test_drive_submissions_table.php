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
        Schema::create('test_drive_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('model'); // Selected model
            $table->string('nom'); // Last name
            $table->string('prenom'); // First name
            $table->string('telephone');
            $table->string('email')->nullable(); // Email is optional
            $table->text('message')->nullable(); // Message is optional
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
        Schema::dropIfExists('test_drive_submissions');
    }
};

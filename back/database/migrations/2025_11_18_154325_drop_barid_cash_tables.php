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
        // Drop Barid Cash related tables if they exist
        Schema::dropIfExists('contact_submissions');
        Schema::dropIfExists('recruitment_submissions');
        Schema::dropIfExists('mandataire_submissions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration only drops tables, so we don't recreate them
    }
};

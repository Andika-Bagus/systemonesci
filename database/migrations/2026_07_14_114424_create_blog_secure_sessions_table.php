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
        Schema::create('blog_secure_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_token')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('user_agent')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index(['session_token', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_secure_sessions');
    }
};

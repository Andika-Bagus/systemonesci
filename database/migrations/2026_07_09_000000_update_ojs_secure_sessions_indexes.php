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
        Schema::table('ojs_secure_sessions', function (Blueprint $table) {
            // Drop old index
            $table->dropIndex(['session_token', 'expires_at']);
            
            // Add new indexes (same as wp_secure_sessions)
            $table->index(['session_token', 'user_id']);
            $table->index('expires_at');
            
            // Change user_agent from varchar to text
            $table->text('user_agent')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ojs_secure_sessions', function (Blueprint $table) {
            // Restore old index
            $table->dropIndex(['session_token', 'user_id']);
            $table->dropIndex(['expires_at']);
            $table->index(['session_token', 'expires_at']);
            
            // Restore user_agent to varchar
            $table->string('user_agent')->nullable()->change();
        });
    }
};

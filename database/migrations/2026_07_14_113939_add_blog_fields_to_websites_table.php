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
        Schema::table('websites', function (Blueprint $table) {
            $table->string('blog_username')->nullable()->after('wp_login_url');
            $table->string('blog_password')->nullable()->after('blog_username');
            $table->string('blog_admin_url')->nullable()->after('blog_password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('websites', function (Blueprint $table) {
            $table->dropColumn(['blog_username', 'blog_password', 'blog_admin_url']);
        });
    }
};

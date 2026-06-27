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
            // Add cdn_provider column directly (skip cloudflare_account step)
            if (!Schema::hasColumn('websites', 'cdn_provider')) {
                $table->string('cdn_provider')->nullable()->after('letak_server');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('websites', function (Blueprint $table) {
            if (Schema::hasColumn('websites', 'cdn_provider')) {
                $table->dropColumn('cdn_provider');
            }
        });
    }
};

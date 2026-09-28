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
        Schema::table('sop_webs', function (Blueprint $table) {
            $table->string('holding')->nullable();
            $table->string('url')->nullable();
            $table->string('jenis_web')->nullable();
            $table->string('ganti_wp_admin')->nullable();
            $table->string('plugin_wordfence')->nullable();
            $table->string('update_all_plugin')->nullable();
            $table->string('konfigurasi_rate_limit')->nullable();
            $table->date('last_update')->nullable();
            $table->string('pic')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sop_webs', function (Blueprint $table) {
            $table->dropColumn([
                'holding',
                'url',
                'jenis_web',
                'ganti_wp_admin',
                'plugin_wordfence',
                'update_all_plugin',
                'konfigurasi_rate_limit',
                'last_update',
                'pic'
            ]);
        });
    }
};

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
        Schema::table('ojs_instances', function (Blueprint $table) {
            $table->string('holding')->after('id');
            $table->string('url')->after('holding');
            $table->string('letak_cdn')->nullable()->after('url');
            $table->string('letak_server')->nullable()->after('letak_cdn');
            $table->string('versi_ojs')->nullable()->after('letak_server');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ojs_instances', function (Blueprint $table) {
            $table->dropColumn(['holding', 'url', 'letak_cdn', 'letak_server', 'versi_ojs']);
        });
    }
};

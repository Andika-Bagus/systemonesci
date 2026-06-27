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
            $table->string('ojs_username')->nullable()->after('versi_ojs');
            $table->string('ojs_password')->nullable()->after('ojs_username');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ojs_instances', function (Blueprint $table) {
            $table->dropColumn(['ojs_username', 'ojs_password']);
        });
    }
};

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
            $table->date('domain_expiry_date')->nullable()->after('keterangan');
            $table->string('domain_registrar')->nullable()->after('domain_expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ojs_instances', function (Blueprint $table) {
            $table->dropColumn(['domain_expiry_date', 'domain_registrar']);
        });
    }
};

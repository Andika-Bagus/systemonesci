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
            // Rename domain_expiry_date to domain_expires_at to match websites table
            $table->renameColumn('domain_expiry_date', 'domain_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ojs_instances', function (Blueprint $table) {
            $table->renameColumn('domain_expires_at', 'domain_expiry_date');
        });
    }
};

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
            $table->date('domain_registered_at')->nullable()->after('updated_at');
            $table->date('domain_expires_at')->nullable()->after('domain_registered_at');
            $table->string('domain_registrar')->nullable()->after('domain_expires_at');
            $table->timestamp('domain_last_checked')->nullable()->after('domain_registrar');
            $table->enum('domain_status', ['active', 'expiring_soon', 'expired', 'unknown'])->default('unknown')->after('domain_last_checked');
            $table->integer('days_until_expiry')->nullable()->after('domain_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('websites', function (Blueprint $table) {
            $table->dropColumn([
                'domain_registered_at',
                'domain_expires_at',
                'domain_registrar',
                'domain_last_checked',
                'domain_status',
                'days_until_expiry'
            ]);
        });
    }
};

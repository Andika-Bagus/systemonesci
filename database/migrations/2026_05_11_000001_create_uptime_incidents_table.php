<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('uptime_incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained()->onDelete('cascade');
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->integer('duration')->nullable()->comment('Duration in seconds');
            $table->text('reason')->nullable();
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();
            
            // Index untuk query cepat
            $table->index(['website_id', 'started_at']);
            $table->index(['website_id', 'is_resolved']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('uptime_incidents');
    }
};

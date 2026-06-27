<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_speeds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained()->onDelete('cascade');
            
            // Desktop metrics
            $table->integer('desktop_performance_score')->nullable();
            $table->integer('desktop_accessibility_score')->nullable();
            $table->integer('desktop_best_practices_score')->nullable();
            $table->integer('desktop_seo_score')->nullable();
            $table->float('desktop_lcp')->nullable();
            $table->float('desktop_fid')->nullable();
            $table->float('desktop_cls')->nullable();
            
            // Mobile metrics
            $table->integer('mobile_performance_score')->nullable();
            $table->integer('mobile_accessibility_score')->nullable();
            $table->integer('mobile_best_practices_score')->nullable();
            $table->integer('mobile_seo_score')->nullable();
            $table->float('mobile_lcp')->nullable();
            $table->float('mobile_fid')->nullable();
            $table->float('mobile_cls')->nullable();
            
            $table->json('desktop_recommendations')->nullable();
            $table->json('mobile_recommendations')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_speeds');
    }
};

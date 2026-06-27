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
        Schema::dropIfExists('tickets');
        
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->string('judul');
            $table->text('deskripsi');
            $table->enum('jenis', ['perbaikan_website', 'maintenance', 'konsultasi', 'lainnya'])->default('perbaikan_website');
            $table->enum('prioritas', ['rendah', 'sedang', 'tinggi', 'mendesak'])->default('sedang');
            $table->enum('status', ['buka', 'proses', 'selesai', 'tutup'])->default('buka');
            $table->string('nama_holding');
            $table->string('pic_nama');
            $table->string('website_url')->nullable();
            $table->text('detail_masalah');
            $table->date('tanggal_kunjungan_diinginkan')->nullable();
            $table->time('waktu_kunjungan_diinginkan')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
        
        // Recreate old structure if needed
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }
};
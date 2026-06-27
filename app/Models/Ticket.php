<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    protected $fillable = [
        'ticket_number',
        'judul',
        'deskripsi',
        'jenis',
        'prioritas',
        'status',
        'nama_holding',
        'pic_nama',
        'website_url',
        'detail_masalah',
        'tanggal_kunjungan_diinginkan',
        'waktu_kunjungan_diinginkan',
        'catatan_admin',
        'assigned_to',
        'created_by',
        'resolved_at',
    ];

    protected $casts = [
        'tanggal_kunjungan_diinginkan' => 'date',
        'waktu_kunjungan_diinginkan' => 'datetime:H:i',
        'resolved_at' => 'datetime',
    ];

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getStatusBadgeAttribute()
    {
        $badges = [
            'buka' => ['class' => 'bg-blue-100 text-blue-800', 'text' => 'Buka'],
            'proses' => ['class' => 'bg-yellow-100 text-yellow-800', 'text' => 'Proses'],
            'selesai' => ['class' => 'bg-green-100 text-green-800', 'text' => 'Selesai'],
            'tutup' => ['class' => 'bg-gray-100 text-gray-800', 'text' => 'Tutup'],
        ];

        return $badges[$this->status] ?? $badges['buka'];
    }

    public function getPriorityBadgeAttribute()
    {
        $badges = [
            'rendah' => ['class' => 'bg-gray-100 text-gray-800', 'text' => 'Rendah'],
            'sedang' => ['class' => 'bg-blue-100 text-blue-800', 'text' => 'Sedang'],
            'tinggi' => ['class' => 'bg-orange-100 text-orange-800', 'text' => 'Tinggi'],
            'mendesak' => ['class' => 'bg-red-100 text-red-800', 'text' => 'Mendesak'],
        ];

        return $badges[$this->prioritas] ?? $badges['sedang'];
    }
}

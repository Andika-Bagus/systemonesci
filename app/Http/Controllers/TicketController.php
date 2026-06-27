<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Ticket::with(['assignedTo', 'createdBy']);

            // Filter by user role and holding
            $user = $request->user();
            if ($user->role === 'ticketing_user' && $user->holding_id) {
                // Get holding name directly from user
                $user->load('holding');
                if ($user->holding && $user->holding->holding) {
                    $holdingName = $user->holding->holding;
                    $query->where('nama_holding', $holdingName);
                }
            }
            // Superadmin and other roles can see all tickets

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by priority
            if ($request->has('priority') && $request->priority !== 'all') {
                $query->where('priority', $request->priority);
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('ticket_number', 'like', "%{$search}%")
                      ->orWhere('judul', 'like', "%{$search}%")
                      ->orWhere('nama_holding', 'like', "%{$search}%")
                      ->orWhere('pic_nama', 'like', "%{$search}%");
                });
            }

            $tickets = $query->orderBy('created_at', 'desc')->paginate(10);

            return response()->json($tickets);
        } catch (\Exception $e) {
            \Log::error('Ticket index error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Error fetching tickets'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'jenis' => 'required|in:perbaikan_website,maintenance,konsultasi,lainnya',
            'prioritas' => 'required|in:rendah,sedang,tinggi,mendesak',
            'nama_holding' => 'required|string|max:255',
            'pic_nama' => 'required|string|max:255',
            'website_url' => 'nullable|url|max:255',
            'detail_masalah' => 'required|string',
            'tanggal_kunjungan_diinginkan' => 'nullable|date|after_or_equal:today',
            'waktu_kunjungan_diinginkan' => 'nullable|date_format:H:i',
        ]);

        $validated['created_by'] = Auth::id();

        // Use transaction to ensure atomic ticket number generation
        $ticket = \DB::transaction(function () use ($validated) {
            $today = now()->format('Ymd');
            
            // Lock and count tickets created today
            $count = Ticket::whereRaw("DATE_FORMAT(created_at, '%Y%m%d') = ?", [$today])
                ->lockForUpdate()
                ->count();
            
            $validated['ticket_number'] = 'TKT-' . $today . '-' . str_pad($count + 1, 4, '0', STR_PAD_LEFT);
            
            return Ticket::create($validated);
        });

        $ticket->load(['assignedTo', 'createdBy']);

        // Create notification for all admin/ticketing_user
        $admins = User::whereIn('role', ['superadmin', 'ticketing_user'])->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'ticket_created',
                'title' => "Ticket Baru: {$ticket->judul}",
                'message' => "Ticket #{$ticket->ticket_number} dari {$ticket->nama_holding} telah dibuat",
                'related_model' => 'Ticket',
                'related_id' => $ticket->id,
            ]);
        }

        return response()->json($ticket, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        return response()->json($ticket->load(['assignedTo', 'createdBy']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'jenis' => 'sometimes|in:perbaikan_website,maintenance,konsultasi,lainnya',
            'prioritas' => 'sometimes|in:rendah,sedang,tinggi,mendesak',
            'status' => 'sometimes|in:buka,proses,selesai,tutup',
            'nama_holding' => 'sometimes|string|max:255',
            'pic_nama' => 'sometimes|string|max:255',
            'website_url' => 'nullable|url|max:255',
            'detail_masalah' => 'sometimes|string',
            'tanggal_kunjungan_diinginkan' => 'nullable|date|after_or_equal:today',
            'waktu_kunjungan_diinginkan' => 'nullable|date_format:H:i',
            'catatan_admin' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        // Set resolved_at when status changes to selesai
        if (isset($validated['status']) && $validated['status'] === 'selesai' && $ticket->status !== 'selesai') {
            $validated['resolved_at'] = now();
        }

        $ticket->update($validated);
        return response()->json($ticket->load(['assignedTo', 'createdBy']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return response()->json(null, 204);
    }

    /**
     * Get ticket statistics
     */
    public function stats()
    {
        $stats = [
            'total' => Ticket::count(),
            'buka' => Ticket::where('status', 'buka')->count(),
            'proses' => Ticket::where('status', 'proses')->count(),
            'selesai' => Ticket::where('status', 'selesai')->count(),
            'tutup' => Ticket::where('status', 'tutup')->count(),
            'mendesak' => Ticket::where('prioritas', 'mendesak')->count(),
        ];

        return response()->json($stats);
    }
}

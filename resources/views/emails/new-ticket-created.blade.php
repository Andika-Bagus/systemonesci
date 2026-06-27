<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: white;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .footer {
            background-color: #f0f0f0;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 5px 5px;
        }
        .ticket-info {
            background-color: #f0f7ff;
            padding: 15px;
            border-left: 4px solid #2563eb;
            margin: 15px 0;
        }
        .info-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
        }
        .label {
            font-weight: bold;
            color: #555;
            min-width: 150px;
        }
        .value {
            color: #333;
        }
        .priority-mendesak {
            color: #dc2626;
            font-weight: bold;
        }
        .priority-tinggi {
            color: #ea580c;
            font-weight: bold;
        }
        .priority-sedang {
            color: #f59e0b;
            font-weight: bold;
        }
        .priority-rendah {
            color: #10b981;
            font-weight: bold;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🎫 Ticket Baru Dibuat</h2>
        </div>

        <div class="content">
            <p>Halo,</p>
            <p>Ada ticket baru yang telah dibuat dalam sistem. Berikut adalah detail ticketnya:</p>

            <div class="ticket-info">
                <div class="info-row">
                    <span class="label">Nomor Ticket:</span>
                    <span class="value">#{{ $ticket->ticket_number }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Judul:</span>
                    <span class="value">{{ $ticket->judul }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Jenis:</span>
                    <span class="value">{{ ucfirst(str_replace('_', ' ', $ticket->jenis)) }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Prioritas:</span>
                    <span class="value priority-{{ $ticket->prioritas }}">{{ ucfirst($ticket->prioritas) }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Holding:</span>
                    <span class="value">{{ $ticket->nama_holding }}</span>
                </div>
                <div class="info-row">
                    <span class="label">PIC:</span>
                    <span class="value">{{ $ticket->pic_nama }}</span>
                </div>
                @if($ticket->website_url)
                <div class="info-row">
                    <span class="label">Website:</span>
                    <span class="value"><a href="{{ $ticket->website_url }}" target="_blank">{{ $ticket->website_url }}</a></span>
                </div>
                @endif
                <div class="info-row">
                    <span class="label">Status:</span>
                    <span class="value">{{ ucfirst($ticket->status) }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Dibuat oleh:</span>
                    <span class="value">{{ $ticket->createdBy->name ?? 'System' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Tanggal Dibuat:</span>
                    <span class="value">{{ $ticket->created_at->format('d M Y H:i') }}</span>
                </div>
            </div>

            <h3>Deskripsi:</h3>
            <p>{{ $ticket->deskripsi }}</p>

            <h3>Detail Masalah:</h3>
            <p>{{ $ticket->detail_masalah }}</p>

            @if($ticket->tanggal_kunjungan_diinginkan)
            <div class="ticket-info">
                <p><strong>Tanggal Kunjungan Diinginkan:</strong> {{ $ticket->tanggal_kunjungan_diinginkan }}</p>
                @if($ticket->waktu_kunjungan_diinginkan)
                <p><strong>Waktu Kunjungan Diinginkan:</strong> {{ $ticket->waktu_kunjungan_diinginkan }}</p>
                @endif
            </div>
            @endif

            <p>Silakan login ke sistem untuk melihat detail lengkap dan mengelola ticket ini.</p>
            
            <a href="{{ config('app.frontend_url') }}" class="button" target="_blank">
                Buka Dashboard
            </a>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} SyntaxOne. Semua hak dilindungi.</p>
            <p>Email ini dikirim secara otomatis. Jangan balas email ini.</p>
        </div>
    </div>
</body>
</html>

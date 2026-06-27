import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ticketAPI } from "@/services/api";
import { Eye, Plus, Search, Ticket, Clock, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface TicketData {
  id: number;
  ticket_number: string;
  judul: string;
  deskripsi: string;
  jenis: string;
  prioritas: string;
  status: string;
  nama_holding: string;
  pic_nama: string;
  website_url?: string;
  detail_masalah: string;
  tanggal_kunjungan_diinginkan?: string;
  waktu_kunjungan_diinginkan?: string;
  catatan_admin?: string;
  assigned_to?: number;
  created_by: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  assigned_to_user?: {
    id: number;
    name: string;
    email: string;
  };
}

const TicketsList = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTickets = async () => {
    try {
      console.log('Fetching tickets...');
      const response = await ticketAPI.getAll();
      console.log('Tickets response:', response.data);
      
      // Handle pagination response - Laravel pagination returns data in 'data' property
      const ticketsData = response.data.data || response.data || [];
      console.log('Tickets data:', ticketsData);
      
      setTickets(ticketsData);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Gagal memuat tiket: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      console.log('Loading initial data...');
      try {
        await fetchTickets();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchTickets();
    }
  }, [searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { text: string; color: string; icon: React.ReactNode }> = {
      buka: { 
        text: "Pending", 
        color: "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200",
        icon: <AlertCircle className="h-3.5 w-3.5" />
      },
      proses: { 
        text: "Proses", 
        color: "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200",
        icon: <Clock className="h-3.5 w-3.5" />
      },
      selesai: { 
        text: "Done", 
        color: "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />
      },
      tutup: { 
        text: "Done", 
        color: "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />
      },
    };
    return variants[status] || variants.buka;
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tiket ini?')) {
      return;
    }

    try {
      await ticketAPI.delete(id);
      setTickets(tickets.filter(ticket => ticket.id !== id));
      toast.success('Tiket berhasil dihapus');
    } catch (error: any) {
      console.error('Error deleting ticket:', error);
      toast.error('Gagal menghapus tiket: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daftar Tiket</h1>
          <p className="text-muted-foreground">Kelola tiket dukungan dan permintaan layanan</p>
        </div>
        <Link to="/tickets/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Buat Tiket Baru
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan nomor tiket, PIC, atau holding..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="buka">Pending</SelectItem>
                <SelectItem value="proses">Proses</SelectItem>
                <SelectItem value="selesai">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">No. Tiket</TableHead>
                  <TableHead className="font-semibold">PIC</TableHead>
                  <TableHead className="font-semibold">Holding</TableHead>
                  <TableHead className="font-semibold">Keterangan</TableHead>
                  <TableHead className="font-semibold">Waktu</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="text-muted-foreground">
                        <Ticket className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">Tidak ada tiket ditemukan</p>
                        <p className="text-sm">Buat tiket baru untuk memulai</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm font-medium">
                        {ticket.ticket_number}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {ticket.pic_nama}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {ticket.nama_holding}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <p className="font-medium text-foreground mb-1">{ticket.judul}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ticket.deskripsi}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-foreground">
                            {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(ticket.created_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusBadge(ticket.status).color} px-4 py-2 rounded-full font-semibold text-sm gap-2 flex items-center justify-center w-28`}
                        >
                          {getStatusBadge(ticket.status).icon}
                          {getStatusBadge(ticket.status).text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Link to={`/tickets/${ticket.id}`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(ticket.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketsList;

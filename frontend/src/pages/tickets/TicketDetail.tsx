import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ticketAPI } from "@/services/api";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

interface TicketData {
  id: number;
  ticket_number: string;
  title?: string;
  description?: string;
  judul?: string;
  deskripsi?: string;
  detail_masalah?: string;
  type?: string;
  jenis?: string;
  priority: string;
  status: string;
  company_name?: string;
  contact_person?: string;
  pic_nama?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  problem_details?: string;
  preferred_visit_date?: string;
  preferred_visit_time?: string;
  admin_notes?: string;
  catatan_admin?: string;
  assigned_to?: number;
  created_by: number;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  nama_holding?: string;
  assigned_to_user?: {
    id: number;
    name: string;
    email: string;
  };
  created_by_user?: {
    id: number;
    name: string;
    email: string;
  };
}

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    status: '',
    priority: '',
    admin_notes: '',
    assigned_to: '',
  });

  const fetchTicket = async () => {
    try {
      const response = await ticketAPI.getById(parseInt(id!));
      setTicket(response.data);
      setEditData({
        status: response.data.status,
        priority: response.data.priority,
        admin_notes: response.data.admin_notes || response.data.catatan_admin || '',
        assigned_to: response.data.assigned_to?.toString() || '',
      });
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to fetch ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData: any = {
        status: editData.status,
        priority: editData.priority,
        admin_notes: editData.admin_notes,
      };

      if (editData.assigned_to) {
        updateData.assigned_to = parseInt(editData.assigned_to);
      }

      await ticketAPI.update(parseInt(id!), updateData);
      toast.success('Ticket updated successfully');
      setEditing(false);
      fetchTicket();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; text: string; class: string; color: string }> = {
      open: { variant: "default", text: "Open", class: "bg-blue-100 text-blue-800", color: "bg-blue-100 text-blue-800" },
      in_progress: { variant: "secondary", text: "In Progress", class: "bg-yellow-100 text-yellow-800", color: "bg-yellow-100 text-yellow-800" },
      resolved: { variant: "outline", text: "Resolved", class: "bg-green-100 text-green-800", color: "bg-green-100 text-green-800" },
      closed: { variant: "destructive", text: "Closed", class: "bg-gray-100 text-gray-800", color: "bg-gray-100 text-gray-800" },
      buka: { variant: "default", text: "Pending", class: "bg-blue-100 text-blue-800", color: "bg-blue-100 text-blue-800" },
      proses: { variant: "secondary", text: "Proses", class: "bg-yellow-100 text-yellow-800", color: "bg-yellow-100 text-yellow-800" },
      selesai: { variant: "outline", text: "Done", class: "bg-green-100 text-green-800", color: "bg-green-100 text-green-800" },
    };
    return variants[status] || variants.open;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ticket not found</p>
        <Link to="/tickets">
          <Button className="mt-4">Back to Tickets</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <Link to="/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Detail Tiket</h1>
            <p className="text-sm text-muted-foreground font-mono">{ticket.ticket_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            <Button onClick={() => setEditing(true)} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Status
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                Batal
              </Button>
              <Button onClick={handleSave} disabled={saving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Ticket Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Informasi Tiket</span>
                <Badge className={`${getStatusBadge(ticket.status).class} border-0 font-medium text-sm`}>
                  {getStatusBadge(ticket.status).text}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 mb-1">No. Tiket</p>
                  <p className="font-mono text-sm font-bold text-blue-900">{ticket.ticket_number}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                  <p className="text-xs font-semibold text-purple-600 mb-1">PIC</p>
                  <p className="text-sm font-medium text-purple-900">{ticket.pic_nama || '-'}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-600 mb-1">Holding</p>
                  <p className="text-sm font-medium text-green-900">{ticket.nama_holding || '-'}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200">
                  <p className="text-xs font-semibold text-orange-600 mb-1">Waktu Dibuat</p>
                  <p className="text-sm font-medium text-orange-900">
                    {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: '2-digit', 
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-orange-700">
                    {new Date(ticket.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-foreground text-sm">Keterangan</h4>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
                  <p className="font-semibold text-foreground mb-1">{ticket.judul || '-'}</p>
                  <p className="text-sm text-muted-foreground mb-2">{ticket.deskripsi || '-'}</p>
                  {ticket.detail_masalah && (
                    <div className="border-t border-slate-300 pt-2 mt-2">
                      <p className="text-xs font-semibold text-slate-600 mb-1">Detail Masalah:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.detail_masalah}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Catatan Admin</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={editData.admin_notes}
                  onChange={(e) => setEditData({ ...editData, admin_notes: e.target.value })}
                  placeholder="Tambahkan catatan internal tentang tiket ini..."
                  rows={3}
                  className="resize-none text-sm"
                />
              ) : (
                <div className="min-h-[80px] bg-muted/30 p-3 rounded-lg">
                  {ticket.admin_notes || ticket.catatan_admin ? (
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">{ticket.admin_notes || ticket.catatan_admin}</p>
                  ) : (
                    <p className="text-muted-foreground italic text-sm">Belum ada catatan admin</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Status Tiket</label>
                {editing ? (
                  <Select value={editData.status} onValueChange={(value) => setEditData({ ...editData, status: value })}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buka">Pending</SelectItem>
                      <SelectItem value="proses">Proses</SelectItem>
                      <SelectItem value="selesai">Done</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={`${getStatusBadge(ticket.status).color} border-0 font-medium text-sm px-3 py-1`}>
                    {getStatusBadge(ticket.status).text}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Dibuat:</span>
                <span className="text-muted-foreground text-xs">
                  {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Update:</span>
                <span className="text-muted-foreground text-xs">
                  {new Date(ticket.updated_at).toLocaleDateString('id-ID')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Jenis:</span>
                <span className="text-muted-foreground text-xs capitalize">{(ticket.jenis || ticket.type || '-').replace('_', ' ')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
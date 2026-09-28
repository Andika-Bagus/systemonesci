import { useEffect, useState, useMemo } from 'react';
import api from '@/services/api';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, Search, Plus, Trash2, Edit2, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface SopWeb {
  id: number;
  holding: string;
  url: string;
  jenis_web: string | null;
  ganti_wp_admin: string | null;
  plugin_wordfence: string | null;
  update_all_plugin: string | null;
  last_update: string | null;
  pic: string | null;
}

const STATUS_OPTIONS = ['DONE', 'BELUM'];

export default function SopWebsList() {
  const { user } = useUser();
  const isViewer = user?.role === 'viewer';
  
  const [data, setData] = useState<SopWeb[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHolding, setSelectedHolding] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSop, setNewSop] = useState<Partial<SopWeb>>({
    holding: '',
    url: '',
    jenis_web: 'WP WEB',
    ganti_wp_admin: '',
    plugin_wordfence: '',
    update_all_plugin: '',
    pic: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sop-webs');
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat data SOP Web');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: number, field: keyof SopWeb, value: string) => {
    if (isViewer) return;
    const finalValue = value === 'none' ? null : value;
    
    // If updating 'last_update', use the provided date. Otherwise, auto-update to today.
    const newLastUpdate = field === 'last_update' ? finalValue : new Date().toISOString().split('T')[0];

    // Optimistic UI update
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: finalValue, last_update: newLastUpdate } : item
    ));

    try {
      await api.put(`/sop-webs/${id}`, { 
        [field]: finalValue,
        last_update: newLastUpdate
      });
      toast.success('Berhasil diperbarui');
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui status');
      fetchData(); // Revert on failure
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      await api.delete(`/sop-webs/${id}`);
      toast.success('Data berhasil dihapus');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus data');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/sop-webs', {
        ...newSop,
        last_update: new Date().toISOString().split('T')[0]
      });
      toast.success('Data SOP berhasil ditambahkan');
      setIsAddModalOpen(false);
      setNewSop({
        holding: '',
        url: '',
        jenis_web: 'WP WEB',
        ganti_wp_admin: '',
        plugin_wordfence: '',
        update_all_plugin: '',
        pic: ''
      });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan data');
    }
  };

  const getStatusColor = (status: string | null) => {
    if (status === 'DONE') return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
    if (status === 'BELUM') return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
    return 'text-neutral-400 bg-transparent hover:bg-neutral-100 border border-neutral-200';
  };

  const holdings = useMemo(() => Array.from(new Set(data.map(item => item.holding).filter(Boolean))), [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.holding.toLowerCase().includes(searchTerm.toLowerCase());
      const matchHolding = selectedHolding === 'all' || item.holding === selectedHolding;
      return matchSearch && matchHolding;
    });
  }, [data, searchTerm, selectedHolding]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="Security & Error WP (SOP)"
        subtitle="Kelola checklist SOP keamanan website"
        iconColor="bg-cyan-600"
        iconShadow="shadow-cyan-200"
      />

      <Card>
        <CardContent className="p-6">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari website, holding..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-neutral-50/50"
              />
            </div>
            
            <div className="w-full sm:w-48 space-y-1.5">
              <Label className="text-xs text-muted-foreground">Holding</Label>
              <Select value={selectedHolding} onValueChange={setSelectedHolding}>
                <SelectTrigger className="bg-neutral-50/50">
                  <SelectValue placeholder="Semua Holding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Holding</SelectItem>
                  {holdings.map(h => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isViewer && (
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto mt-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Data SOP Baru</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label>Holding</Label>
                        <Input required value={newSop.holding} onChange={e => setNewSop({...newSop, holding: e.target.value})} placeholder="CTH: RIN" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Link (URL)</Label>
                      <Input required type="url" value={newSop.url} onChange={e => setNewSop({...newSop, url: e.target.value})} placeholder="https://example.com" />
                    </div>
                    <Button type="submit" className="w-full">Simpan</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900">
                  <TableHead className="w-[50px] text-center font-bold">No</TableHead>
                  <TableHead className="font-bold">Holding</TableHead>
                  <TableHead className="font-bold">Link</TableHead>
                  <TableHead className="text-center font-bold">Ganti wp-admin</TableHead>
                  <TableHead className="text-center font-bold">Plugin wordfence</TableHead>
                  <TableHead className="text-center font-bold">Update all plugin</TableHead>
                  <TableHead className="text-center font-bold">Last Update</TableHead>
                  {!isViewer && <TableHead className="text-center font-bold w-[100px]">Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">Memuat data...</TableCell>
                  </TableRow>
                ) : currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">Tidak ada data ditemukan</TableCell>
                  </TableRow>
                ) : (
                  currentData.map((item, idx) => (
                    <TableRow key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                      <TableCell className="text-center text-muted-foreground">{startIndex + idx + 1}</TableCell>
                      <TableCell>
                        <span className="font-semibold bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-3 py-1 rounded-full text-xs">
                          {item.holding}
                        </span>
                      </TableCell>
                      <TableCell>
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline dark:text-blue-400 text-sm font-medium">
                          {item.url}
                        </a>
                      </TableCell>
                      
                      {/* Ganti wp-admin */}
                      <TableCell className="p-2 min-w-[130px]">
                        <Select 
                          disabled={isViewer} 
                          value={item.ganti_wp_admin || 'none'} 
                          onValueChange={(val) => handleStatusChange(item.id, 'ganti_wp_admin', val)}
                        >
                          <SelectTrigger className={`h-8 rounded-full text-xs font-semibold focus:ring-0 [&>svg]:hidden justify-center ${getStatusColor(item.ganti_wp_admin)}`}>
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            <SelectItem value="DONE" className="text-emerald-600 font-medium">DONE</SelectItem>
                            <SelectItem value="BELUM" className="text-amber-600 font-medium">BELUM</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* Plugin wordfence */}
                      <TableCell className="p-2 min-w-[130px]">
                        <Select 
                          disabled={isViewer} 
                          value={item.plugin_wordfence || 'none'} 
                          onValueChange={(val) => handleStatusChange(item.id, 'plugin_wordfence', val)}
                        >
                          <SelectTrigger className={`h-8 rounded-full text-xs font-semibold focus:ring-0 [&>svg]:hidden justify-center ${getStatusColor(item.plugin_wordfence)}`}>
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            <SelectItem value="DONE" className="text-emerald-600 font-medium">DONE</SelectItem>
                            <SelectItem value="BELUM" className="text-amber-600 font-medium">BELUM</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* Update all plugin */}
                      <TableCell className="p-2 min-w-[130px]">
                        <Select 
                          disabled={isViewer} 
                          value={item.update_all_plugin || 'none'} 
                          onValueChange={(val) => handleStatusChange(item.id, 'update_all_plugin', val)}
                        >
                          <SelectTrigger className={`h-8 rounded-full text-xs font-semibold focus:ring-0 [&>svg]:hidden justify-center ${getStatusColor(item.update_all_plugin)}`}>
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            <SelectItem value="DONE" className="text-emerald-600 font-medium">DONE</SelectItem>
                            <SelectItem value="BELUM" className="text-amber-600 font-medium">BELUM</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      <TableCell className="text-center p-2">
                        <input
                          type="date"
                          disabled={isViewer}
                          className="text-xs text-muted-foreground bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-neutral-300 w-[110px]"
                          value={item.last_update || ''}
                          onChange={(e) => handleStatusChange(item.id, 'last_update', e.target.value)}
                        />
                      </TableCell>
                      
                      {!isViewer && (
                        <TableCell className="px-1 text-center">
                          <div className="flex gap-1.5 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-xl"
                              title="Gunakan dropdown di tabel untuk mengedit status"
                              onClick={() => toast.info('Status bisa langsung diedit lewat dropdown di tabel. Untuk edit URL/Holding, ubah di menu Website List.')}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleDelete(item.id)} 
                              className="h-8 w-8 p-0 bg-[#d71921] hover:bg-red-700 text-white rounded-xl"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState, useMemo } from 'react';
import { ojsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Edit2, Plus, Search, AlertCircle, Layers } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';

interface OjsInstance {
  id: number;
  holding: string;
  url: string;
  letak_cdn: string | null;
  letak_server: string | null;
  versi_ojs: string | null;
  ojs_username: string | null;
  ojs_password: string | null;
  keterangan: string | null;
}

export default function OjsInstances() {
  const [instances, setInstances] = useState<OjsInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedHolding, setSelectedHolding] = useState<string>('all');
  const [selectedCdn, setSelectedCdn] = useState<string>('all');
  const [selectedServer, setSelectedServer] = useState<string>('all');
  const [selectedVersi, setSelectedVersi] = useState<string>('all');
  const [selectedKeterangan, setSelectedKeterangan] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    holding: '',
    url: '',
    letak_cdn: '' as string | null,
    letak_server: '' as string | null,
    versi_ojs: '' as string | null,
    ojs_username: '' as string | null,
    ojs_password: '' as string | null,
    keterangan: '' as string | null,
  });

  const [showOjsPassword, setShowOjsPassword] = useState(false);

  const holdingOptions = [
    'Ridwan Institute',
    'Publikasi Indonesia',
    'Green Publisher',
    'Riviera Publishing',
    'International Journal Labs',
    'Al-Makki Publisher',
    'PublikasiKu',
    'StaiKu',
    'Poltek SCI',
    'SEH',
    'DPS',
    'APEMTI',
    'APTI',
    'ASBIMANTARA',
    'ASPIMDO',
    'TIMOR-LESTE',
    'POLTEK - SINTA PREMIUM',
  ];

  const cdnOptions = [
    'Tidak Pakai',
    'Cloudflare 1',
    'Cloudflare 2',
    'Cloudflare 3',
    'Cloudflare 4',
    'Cloudflare 5',
    'Bunny',
  ];

  const serverOptions = [
    'Niaga RIN',
    'Cloud Hosting',
    'Niaga Valensi',
    'Niaga RV',
    'NIAGA IJL',
    'JH RV',
    'JH RIN',
    'JH Staiku',
    'JH GP',
    'JH AM',
    'JH PI',
    'JH RV',
    'JH Poltek',
    'Vultr Foundation',
    'Vultr Ditekindo',
    'Domainesia',
    'Cyberpanel PI',
    'VPS',
  ];

  const keteranganOptions = [
    'Jurnal Lama',
    'PJMT',
    'Inkubasi',
  ];

  const itemsPerPage = 10;

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ojsAPI.getAll();
      setInstances(response.data);
    } catch (error: any) {
      console.error('Error fetching OJS instances:', error);
      setError('Gagal memuat data OJS instances. Silakan coba lagi.');
      toast.error('Gagal memuat data OJS instances');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (instance?: OjsInstance) => {
    if (instance) {
      setEditingId(instance.id);
      setFormData(instance);
    } else {
      setEditingId(null);
      setFormData({
        holding: '',
        url: '',
        letak_cdn: null,
        letak_server: null,
        versi_ojs: null,
        ojs_username: null,
        ojs_password: null,
        keterangan: null,
      });
    }
    setOpen(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      if (editingId) {
        await ojsAPI.update(editingId, formData);
        toast.success('OJS instance berhasil diperbarui');
      } else {
        await ojsAPI.create(formData);
        toast.success('OJS instance berhasil ditambahkan');
      }
      setOpen(false);
      fetchInstances();
    } catch (error: any) {
      console.error('Error saving OJS instance:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan OJS instance';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ojsAPI.delete(id);
      setInstances(instances.filter(i => i.id !== id));
      toast.success('OJS instance berhasil dihapus');
    } catch (error) {
      console.error('Error deleting OJS instance:', error);
      toast.error('Gagal menghapus OJS instance');
    }
  };

  const filteredInstances = useMemo(() => {
    let result = instances;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(instance =>
        instance.url.toLowerCase().includes(searchLower) ||
        instance.holding.toLowerCase().includes(searchLower) ||
        instance.versi_ojs?.toLowerCase().includes(searchLower)
      );
    }

    // Holding filter
    if (selectedHolding !== 'all') {
      result = result.filter(instance => instance.holding === selectedHolding);
    }

    // CDN filter
    if (selectedCdn !== 'all') {
      result = result.filter(instance => instance.letak_cdn === selectedCdn);
    }

    // Server filter
    if (selectedServer !== 'all') {
      result = result.filter(instance => instance.letak_server === selectedServer);
    }

    // Versi OJS filter
    if (selectedVersi !== 'all') {
      result = result.filter(instance => instance.versi_ojs === selectedVersi);
    }

    // Keterangan filter
    if (selectedKeterangan !== 'all') {
      result = result.filter(instance => instance.keterangan === selectedKeterangan);
    }

    return result;
  }, [instances, searchTerm, selectedHolding, selectedCdn, selectedServer, selectedVersi, selectedKeterangan]);

  const holdings = useMemo(() => {
    const uniqueHoldings = [...new Set(instances.map(i => i.holding))];
    return uniqueHoldings.sort();
  }, [instances]);

  const cdns = useMemo(() => {
    const uniqueCdns = [...new Set(instances.map(i => i.letak_cdn).filter((v): v is string => v !== null))];
    return uniqueCdns.sort();
  }, [instances]);

  const servers = useMemo(() => {
    const uniqueServers = [...new Set(instances.map(i => i.letak_server).filter((v): v is string => v !== null))];
    return uniqueServers.sort();
  }, [instances]);

  const versis = useMemo(() => {
    const uniqueVersis = [...new Set(instances.map(i => i.versi_ojs).filter((v): v is string => v !== null))];
    return uniqueVersis.sort();
  }, [instances]);

  const keterangans = useMemo(() => {
    const fromInstances = instances.map(i => i.keterangan).filter((v): v is string => v !== null);
    const uniqueKeterangans = [...new Set([...keteranganOptions, ...fromInstances])];
    return uniqueKeterangans.sort();
  }, [instances]);

  const totalPages = Math.ceil(filteredInstances.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedInstances = filteredInstances.slice(startIdx, endIdx);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            icon={Layers}
            title="OJS Instances"
            subtitle="Kelola semua OJS instances Anda"
            iconColor="bg-blue-600"
            iconShadow="shadow-blue-200"
          />
        </div>
        
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-medium">{error}</div>
              <Button onClick={fetchInstances} variant="outline">
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Layers}
        title="OJS Instances"
        subtitle="Kelola semua OJS instances Anda"
        iconColor="bg-blue-600"
        iconShadow="shadow-blue-200"
      />

      <Card>
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              Daftar OJS Instances
            </CardTitle>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total: {instances.length} instances</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search & Filter */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari URL, holding, versi OJS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Holding</Label>
                <Select value={selectedHolding} onValueChange={setSelectedHolding}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">Semua Holding</SelectItem>
                    {holdings.map((holding) => (
                      <SelectItem key={holding} value={holding}>
                        {holding}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">CDN</Label>
                <Select value={selectedCdn} onValueChange={setSelectedCdn}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">Semua CDN</SelectItem>
                    {cdns.map((cdn) => (
                      <SelectItem key={cdn} value={cdn}>
                        {cdn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Server</Label>
                <Select value={selectedServer} onValueChange={setSelectedServer}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">Semua Server</SelectItem>
                    {servers.map((server) => (
                      <SelectItem key={server} value={server}>
                        {server}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Versi OJS</Label>
                <Select value={selectedVersi} onValueChange={setSelectedVersi}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">Semua Versi</SelectItem>
                    {versis.map((versi) => (
                      <SelectItem key={versi} value={versi}>
                        {versi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Keterangan</Label>
                <Select value={selectedKeterangan} onValueChange={setSelectedKeterangan}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">Semua Keterangan</SelectItem>
                    {keterangans.map((ket) => (
                      <SelectItem key={ket} value={ket}>
                        {ket}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedHolding('all');
                    setSelectedCdn('all');
                    setSelectedServer('all');
                    setSelectedVersi('all');
                    setSelectedKeterangan('all');
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="mb-6">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus size={20} />
                  Tambah Data OJS
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? 'Edit OJS Instance' : 'Tambah OJS Instance Baru'}
                  </DialogTitle>
                </DialogHeader>
                <form 
                  onSubmit={handleSubmit} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="holding" className="mb-3 block">Holding</Label>
                    <Select value={formData.holding} onValueChange={(value) => setFormData({ ...formData, holding: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Holding" />
                      </SelectTrigger>
                      <SelectContent className="w-full max-h-[300px]">
                        {holdingOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="url" className="mb-3 block">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="letak_cdn" className="mb-3 block">Letak CDN</Label>
                    <Select value={formData.letak_cdn || 'none'} onValueChange={(value) => setFormData({ ...formData, letak_cdn: value === 'none' ? null : value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih CDN" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="none">-</SelectItem>
                        {cdnOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="letak_server" className="mb-3 block">Letak Server</Label>
                    <Select value={formData.letak_server || 'none'} onValueChange={(value) => setFormData({ ...formData, letak_server: value === 'none' ? null : value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Server" />
                      </SelectTrigger>
                      <SelectContent className="w-full max-h-[300px]">
                        <SelectItem value="none">-</SelectItem>
                        {serverOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="versi_ojs" className="mb-3 block">Versi OJS</Label>
                    <Select value={formData.versi_ojs || 'none'} onValueChange={(value) => setFormData({ ...formData, versi_ojs: value === 'none' ? null : value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Versi OJS" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="none">-</SelectItem>
                        <SelectItem value="3.1">3.1</SelectItem>
                        <SelectItem value="3.2">3.2</SelectItem>
                        <SelectItem value="3.3">3.3</SelectItem>
                        <SelectItem value="3.4">3.4</SelectItem>
                        <SelectItem value="3.5">3.5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ojs_username" className="mb-3 block">OJS Username</Label>
                      <Input
                        id="ojs_username"
                        type="text"
                        value={formData.ojs_username || ''}
                        onChange={(e) => setFormData({ ...formData, ojs_username: e.target.value || null })}
                        placeholder="Masukkan username OJS"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ojs_password" className="mb-3 block">OJS Password</Label>
                      <div className="relative">
                        <Input
                          id="ojs_password"
                          type={showOjsPassword ? 'text' : 'password'}
                          value={formData.ojs_password || ''}
                          onChange={(e) => setFormData({ ...formData, ojs_password: e.target.value || null })}
                          placeholder="Masukkan password OJS"
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOjsPassword(!showOjsPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showOjsPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="keterangan" className="mb-3 block">Keterangan</Label>
                    <Select value={formData.keterangan || 'none'} onValueChange={(value) => setFormData({ ...formData, keterangan: value === 'none' ? null : value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Keterangan" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="none">-</SelectItem>
                        {keteranganOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit">
                      {editingId ? 'Update' : 'Simpan'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Cards Grid */}
          <div className="overflow-x-auto -mx-6 px-6">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-700">
                  <TableHead className="w-8 font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">No</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Holding</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2">URL</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">CDN</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Server</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Versi OJS</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Keterangan</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                      <p className="text-sm">{instances.length === 0 ? 'Tidak ada data OJS instances' : 'Tidak ada data yang sesuai dengan filter'}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInstances.map((instance, index) => (
                    <TableRow key={instance.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <TableCell className="font-medium text-neutral-700 dark:text-neutral-300 px-1 py-1 text-xs text-center">{startIdx + index + 1}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-1 text-center">
                        <span className="inline-block w-[100px] truncate text-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" title={instance.holding}>
                          {instance.holding}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] px-1 py-1">
                        <a
                          href={instance.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-medium text-[11px]"
                          title={instance.url}
                        >
                          {instance.url}
                        </a>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-1 text-center">
                        <span className="inline-block w-[75px] truncate text-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" title={instance.letak_cdn || '-'}>
                          {instance.letak_cdn || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-1 text-center">
                        <span className="inline-block w-[90px] truncate text-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" title={instance.letak_server || '-'}>
                          {instance.letak_server || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-1 text-xs text-center">
                        {instance.versi_ojs ? (
                          <span className="inline-block w-[50px] truncate text-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" title={instance.versi_ojs}>
                            {instance.versi_ojs}
                          </span>
                        ) : (
                          <span className="pl-2">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-1 text-center">
                        {instance.keterangan ? (
                          <span className="inline-block w-[90px] truncate text-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" title={instance.keterangan}>
                            {instance.keterangan}
                          </span>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-1 py-1 text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenDialog(instance)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Yakin ingin hapus?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus OJS instance <span className="font-semibold text-neutral-800 dark:text-neutral-200">{instance.url}</span> secara permanen dari daftar.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(instance.id)} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm shadow-rose-600/20">
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Menampilkan {Math.min(startIdx + 1, filteredInstances.length)} - {Math.min(endIdx, filteredInstances.length)} dari {filteredInstances.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

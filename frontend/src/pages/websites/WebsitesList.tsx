import { useEffect, useState, useMemo } from 'react';
import { websiteAPI } from '@/services/api';
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
import { Trash2, Edit2, Plus, Search, AlertCircle, Globe } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Website {
  id: number;
  holding: string;
  jenis_website: string;
  url: string;
  letak_server: string;
  cdn_provider: string;
  pic: string;
  has_ads: boolean;
}

export default function WebsitesList() {
  const { user } = useUser();
  const isViewer = user?.role === 'viewer';
  
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedHolding, setSelectedHolding] = useState<string>('all');
  const [selectedJenisWebsite, setSelectedJenisWebsite] = useState<string>('all');
  const [selectedLetakServer, setSelectedLetakServer] = useState<string>('all');
  const [selectedCdn, setSelectedCdn] = useState<string>('all');
  const [selectedPic, setSelectedPic] = useState<string>('all');
  const [selectedAds, setSelectedAds] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Listen for user role changes
  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          JSON.parse(userStr);
          // Force re-render by updating a dummy state
          setCurrentPage(1);
        } catch (error) {
          console.error('Error parsing user:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    holding: '',
    jenis_website: '',
    url: '',
    letak_server: '',
    cdn_provider: '',
    pic: '',
    has_ads: false,
  });

  const holdingOptions = [
    'Ridwan Institute',
    'Publikasi Indonesia',
    'Green Publisher',
    'Riviera Publishing',
    'International Journal Labs',
    'Al-Makki Publisher',
    'LSP Ditekindo',
    'LSP Ebiskraf',
    'LSP MSDM',
    'SYNTAXNESIA',
    'EDC',
    'LPK MKM',
    'FOUNDATION',
    'STAIKU',
    'POLTEK SCI',
    'Intention',
  ];

  const getHoldingColor = (holding: string) => {
    // Generate consistent color based on holding name
    const colors = [
      'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
      'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
      'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400',
      'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
      'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
      'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    ];
    const index = holdingOptions.indexOf(holding);
    return index >= 0 ? colors[index] : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
  };

  const jenisWebsiteOptions = [
    'React JS',
    'Wordpress',
    'Bootstrap',
    'Mini LP',
  ];

  const getJenisColor = (jenis: string) => {
    switch (jenis) {
      case 'React JS':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Wordpress':
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400';
      case 'Bootstrap':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'Mini LP':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
    }
  };

  const letakServerOptions = [
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
    'VULTR Foundation',
    'VULTR Ditekindo',
    'Domainesia',
  ];

  const getServerColor = (server: string) => {
    if (server.startsWith('Niaga')) {
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    } else if (server.startsWith('JH')) {
      return 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400';
    } else if (server.startsWith('VULTR')) {
      return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
    } else if (server === 'Cloud Hosting') {
      return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400';
    } else if (server === 'Domainesia') {
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
    }
    return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
  };

  const picOptions = [
    'Andika Bagus Saputra',
    'Surya Lesmana',
    'Ridho Ahmad Taufik',
    'Erwin Iskandar',
  ];

  const getPicColor = (picName: string) => {
    switch (picName) {
      case 'Andika Bagus Saputra':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      case 'Surya Lesmana':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'Ridho Ahmad Taufik':
        return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400';
      case 'Erwin Iskandar':
        return 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
    }
  };

  const cdnOptions = [
    'Tidak Pakai',
    'Cloudflare 1',
    'Cloudflare 2',
    'Cloudflare 3',
    'Cloudflare 4',
    'Cloudflare 5',
    'Bunny',
  ];

  const getCdnColor = (cdnProvider: string) => {
    switch (cdnProvider) {
      case 'Cloudflare 1':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'Cloudflare 2':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Cloudflare 3':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'Cloudflare 4':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400';
      case 'Cloudflare 5':
        return 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400';
      case 'Bunny':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'Tidak Pakai':
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
    }
  };

  // Optimized filtering with useMemo
  const filteredWebsites = useMemo(() => {
    return websites.filter((website) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          website.holding.toLowerCase().includes(searchLower) ||
          website.jenis_website.toLowerCase().includes(searchLower) ||
          website.url.toLowerCase().includes(searchLower) ||
          website.letak_server.toLowerCase().includes(searchLower) ||
          website.pic.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Dropdown filters
      if (selectedHolding !== 'all' && selectedHolding && website.holding !== selectedHolding) return false;
      if (selectedJenisWebsite !== 'all' && selectedJenisWebsite && website.jenis_website !== selectedJenisWebsite) return false;
      if (selectedLetakServer !== 'all' && selectedLetakServer && website.letak_server !== selectedLetakServer) return false;
      if (selectedCdn !== 'all' && selectedCdn && website.cdn_provider !== selectedCdn) return false;
      if (selectedPic !== 'all' && selectedPic && website.pic !== selectedPic) return false;
      if (selectedAds !== 'all') {
        const hasAds = selectedAds === 'yes' ? true : false;
        if (!!website.has_ads !== hasAds) return false;
      }
      return true;
    });
  }, [websites, searchTerm, selectedHolding, selectedJenisWebsite, selectedLetakServer, selectedCdn, selectedPic, selectedAds]);

  // Optimized pagination with useMemo
  const paginatedWebsites = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredWebsites.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWebsites, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await websiteAPI.getAll();
      setWebsites(response.data);
    } catch (error: any) {
      console.error('Error fetching websites:', error);
      setError('Gagal memuat data website. Silakan coba lagi.');
      toast.error('Gagal memuat data website');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (website?: Website) => {
    if (website) {
      setEditingId(website.id);
      setFormData(website);
    } else {
      setEditingId(null);
      setFormData({
        holding: '',
        jenis_website: '',
        url: '',
        letak_server: '',
        cdn_provider: '',
        pic: '',
        has_ads: false,
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedHolding, selectedJenisWebsite, selectedLetakServer, selectedCdn, selectedPic, selectedAds, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await websiteAPI.update(editingId, formData);
        toast.success('Website berhasil diperbarui');
      } else {
        await websiteAPI.create(formData);
        toast.success('Website berhasil ditambahkan');
      }
      setOpen(false);
      fetchWebsites();
    } catch (error: any) {
      console.error('Error saving website:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan website';
      if (error.response?.data?.errors?.url) {
        toast.error('URL sudah terdaftar, gunakan URL yang berbeda');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin hapus?')) {
      try {
        await websiteAPI.delete(id);
        setWebsites(websites.filter(w => w.id !== id));
        toast.success('Website berhasil dihapus');
      } catch (error) {
        console.error('Error deleting website:', error);
        toast.error('Gagal menghapus website');
      }
    }
  };

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
              {/* Filter skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-9 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              {/* Table skeleton */}
              <div className="space-y-3">
                <div className="grid grid-cols-7 gap-4 pb-2 border-b">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-7 gap-4 py-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                      <div key={j} className="h-4 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                ))}
              </div>
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
            icon={Globe}
            title="Websites (LP)"
            subtitle="Kelola semua website LP Anda"
            iconColor="bg-blue-600"
            iconShadow="shadow-blue-200"
          />
        </div>
        
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-medium">{error}</div>
              <Button onClick={fetchWebsites} variant="outline">
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
        icon={Globe}
        title="Websites (LP)"
        subtitle="Kelola semua website LP Anda"
        iconColor="bg-blue-600"
        iconShadow="shadow-blue-200"
      >
        {!isViewer && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus size={20} />
              Tambah Website
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Website' : 'Tambah Website Baru'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="jenis_website" className="mb-3 block">Jenis Website</Label>
                <Select value={formData.jenis_website} onValueChange={(value) => setFormData({ ...formData, jenis_website: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jenis Website" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {jenisWebsiteOptions.map((option) => (
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="letak_server" className="mb-3 block">Letak Server</Label>
                <Select value={formData.letak_server} onValueChange={(value) => setFormData({ ...formData, letak_server: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Letak Server" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {letakServerOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cdn_provider" className="mb-3 block">CDN</Label>
                <Select value={formData.cdn_provider} onValueChange={(value) => setFormData({ ...formData, cdn_provider: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih CDN" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {cdnOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pic" className="mb-3 block">PIC</Label>
                <Select value={formData.pic} onValueChange={(value) => setFormData({ ...formData, pic: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih PIC" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {picOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="has_ads"
                  checked={formData.has_ads}
                  onChange={(e) => setFormData({ ...formData, has_ads: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <Label htmlFor="has_ads" className="mb-0 cursor-pointer">
                  Ads
                </Label>
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
        )}
      </PageHeader>

      <Card>
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Daftar Website
            </CardTitle>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total: {websites.length} website</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 space-y-4">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari website, holding, PIC, server..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
              />
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Holding</Label>
                <Select value={selectedHolding} onValueChange={setSelectedHolding}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">Semua Holding</SelectItem>
                    {holdingOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Jenis Website</Label>
                <Select value={selectedJenisWebsite} onValueChange={setSelectedJenisWebsite}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    {jenisWebsiteOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Letak Server</Label>
                <Select value={selectedLetakServer} onValueChange={setSelectedLetakServer}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">Semua Server</SelectItem>
                    {letakServerOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
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
                  <SelectContent>
                    <SelectItem value="all">Semua CDN</SelectItem>
                    {cdnOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">PIC</Label>
                <Select value={selectedPic} onValueChange={setSelectedPic}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua PIC</SelectItem>
                    {picOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Ads</Label>
                <Select value={selectedAds} onValueChange={setSelectedAds}>
                  <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="yes">Ads</SelectItem>
                    <SelectItem value="no">Tidak Ada Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-700">
                  <TableHead className="w-12 font-bold text-neutral-700 dark:text-neutral-300">No</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Holding</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Jenis</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">URL</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Server</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">CDN</TableHead>
                  <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">PIC</TableHead>
                  <TableHead className="w-16 font-bold text-neutral-700 dark:text-neutral-300">Ads</TableHead>
                  <TableHead className="text-right w-20 font-bold text-neutral-700 dark:text-neutral-300">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWebsites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                      <p className="text-sm">{websites.length === 0 ? 'Tidak ada data website' : 'Tidak ada data yang sesuai dengan filter'}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedWebsites.map((website, index) => {
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    return (
                      <TableRow key={website.id} className="text-sm border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <TableCell className="font-medium text-neutral-700 dark:text-neutral-300">{startIndex + index + 1}</TableCell>
                        <TableCell className="max-w-xs truncate text-neutral-600 dark:text-neutral-400">
                          <span className={`inline-block min-w-[140px] text-center px-3 py-1 rounded-full text-xs font-semibold ${getHoldingColor(website.holding)}`}>
                            {website.holding}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-neutral-600 dark:text-neutral-400">
                          <span className={`inline-block min-w-[100px] text-center px-3 py-1 rounded-full text-xs font-semibold ${getJenisColor(website.jenis_website)}`}>
                            {website.jenis_website}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-medium">
                            {website.url}
                          </a>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-neutral-600 dark:text-neutral-400">
                          <span className={`inline-block min-w-[120px] text-center px-3 py-1 rounded-full text-xs font-semibold ${getServerColor(website.letak_server)}`}>
                            {website.letak_server}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-neutral-600 dark:text-neutral-400">
                          {website.cdn_provider ? (
                            <span className={`inline-block min-w-[110px] text-center px-3 py-1 rounded-full text-xs font-semibold ${getCdnColor(website.cdn_provider)}`}>
                              {website.cdn_provider}
                            </span>
                          ) : (
                            <span className="text-neutral-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-neutral-600 dark:text-neutral-400">
                          <span className={`inline-block min-w-[160px] text-center px-3 py-1 rounded-full text-xs font-semibold ${getPicColor(website.pic)}`}>
                            {website.pic}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${website.has_ads ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                            {website.has_ads ? 'Ya' : 'Tidak'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleOpenDialog(website)}
                              disabled={isViewer}
                              title={isViewer ? "Viewers cannot edit" : "Edit"}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(website.id)}
                              disabled={isViewer}
                              title={isViewer ? "Viewers cannot delete" : "Delete"}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredWebsites.length)} - {Math.min(currentPage * itemsPerPage, filteredWebsites.length)} dari {filteredWebsites.length} data
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={`page-${page}`}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

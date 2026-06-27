import { useEffect, useState, useMemo } from 'react';
import { gamblingAPI, websiteAPI } from '@/services/api';
import { useUser } from '@/context/UserContext';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, RefreshCw, AlertTriangle, CheckCircle, Eye, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Website {
  id: number;
  url: string;
  holding: string;
  jenis_website?: string;
}

interface GamblingScan {
  id: number;
  website_id: number;
  status: 'safe' | 'review' | 'suspicious' | 'detected';
  keywords_found: string[];
  keyword_count: number;
  confidence_score: number;
  scan_details: Array<{
    keyword: string;
    occurrences: number;
    weight: number;
    category: string;
  }>;
  scanned_at: string;
  website?: Website;
}

interface GamblingStats {
  total: number;
  safe: number;
  review: number;
  suspicious: number;
  detected: number;
}

export default function GamblingMonitor() {
  const { user } = useUser();
  const isViewer = user?.role === 'viewer';
  
  const [websites, setWebsites] = useState<Website[]>([]);
  const [scans, setScans] = useState<{ [key: number]: GamblingScan }>({});
  const [stats, setStats] = useState<GamblingStats | null>(null);
  const [scanningIds, setScanningIds] = useState<Set<number>>(new Set());
  const [selectedScan, setSelectedScan] = useState<GamblingScan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [holdingFilter, setHoldingFilter] = useState<string>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWebsites, setSelectedWebsites] = useState<Set<number>>(new Set());
  const [isBulkScanning, setIsBulkScanning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

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

  useEffect(() => {
    fetchWebsites();
    fetchAllScans();
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAllScans();
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchWebsites = async () => {
    try {
      const response = await websiteAPI.getAll();
      setWebsites(response.data);
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast.error('Gagal memuat data website');
    }
  };

  const fetchAllScans = async () => {
    try {
      const response = await gamblingAPI.getAllScans();
      const scansMap: { [key: number]: GamblingScan } = {};
      response.data.forEach((scan: GamblingScan) => {
        scansMap[scan.website_id] = scan;
      });
      setScans(scansMap);
    } catch (error) {
      console.error('Error fetching scans:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await gamblingAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchAllScans(), fetchStats()]);
      toast.success('Data berhasil di-refresh!');
    } catch (error) {
      toast.error('Gagal refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const scanWebsite = async (websiteId: number) => {
    setScanningIds(prev => new Set(prev).add(websiteId));
    try {
      const response = await gamblingAPI.scan(websiteId);
      if (response.data.scan) {
        toast.success('Scan berhasil!');
        // Update scans immediately with new data
        setScans(prev => ({
          ...prev,
          [websiteId]: response.data.scan
        }));
        fetchStats();
      } else {
        toast.error(response.data.message || 'Gagal melakukan scan');
      }
    } catch (error: any) {
      console.error('Error scanning website:', error);
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Gagal melakukan scan');
    } finally {
      setScanningIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(websiteId);
        return newSet;
      });
    }
  };

  const bulkScanWebsites = async () => {
    if (selectedWebsites.size === 0) {
      toast.error('Pilih minimal 1 website untuk di-scan');
      return;
    }

    // Limit to 10 websites at once to avoid timeout
    if (selectedWebsites.size > 10) {
      toast.error('Maksimal 10 website per bulk scan. Silakan pilih lebih sedikit website.');
      return;
    }

    setIsBulkScanning(true);
    const websiteIds = Array.from(selectedWebsites);
    
    try {
      toast.loading(`Scanning ${websiteIds.length} websites...`, { id: 'bulk-scan' });
      
      const response = await gamblingAPI.bulkScan(websiteIds);
      
      // Update scans with results
      const newScans = { ...scans };
      response.data.results.forEach((result: any) => {
        if (result.success && result.scan) {
          newScans[result.website_id] = result.scan;
        }
      });
      setScans(newScans);
      
      // Refresh stats
      fetchStats();
      
      // Clear selection
      setSelectedWebsites(new Set());
      
      toast.success(
        `Bulk scan selesai: ${response.data.success_count} berhasil, ${response.data.fail_count} gagal`,
        { id: 'bulk-scan' }
      );
    } catch (error: any) {
      console.error('Error bulk scanning:', error);
      toast.error('Gagal melakukan bulk scan. Coba dengan lebih sedikit website.', { id: 'bulk-scan' });
    } finally {
      setIsBulkScanning(false);
    }
  };

  const toggleSelectWebsite = (websiteId: number) => {
    setSelectedWebsites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(websiteId)) {
        newSet.delete(websiteId);
      } else {
        newSet.add(websiteId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      safe: { label: '✅ AMAN', class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
      review: { label: '🟡 PERLU REVIEW', class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
      suspicious: { label: '⚠️ TERINDIKASI', class: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
      detected: { label: '🚨 TERDETEKSI', class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
    };
    const badge = badges[status as keyof typeof badges] || { label: '❓ UNKNOWN', class: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>{badge.label}</span>;
  };

  const getHoldingColor = (holding: string) => {
    const holdingColors: Record<string, string> = {
      'Ridwan Institute': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
      'Publikasi Indonesia': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      'Green Publisher': 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
      'Riviera Publishing': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
      'International Journal Labs': 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400',
      'Al-Makki Publisher': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
      'LSP Ditekindo': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      'LSP Ebiskraf': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      'LSP MSDM': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
      'SYNTAXNESIA': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
      'EDC': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
      'LPK MKM': 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
      'FOUNDATION': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      'STAIKU': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'POLTEK SCI': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    };
    return holdingColors[holding] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredWebsites = useMemo(() => {
    let result = websites;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(website =>
        website.url.toLowerCase().includes(searchLower) ||
        website.holding.toLowerCase().includes(searchLower)
      );
    }

    // Holding filter
    if (holdingFilter !== 'all') {
      result = result.filter(website => website.holding === holdingFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(website => {
        const scan = scans[website.id];
        return scan && scan.status === statusFilter;
      });
    }

    // Confidence filter
    if (confidenceFilter !== 'all') {
      result = result.filter(website => {
        const scan = scans[website.id];
        if (!scan) return false;
        
        const score = scan.confidence_score;
        if (confidenceFilter === 'high') return score >= 75;
        if (confidenceFilter === 'medium') return score >= 50 && score < 75;
        if (confidenceFilter === 'low') return score >= 25 && score < 50;
        if (confidenceFilter === 'very_low') return score < 25;
        return true;
      });
    }

    return result;
  }, [websites, searchTerm, statusFilter, holdingFilter, confidenceFilter, scans]);

  // Get unique holdings for filter
  const holdings = useMemo(() => {
    const uniqueHoldings = [...new Set(websites.map(w => w.holding))];
    return uniqueHoldings.sort();
  }, [websites]);

  const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedWebsites = filteredWebsites.slice(startIdx, endIdx);

  // Checkbox handlers (must be after paginatedWebsites is defined)
  const toggleSelectAll = () => {
    if (selectedWebsites.size === paginatedWebsites.length) {
      setSelectedWebsites(new Set());
    } else {
      setSelectedWebsites(new Set(paginatedWebsites.map(w => w.id)));
    }
  };

  const isAllSelected = paginatedWebsites.length > 0 && selectedWebsites.size === paginatedWebsites.length;

  return (
    <>
      <PageHeader
        icon={Shield}
        title="Gambling Detection"
        subtitle="Deteksi konten judi pada website Anda"
        iconColor="bg-blue-600"
        iconShadow="shadow-blue-200"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-white/80 mt-1">Total Scans</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.safe}</div>
                <p className="text-xs text-white/80 mt-1">✅ Aman</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.review}</div>
                <p className="text-xs text-white/80 mt-1">🟡 Perlu Review</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.suspicious}</div>
                <p className="text-xs text-white/80 mt-1">⚠️ Terindikasi</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.detected}</div>
                <p className="text-xs text-white/80 mt-1">🚨 Terdeteksi</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Websites Table */}
        <Card>
          <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Daftar Website
              </CardTitle>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total: {websites.length} website</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Search & Filter */}
            <div className="mb-6 space-y-4">
              {/* Bulk Scan Button */}
              {selectedWebsites.size > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {selectedWebsites.size} website dipilih {selectedWebsites.size > 10 && <span className="text-red-600">(Maks. 10)</span>}
                  </span>
                  <Button
                    onClick={bulkScanWebsites}
                    disabled={isBulkScanning || selectedWebsites.size > 10 || isViewer}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  >
                    {isBulkScanning ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Shield size={16} className="mr-2" />
                        Scan {selectedWebsites.size} Website
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari website, holding..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
                />
              </div>

              {/* Dropdown Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Holding</Label>
                  <Select value={holdingFilter} onValueChange={setHoldingFilter}>
                    <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                      <SelectValue />
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
                  <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Confidence Score</Label>
                  <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                    <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Score</SelectItem>
                      <SelectItem value="high">Tinggi (≥75%)</SelectItem>
                      <SelectItem value="medium">Sedang (50-74%)</SelectItem>
                      <SelectItem value="low">Rendah (25-49%)</SelectItem>
                      <SelectItem value="very_low">Sangat Rendah (&lt;25%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-full"
                    onClick={() => {
                      setSearchTerm('');
                      setHoldingFilter('all');
                      setStatusFilter('all');
                      setConfidenceFilter('all');
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className="text-xs"
                >
                  Semua
                </Button>
                <Button
                  variant={statusFilter === 'safe' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('safe')}
                  className={`text-xs ${statusFilter === 'safe' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                >
                  ✅ Aman
                </Button>
                <Button
                  variant={statusFilter === 'review' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('review')}
                  className={`text-xs ${statusFilter === 'review' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}`}
                >
                  🟡 Perlu Review
                </Button>
                <Button
                  variant={statusFilter === 'suspicious' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('suspicious')}
                  className={`text-xs ${statusFilter === 'suspicious' ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}`}
                >
                  ⚠️ Terindikasi
                </Button>
                <Button
                  variant={statusFilter === 'detected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('detected')}
                  className={`text-xs ${statusFilter === 'detected' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                >
                  🚨 Terdeteksi
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="w-12 font-bold text-neutral-700 dark:text-neutral-300">No</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">URL</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Holding</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Status</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Keywords</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Confidence</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Terakhir Scan</TableHead>
                    <TableHead className="text-right w-24 font-bold text-neutral-700 dark:text-neutral-300">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWebsites.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                        <p className="text-sm">{searchTerm || statusFilter !== 'all' ? 'Tidak ada website yang sesuai dengan filter' : 'Tidak ada data website'}</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedWebsites.map((website, index) => {
                      const scan = scans[website.id];
                      return (
                        <TableRow key={website.id} className="text-sm border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                          <TableCell>
                            <Checkbox
                              checked={selectedWebsites.has(website.id)}
                              onCheckedChange={() => toggleSelectWebsite(website.id)}
                              aria-label={`Select ${website.url}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium text-neutral-700 dark:text-neutral-300">{startIdx + index + 1}</TableCell>
                          <TableCell className="max-w-xs">
                            <a
                              href={website.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-medium"
                            >
                              {website.url}
                            </a>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-neutral-600 dark:text-neutral-400">
                            <span className={`inline-block min-w-[140px] text-center px-3 py-1 rounded-full text-xs font-semibold ${getHoldingColor(website.holding)}`}>
                              {website.holding}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {scan ? getStatusBadge(scan.status) : <span className="text-neutral-400 text-xs">Belum scan</span>}
                          </TableCell>
                          <TableCell className="text-center">
                            {scan ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                {scan.keyword_count}
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {scan ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                {scan.confidence_score}%
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-xs text-neutral-600 dark:text-neutral-400">
                            {scan ? (
                              <span>{formatDate(scan.scanned_at)}</span>
                            ) : (
                              <span className="text-neutral-400">Belum scan</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              {scan && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setSelectedScan(scan)}
                                  title="Lihat Detail"
                                >
                                  <Eye size={14} />
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => scanWebsite(website.id)}
                                disabled={scanningIds.has(website.id) || isViewer}
                                title={isViewer ? "Viewers cannot run scans" : "Scan Website"}
                              >
                                {scanningIds.has(website.id) ? (
                                  <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                  <RefreshCw size={14} />
                                )}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {Math.min(startIdx + 1, filteredWebsites.length)} - {Math.min(endIdx, filteredWebsites.length)} dari {filteredWebsites.length} data
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Sebelumnya
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="h-9 w-9 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedScan} onOpenChange={() => setSelectedScan(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-blue-600" />
              Detail Scan Gambling
            </DialogTitle>
          </DialogHeader>
          {selectedScan && (
            <div className="space-y-6 pt-2">
              {/* Website Info */}
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
                <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Website</h3>
                <a 
                  href={selectedScan.website?.url || websites.find(w => w.id === selectedScan.website_id)?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium break-all"
                >
                  {selectedScan.website?.url || websites.find(w => w.id === selectedScan.website_id)?.url || 'URL tidak tersedia'}
                </a>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-2">Status</h3>
                  <div className="mt-2">
                    {getStatusBadge(selectedScan.status)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-2">Keywords Found</h3>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{selectedScan.keyword_count}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h3 className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-2">Confidence Score</h3>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{selectedScan.confidence_score}%</p>
                </div>
              </div>

              {/* Keywords List */}
              {selectedScan.scan_details && selectedScan.scan_details.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-500 rounded"></span>
                    Keywords Detected
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {selectedScan.scan_details.map((detail, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">{detail.keyword}</span>
                            <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-2 py-0.5 rounded">
                              {detail.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded-full">
                            {detail.occurrences}x ditemukan
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            Bobot: {detail.weight}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scan Time */}
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border-t-2 border-blue-500">
                <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Scanned At</h3>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{formatDate(selectedScan.scanned_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

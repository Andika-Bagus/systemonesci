import { useEffect, useState, useMemo } from 'react';
import { domainAPI } from '@/services/api';
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
import { toast } from 'sonner';
import { RefreshCw, Calendar, AlertCircle, CheckCircle, Clock, Search, ChevronLeft, ChevronRight, Globe, Server } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Website {
  id: number;
  url: string;
  holding: string;
  type: string; // Changed from jenis_website to type (can be "WordPress", "Landing Page", or "OJS 3.x.x")
  source?: string; // Added to differentiate 'website' vs 'ojs_instance'
  domain_registered_at: string | null;
  domain_expires_at: string | null;
  domain_registrar: string | null;
  domain_last_checked: string | null;
  domain_status: 'active' | 'expiring_soon' | 'expired' | 'unknown';
  days_until_expiry: number | null;
}

interface DomainStats {
  total: number;
  active: number;
  expiring_soon: number;
  expired: number;
  unknown: number;
}

export default function DomainMonitor() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [stats, setStats] = useState<DomainStats | null>(null);
  const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>('all');

  // Listen for user role changes
  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          JSON.parse(userStr);
          // Force re-render by updating a dummy state
          // This will trigger re-check of user role
        } catch (error) {
          console.error('Error parsing user:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Color functions for badges
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

  const getRegistrarColor = (registrar: string | null) => {
    if (!registrar) return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
    
    if (registrar.includes('HOSTINGER')) {
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
    } else if (registrar.includes('Digital Registra Indonesia') || registrar.includes('PT Digital')) {
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    } else if (registrar.includes('Web Commerce') || registrar.includes('PT Web')) {
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    } else if (registrar.includes('GoDaddy')) {
      return 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400';
    } else if (registrar.includes('Namecheap')) {
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
    } else if (registrar.includes('Cloudflare')) {
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    }
    return 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400';
  };

  const getDateColor = (dateString: string | null, isExpiry: boolean = false) => {
    if (!dateString) return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
    
    if (isExpiry) {
      const date = new Date(dateString);
      const now = new Date();
      const daysUntil = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil < 0) {
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      } else if (daysUntil <= 7) {
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      } else if (daysUntil <= 30) {
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      } else if (daysUntil <= 90) {
        return 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400';
      } else {
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      }
    } else {
      // For registered date - older domains get different colors
      const date = new Date(dateString);
      const now = new Date();
      const yearsOld = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);
      
      if (yearsOld >= 5) {
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      } else if (yearsOld >= 3) {
        return 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400';
      } else if (yearsOld >= 2) {
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      } else if (yearsOld >= 1) {
        return 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400';
      } else {
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400';
      }
    }
  };

  const getDaysLeftColor = (days: number | null) => {
    if (days === null) return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
    
    if (days < 0) {
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    } else if (days <= 7) {
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
    } else if (days <= 30) {
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    } else if (days <= 90) {
      return 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400';
    } else {
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [holdingFilter, setHoldingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('expiry_asc'); // expiry_asc, expiry_desc, registered_asc, registered_desc
  const [currentPage, setCurrentPage] = useState(1);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDomains();
    fetchStats();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await domainAPI.getAll();
      setWebsites(response.data);
      return response.data;
    } catch (error) {
      toast.error('Gagal memuat data domain');
      return [];
    }
  };

  const fetchStats = async () => {
    try {
      const response = await domainAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const checkDomain = async (websiteId: number, source?: string) => {
    const checkKey = source ? `${source}-${websiteId}` : String(websiteId);
    setCheckingIds(prev => new Set(prev).add(checkKey));
    try {
      const response = await domainAPI.check(websiteId, source);
      
      // Update the specific item in state with the fresh data from the response
      if (response.data) {
        setWebsites(prev => {
          return prev.map(w => {
            // Match by id and source
            if (w.id === websiteId && w.source === (source || 'website')) {
              // Merge the response data into the existing item
              return {
                ...w,
                ...response.data,
                // Ensure these critical fields are present
                domain_registered_at: response.data.domain_registered_at,
                domain_expires_at: response.data.domain_expires_at,
                domain_registrar: response.data.domain_registrar,
                domain_last_checked: response.data.domain_last_checked,
                domain_status: response.data.domain_status,
                days_until_expiry: response.data.days_until_expiry,
              };
            }
            return w;
          });
        });
      }
      
      // Refresh stats
      await fetchStats();
      
      toast.success('Domain info berhasil diperbarui');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Gagal mengecek domain');
    } finally {
      setCheckingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(checkKey);
        return newSet;
      });
    }
  };

  const checkAllDomains = async () => {
    setIsCheckingAll(true);
    try {
      const allKeys = websites.map(w => w.source ? `${w.source}-${w.id}` : String(w.id));
      setCheckingIds(new Set(allKeys));
      
      // Check all domains in parallel (bersamaan)
      await Promise.all(
        websites.map(w =>
          domainAPI.check(w.id, w.source).catch(error => {
            console.error(`Error checking domain ${w.id}:`, error);
          })
        )
      );
      
      toast.success('Semua domain berhasil dicek');
      fetchDomains();
      fetchStats();
    } catch (error: any) {
      console.error('Error checking all domains:', error);
      toast.error('Gagal mengecek semua domain');
    } finally {
      setCheckingIds(new Set());
      setIsCheckingAll(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'expired') {
      return <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">Expired</span>;
    }
    if (status === 'expiring_soon') {
      return <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">Soon</span>;
    }
    if (status === 'active') {
      return <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Active</span>;
    }
    return <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">Unknown</span>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to extract base domain (without path)
  const extractBaseDomain = (url: string): string => {
    try {
      // Remove protocol if exists
      let domain = url.replace(/^https?:\/\//, '');
      // Remove www. if exists
      domain = domain.replace(/^www\./, '');
      // Remove path (everything after first /)
      domain = domain.split('/')[0];
      // Remove port if exists
      domain = domain.split(':')[0];
      return domain.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  };

  const filteredWebsites = useMemo(() => {
    let result = websites;

    // Tab filter (all, websites, ojs)
    if (activeTab === 'websites') {
      result = result.filter(w => w.source === 'website');
    } else if (activeTab === 'ojs') {
      result = result.filter(w => w.source === 'ojs_instance');
    }
    // activeTab === 'all' shows everything

    // Remove duplicates based on base domain
    const seenDomains = new Map<string, Website>();
    result = result.filter(website => {
      const baseDomain = extractBaseDomain(website.url);
      if (!seenDomains.has(baseDomain)) {
        seenDomains.set(baseDomain, website);
        return true;
      }
      // Keep the one with more complete domain info
      const existing = seenDomains.get(baseDomain)!;
      if (website.domain_expires_at && !existing.domain_expires_at) {
        seenDomains.set(baseDomain, website);
        return true;
      }
      return false;
    });
    result = Array.from(seenDomains.values());

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(website =>
        website.url.toLowerCase().includes(searchLower) ||
        website.holding.toLowerCase().includes(searchLower) ||
        website.domain_registrar?.toLowerCase().includes(searchLower)
      );
    }

    // Holding filter
    if (holdingFilter !== 'all') {
      result = result.filter(website => website.holding === holdingFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(website => website.domain_status === statusFilter);
    }

    // Sorting
    result = result.sort((a, b) => {
      if (sortBy === 'expiry_asc') {
        // Sort by expiry date ascending (paling cepat habis di atas)
        if (a.days_until_expiry === null && b.days_until_expiry === null) return 0;
        if (a.days_until_expiry === null) return 1;
        if (b.days_until_expiry === null) return -1;
        return a.days_until_expiry - b.days_until_expiry;
      } else if (sortBy === 'expiry_desc') {
        // Sort by expiry date descending (paling lama habis di atas)
        if (a.days_until_expiry === null && b.days_until_expiry === null) return 0;
        if (a.days_until_expiry === null) return 1;
        if (b.days_until_expiry === null) return -1;
        return b.days_until_expiry - a.days_until_expiry;
      } else if (sortBy === 'registered_asc') {
        // Sort by registered date ascending (paling lama registrasi di atas / oldest first)
        if (!a.domain_registered_at && !b.domain_registered_at) return 0;
        if (!a.domain_registered_at) return 1;
        if (!b.domain_registered_at) return -1;
        return new Date(a.domain_registered_at).getTime() - new Date(b.domain_registered_at).getTime();
      } else if (sortBy === 'registered_desc') {
        // Sort by registered date descending (paling baru registrasi di atas / newest first)
        if (!a.domain_registered_at && !b.domain_registered_at) return 0;
        if (!a.domain_registered_at) return 1;
        if (!b.domain_registered_at) return -1;
        return new Date(b.domain_registered_at).getTime() - new Date(a.domain_registered_at).getTime();
      }
      return 0;
    });

    return result;
  }, [websites, searchTerm, holdingFilter, statusFilter, sortBy, activeTab]); // Removed refreshTrigger

  // Get unique holdings for filter
  const holdings = useMemo(() => {
    const uniqueHoldings = [...new Set(websites.map(w => w.holding))];
    return uniqueHoldings.sort();
  }, [websites]);

  const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedWebsites = filteredWebsites.slice(startIdx, endIdx);

  return (
    <>
      <PageHeader
        icon={Calendar}
        title="Domain Monitor"
        subtitle="Monitoring status dan ekspirasi domain"
        iconColor="bg-violet-600"
        iconShadow="shadow-violet-200"
      />

      <div className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-white/80 mt-1">Total Domains</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-white/80 mt-1">Active</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.expiring_soon}</div>
                <p className="text-xs text-white/80 mt-1">Expiring Soon</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.expired}</div>
                <p className="text-xs text-white/80 mt-1">Expired</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="h-5 w-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">{stats.unknown}</div>
                <p className="text-xs text-white/80 mt-1">Unknown</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Domains Table with Tabs */}
        <Card>
          <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Daftar Domain
              </CardTitle>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Total: {websites.length} domain ({websites.filter(w => w.source === 'website').length} websites, {websites.filter(w => w.source === 'ojs_instance').length} OJS)
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Tab Navigation - Manual */}
            <div className="mb-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex gap-2 -mb-px">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'all'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Semua ({websites.length})
                </button>
                <button
                  onClick={() => setActiveTab('websites')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'websites'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Websites ({websites.filter(w => w.source === 'website').length})
                </button>
                <button
                  onClick={() => setActiveTab('ojs')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'ojs'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <Server className="w-4 h-4" />
                  OJS Instances ({websites.filter(w => w.source === 'ojs_instance').length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {/* Search & Filter */}
              <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari domain, holding, registrar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                  <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Urutkan</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expiry_asc">Expiry: Paling Cepat</SelectItem>
                      <SelectItem value="expiry_desc">Expiry: Paling Lama</SelectItem>
                      <SelectItem value="registered_asc">Registrasi: Paling Lama</SelectItem>
                      <SelectItem value="registered_desc">Registrasi: Paling Baru</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 lg:col-span-2 flex items-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 flex-1"
                    onClick={() => {
                      setSearchTerm('');
                      setHoldingFilter('all');
                      setStatusFilter('all');
                      setSortBy('expiry_asc');
                    }}
                  >
                    Reset Filter
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={checkAllDomains}
                    disabled={isCheckingAll || websites.length === 0}
                  >
                    {isCheckingAll ? (
                      <>
                        <RefreshCw size={14} className="animate-spin mr-2" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} className="mr-2" />
                        Check All
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <TableHead className="w-10 font-bold text-neutral-700 dark:text-neutral-300 text-xs px-2">No</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-xs px-2 max-w-[200px]">URL</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-xs px-2">Holding</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-xs px-2">Registrar</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-xs px-2">Registered</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-xs px-2">Expires</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-center text-xs px-2">Days</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-center text-xs px-2">Status</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-right w-14 text-xs px-2">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWebsites.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                        <p className="text-sm">{searchTerm || holdingFilter !== 'all' || statusFilter !== 'all' ? 'Tidak ada data yang sesuai dengan filter' : 'Tidak ada data domain'}</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedWebsites.map((website, index) => (
                      <TableRow key={website.id} className="text-sm border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <TableCell className="font-medium text-neutral-700 dark:text-neutral-300 px-2 text-xs">{startIdx + index + 1}</TableCell>
                        <TableCell className="max-w-[200px] px-2">
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-medium text-xs"
                            title={website.url}
                          >
                            {website.url}
                          </a>
                        </TableCell>
                        <TableCell className="truncate text-neutral-600 dark:text-neutral-400 px-2">
                          <span className={`inline-block w-[160px] text-center px-2 py-1 rounded-full text-[10px] font-semibold truncate ${getHoldingColor(website.holding)}`}>
                            {website.holding}
                          </span>
                        </TableCell>
                        <TableCell className="truncate text-neutral-600 dark:text-neutral-400 px-2">
                          {website.domain_registrar ? (
                            <span className={`inline-block w-[180px] text-center px-2 py-1 rounded-full text-[10px] font-semibold truncate ${getRegistrarColor(website.domain_registrar)}`} title={website.domain_registrar}>
                              {website.domain_registrar}
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-neutral-600 dark:text-neutral-400 px-2">
                          {website.domain_registered_at ? (
                            <span className={`inline-block min-w-[80px] text-center px-2 py-1 rounded-full text-[10px] font-semibold ${getDateColor(website.domain_registered_at, false)}`}>
                              {formatDate(website.domain_registered_at)}
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-neutral-600 dark:text-neutral-400 px-2">
                          {website.domain_expires_at ? (
                            <span className={`inline-block min-w-[80px] text-center px-2 py-1 rounded-full text-[10px] font-semibold ${getDateColor(website.domain_expires_at, true)}`}>
                              {formatDate(website.domain_expires_at)}
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center px-2">
                          {website.days_until_expiry !== null ? (
                            <span className={`inline-block min-w-[65px] text-center px-2 py-1 rounded-full text-[10px] font-semibold ${getDaysLeftColor(website.days_until_expiry)}`}>
                              {website.days_until_expiry}
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center px-2">
                          {getStatusBadge(website.domain_status)}
                        </TableCell>
                        <TableCell className="text-right px-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => checkDomain(website.id, website.source)}
                            disabled={checkingIds.has(website.source ? `${website.source}-${website.id}` : String(website.id))}
                            title="Check Domain"
                          >
                            {checkingIds.has(website.source ? `${website.source}-${website.id}` : String(website.id)) ? (
                              <RefreshCw size={13} className="animate-spin" />
                            ) : (
                              <RefreshCw size={13} />
                            )}
                          </Button>
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
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(page)}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import { useEffect, useState, useMemo } from 'react';
import { pageSpeedAPI } from '@/services/api';
import PageHeader from "@/components/PageHeader";
import PageSpeedPerformanceReport from "./components/PageSpeedPerformanceReport";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Zap, RefreshCw, AlertCircle, CheckCircle2, XCircle, Search,
  Monitor, Smartphone, Globe, ShieldCheck, ShieldAlert, HelpCircle
} from "lucide-react";
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface WebsiteInfo {
  id: number;
  url: string;
  holding: string;
  jenis_website: string;
  has_ads: boolean;
  pic?: string;
}

interface PageSpeedRecord {
  id: number;
  website_id: number;
  desktop_performance_score: number | null;
  desktop_accessibility_score: number | null;
  desktop_best_practices_score: number | null;
  desktop_seo_score: number | null;
  desktop_lcp: number | null;
  desktop_fid: number | null;
  desktop_cls: number | null;
  mobile_performance_score: number | null;
  mobile_accessibility_score: number | null;
  mobile_best_practices_score: number | null;
  mobile_seo_score: number | null;
  mobile_lcp: number | null;
  mobile_fid: number | null;
  mobile_cls: number | null;
  checked_at: string;
  website?: WebsiteInfo;
}

// ─────────────────────────────────────────────
// Constants & Helpers
// ─────────────────────────────────────────────
const LCP_THRESHOLD = 4;
const ITEMS_PER_PAGE = 10;

type LcpStatus = 'memenuhi' | 'harus-diperbaiki' | 'no-data';

const getLcpStatus = (lcp: number | null): LcpStatus => {
  if (lcp === null || lcp === undefined) return 'no-data';
  const num = Number(lcp);
  if (isNaN(num)) return 'no-data';
  return num < LCP_THRESHOLD ? 'memenuhi' : 'harus-diperbaiki';
};

const formatLcp = (lcp: number | null) => {
  if (lcp === null || lcp === undefined) return '-';
  const num = Number(lcp);
  if (isNaN(num)) return '-';
  return `${num.toFixed(2)} s`;
};

const holdingOptions = [
  'Ridwan Institute', 'Publikasi Indonesia', 'Green Publisher',
  'Riviera Publishing', 'International Journal Labs', 'Al-Makki Publisher',
  'LSP Ditekindo', 'LSP Ebiskraf', 'LSP MSDM', 'SYNTAXNESIA',
  'EDC', 'LPK MKM', 'FOUNDATION', 'STAIKU', 'POLTEK SCI', 'Intention',
];


const avgLcp = (recs: PageSpeedRecord[], type: 'desktop' | 'mobile') => {
  const vals = recs
    .map(r => Number(type === 'desktop' ? r.desktop_lcp : r.mobile_lcp))
    .filter(v => !isNaN(v) && v > 0);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
const LcpCell = ({ lcp }: { lcp: number | null }) => {
  const status = getLcpStatus(lcp);
  
  if (status === 'memenuhi') {
    return (
      <span className="inline-block w-20 text-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 shadow-sm shadow-emerald-100 dark:shadow-emerald-900/20 transition-all duration-300 hover:shadow-md hover:shadow-emerald-200/50 dark:hover:shadow-emerald-800/30 hover:-translate-y-0.5">
        {formatLcp(lcp)}
      </span>
    );
  }
  if (status === 'harus-diperbaiki') {
    return (
      <span className="inline-block w-20 text-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50 shadow-sm shadow-rose-100 dark:shadow-rose-900/20 transition-all duration-300 hover:shadow-md hover:shadow-rose-200/50 dark:hover:shadow-rose-800/30 hover:-translate-y-0.5">
        {formatLcp(lcp)}
      </span>
    );
  }
  
  return <span className="inline-block w-20 text-center text-neutral-400 dark:text-neutral-500">-</span>;
};

const KeteranganBadge = ({ status }: { status: LcpStatus }) => {
  if (status === 'memenuhi') return (
    <span className="inline-flex items-center justify-center gap-1.5 w-[160px] px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-emerald-100 dark:hover:bg-emerald-950/70">
      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />Memenuhi Standar
    </span>
  );
  if (status === 'harus-diperbaiki') return (
    <span className="inline-flex items-center justify-center gap-1.5 w-[160px] px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-rose-100 dark:hover:bg-rose-950/70">
      <XCircle className="w-3.5 h-3.5 shrink-0" />Harus Diperbaiki
    </span>
  );
  return (
    <span className="inline-flex items-center justify-center gap-1.5 w-[160px] px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-50 text-neutral-500 dark:bg-neutral-800/80 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm transition-all duration-300">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />Belum Dicek
    </span>
  );
};

// Stat cards per tab (Klasifikasi LCP style)
interface TabStatsProps { records: PageSpeedRecord[] }

const TabStats = ({ records }: TabStatsProps) => {
  const total = records.length;
  const memenuhi = records.filter(r => getLcpStatus(r.mobile_lcp !== null ? r.mobile_lcp : r.desktop_lcp) === 'memenuhi').length;
  const harus = records.filter(r => getLcpStatus(r.mobile_lcp !== null ? r.mobile_lcp : r.desktop_lcp) === 'harus-diperbaiki').length;
  const noData = records.filter(r => getLcpStatus(r.mobile_lcp !== null ? r.mobile_lcp : r.desktop_lcp) === 'no-data').length;
  const avgDesk = avgLcp(records, 'desktop');
  const avgMob  = avgLcp(records, 'mobile');

  return (
    <div className="mt-6 space-y-6">
      {/* Klasifikasi cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl smooth-hover bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 animate-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="absolute -top-5 -right-5 w-24 h-24 bg-white/10 rounded-full animate-float" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.07] rounded-full animate-float" style={{ animationDelay: '3s' }} />
          <div className="relative z-10 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-4xl font-black tracking-tight">{memenuhi}</div>
            </div>
            <div className="text-emerald-100 text-sm font-medium">Memenuhi Standar (&lt;4s)</div>
            {total > 0 && <div className="text-emerald-200/80 text-[11px] mt-1 font-semibold">{Math.round((memenuhi / total) * 100)}% dari total</div>}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl smooth-hover bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700 animate-slide-up" style={{ animationDelay: '80ms' }}>
          <div className="absolute -top-5 -right-5 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.07] rounded-full animate-float" style={{ animationDelay: '4s' }} />
          <div className="relative z-10 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-4xl font-black tracking-tight">{harus}</div>
            </div>
            <div className="text-rose-100 text-sm font-medium">Perlu Perbaikan (≥4s)</div>
            {total > 0 && <div className="text-rose-200/80 text-[11px] mt-1 font-semibold">{Math.round((harus / total) * 100)}% dari total</div>}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl smooth-hover bg-gradient-to-br from-slate-500 via-slate-600 to-zinc-700 animate-slide-up" style={{ animationDelay: '160ms' }}>
          <div className="absolute -top-5 -right-5 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.07] rounded-full animate-float" style={{ animationDelay: '5s' }} />
          <div className="relative z-10 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-4xl font-black tracking-tight">{noData}</div>
            </div>
            <div className="text-slate-100 text-sm font-medium">Belum Ada Data</div>
          </div>
        </div>
      </div>

      {/* Rata-rata LCP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rata-rata LCP Desktop</p>
              <p className="text-2xl font-bold">{avgDesk !== null ? `${avgDesk.toFixed(2)}s` : '-'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rata-rata LCP Mobile</p>
              <p className="text-2xl font-bold">{avgMob !== null ? `${avgMob.toFixed(2)}s` : '-'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Top summary card (total keseluruhan)
interface StatCardProps { gradient: string; icon: React.ReactNode; value: number; label: string; sub?: string; delay?: number }
const StatCard = ({ gradient, icon, value, label, sub, delay = 0 }: StatCardProps) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl smooth-hover bg-gradient-to-br ${gradient} animate-slide-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute -top-5 -right-5 w-24 h-24 bg-white/10 rounded-full animate-float" />
    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.07] rounded-full animate-float" style={{ animationDelay: '3s' }} />
    <div className="relative z-10 flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
          {icon}
        </div>
        <div className="text-4xl font-black tracking-tight">{value}</div>
      </div>
      <div className="text-white/90 text-sm font-medium">{label}</div>
      {sub && <div className="text-white/70 text-[11px] mt-1 font-semibold">{sub}</div>}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Table per tab
// ─────────────────────────────────────────────
interface TabTableProps {
  records: PageSpeedRecord[];
  picOptions: string[];
}

const TabTable = ({ records, picOptions }: TabTableProps) => {
  const [searchTerm, setSearchTerm]   = useState('');
  const [holdingFilter, setHoldingFilter] = useState('all');
  const [picFilter, setPicFilter]     = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jenisFilter, setJenisFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, holdingFilter, picFilter, statusFilter, jenisFilter]);

  const filtered = useMemo(() => records.filter(r => {
    const holding = r.website?.holding || '';
    const pic     = r.website?.pic || '';
    const url     = r.website?.url || '';
    const jenis   = r.website?.jenis_website || '';
    const lcp     = r.mobile_lcp !== null ? r.mobile_lcp : r.desktop_lcp;
    const status  = getLcpStatus(lcp);

    if (holdingFilter !== 'all' && holding !== holdingFilter) return false;
    if (picFilter !== 'all' && pic !== picFilter) return false;
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (jenisFilter !== 'all' && jenis !== jenisFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!url.toLowerCase().includes(q) && !holding.toLowerCase().includes(q) && !pic.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [records, holdingFilter, picFilter, statusFilter, jenisFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = useMemo(() => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filtered, currentPage]);

  return (
    <div className="mt-6 space-y-6">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari website, holding, PIC..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <Label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Holding</Label>
            <Select value={holdingFilter} onValueChange={setHoldingFilter}>
              <SelectTrigger className="w-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Holding</SelectItem>
                {holdingOptions.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Jenis Website</Label>
            <Select value={jenisFilter} onValueChange={setJenisFilter}>
              <SelectTrigger className="w-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="React JS">React JS</SelectItem>
                <SelectItem value="Wordpress">Wordpress</SelectItem>
                <SelectItem value="Bootstrap">Bootstrap</SelectItem>
                <SelectItem value="Mini LP">Mini LP</SelectItem>
                <SelectItem value="Blog">Blog</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">PIC</Label>
            <Select value={picFilter} onValueChange={setPicFilter}>
              <SelectTrigger className="w-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua PIC</SelectItem>
                {picOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Keterangan</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Keterangan</SelectItem>
                <SelectItem value="memenuhi">✓ Memenuhi Standar</SelectItem>
                <SelectItem value="harus-diperbaiki">✗ Harus Diperbaiki</SelectItem>
                <SelectItem value="no-data">— Belum Dicek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-700">
              <TableHead className="w-12 font-bold text-neutral-700 dark:text-neutral-300">No</TableHead>
              <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">URL</TableHead>
              <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-center">
                <span className="flex items-center justify-center gap-1.5"><Monitor className="w-3.5 h-3.5" />LCP Desktop</span>
              </TableHead>
              <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-center">
                <span className="flex items-center justify-center gap-1.5"><Smartphone className="w-3.5 h-3.5" />LCP Mobile</span>
              </TableHead>
              <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-center">Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <div>
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <p className="text-sm font-medium">{records.length === 0 ? 'Tidak ada data' : 'Tidak ada data yang sesuai filter'}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((record, idx) => {
                const worstLcp = record.mobile_lcp !== null ? record.mobile_lcp : record.desktop_lcp;
                const status   = getLcpStatus(worstLcp);
                const rowNum   = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                return (
                  <TableRow
                    key={record.id}
                    className="text-sm border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <TableCell className="font-medium text-neutral-700 dark:text-neutral-300">{rowNum}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <a href={record.website?.url} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 truncate block font-medium transition-colors duration-200"
                        title={record.website?.url}>
                        {record.website?.url || '-'}
                      </a>
                      {record.website?.jenis_website && (
                        <span className="text-[11px] text-muted-foreground/70 font-medium">{record.website.jenis_website}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center"><LcpCell lcp={record.desktop_lcp} /></TableCell>
                    <TableCell className="text-center"><LcpCell lcp={record.mobile_lcp} /></TableCell>
                    <TableCell className="text-center"><KeteranganBadge status={status} /></TableCell>
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
          <div className="text-sm text-muted-foreground font-medium">
            Menampilkan {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} data
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Sebelumnya
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) page = i + 1;
                else if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
                return (
                  <Button key={`page-${page}`} variant={currentPage === page ? "default" : "outline"} size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="rounded-xl transition-all duration-300 hover:shadow-md hover:border-primary/30">
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const PageSpeedDashboard = () => {
  const [records, setRecords]       = useState<PageSpeedRecord[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await pageSpeedAPI.getAll();
      setRecords(res.data);
      setLastRefresh(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat data PageSpeed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Split by ads
  const withAds    = useMemo(() => records.filter(r => r.website?.has_ads), [records]);
  const withoutAds = useMemo(() => records.filter(r => !r.website?.has_ads), [records]);

  // PIC options from all data
  const picOptions = useMemo(() => {
    const set = new Set(records.map(r => r.website?.pic).filter((p): p is string => Boolean(p)));
    return Array.from(set).sort();
  }, [records]);

  // Top summary (all records)
  const totalStats = useMemo(() => {
    let memenuhi = 0, harus = 0, noData = 0;
    records.forEach(r => {
      const lcp = r.mobile_lcp !== null ? r.mobile_lcp : r.desktop_lcp;
      const s = getLcpStatus(lcp);
      if (s === 'memenuhi') memenuhi++;
      else if (s === 'harus-diperbaiki') harus++;
      else noData++;
    });
    return { total: records.length, memenuhi, harus, noData };
  }, [records]);

  const pageHeader = (
    <PageHeader icon={Zap} title="Dashboard LCP PageSpeed"
      subtitle="Monitoring Largest Contentful Paint seluruh website"
      iconColor="bg-amber-600" iconShadow="shadow-amber-200">
      <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}
        className="rounded-xl transition-all duration-300 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700">
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </PageHeader>
  );

  if (loading && records.length === 0) {
    return (
      <>
        {pageHeader}
        <div className="flex flex-col items-center justify-center h-64 gap-4 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
              <RefreshCw className="w-7 h-7 animate-spin text-white" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Memuat data LCP…</p>
        </div>
      </>
    );
  }

  if (error && records.length === 0) {
    return (
      <>
        {pageHeader}
        <Card className="border-rose-200/60 dark:border-rose-800/40 shadow-lg shadow-rose-100 dark:shadow-rose-950/20 rounded-2xl overflow-hidden animate-slide-up">
          <CardContent className="pt-8 py-14 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/40 dark:to-rose-800/40 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-rose-600 dark:text-rose-400 font-semibold text-lg">{error}</p>
            <Button onClick={fetchData} variant="outline" className="rounded-xl transition-all duration-300 hover:shadow-md">
              <RefreshCw className="w-4 h-4 mr-2" />Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {pageHeader}
      <div className="space-y-7">

        {/* ── Top Summary Cards (all) ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard gradient="from-blue-500 via-blue-600 to-indigo-700"      icon={<Globe       className="w-5 h-5 text-white" />} value={totalStats.total}    label="Total Website" delay={0} />
          <StatCard gradient="from-emerald-500 via-emerald-600 to-teal-700" icon={<ShieldCheck className="w-5 h-5 text-white" />} value={totalStats.memenuhi} label="Memenuhi Standar"  sub="LCP < 4 detik" delay={80} />
          <StatCard gradient="from-rose-500 via-rose-600 to-pink-700"      icon={<ShieldAlert className="w-5 h-5 text-white" />} value={totalStats.harus}    label="Harus Diperbaiki" sub="LCP ≥ 4 detik" delay={160} />
          <StatCard gradient="from-slate-500 via-slate-600 to-zinc-700"    icon={<HelpCircle  className="w-5 h-5 text-white" />} value={totalStats.noData}   label="Belum Dicek"      sub="Tidak ada data" delay={240} />
        </div>

        {/* ── Info standar ── */}
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Standar LCP
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ &lt; 4 detik</span> = Memenuhi Standar &nbsp;|&nbsp;
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">✗ ≥ 4 detik</span> = Harus Diperbaiki
                </p>
                {lastRefresh && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-amber-700 dark:text-amber-300">
                      Diperbarui {new Date(lastRefresh).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Tabs: Dengan Iklan vs Tanpa Iklan ── */}
        <Card>
          <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-lg font-bold tracking-tight">Daftar LCP Website</span>
              </CardTitle>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Total: {records.length} website
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="with_ads" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
                <TabsTrigger
                  value="with_ads"
                  className="flex items-center gap-2"
                >
                  LCP Dengan Iklan ({withAds.length})
                </TabsTrigger>
                <TabsTrigger
                  value="without_ads"
                  className="flex items-center gap-2"
                >
                  LCP Tanpa Iklan ({withoutAds.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="with_ads">
                <TabStats records={withAds} />
                <TabTable records={withAds} picOptions={picOptions} />
              </TabsContent>

              <TabsContent value="without_ads">
                <TabStats records={withoutAds} />
                <TabTable records={withoutAds} picOptions={picOptions} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ── Detail Laporan Performa ── */}
        <PageSpeedPerformanceReport records={records} />

      </div>
    </>
  );
};

export default PageSpeedDashboard;

import { useEffect, useState, useMemo } from 'react';
import { pageSpeedAPI } from '@/services/api';
import PageHeader from "@/components/PageHeader";
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
  Monitor, Smartphone, Globe, ShieldCheck, ShieldAlert, HelpCircle,
  TrendingDown, TrendingUp, Clock
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
  desktop_lcp: number | null;
  mobile_lcp: number | null;
  desktop_performance_score: number | null;
  mobile_performance_score: number | null;
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
      <span className="inline-block w-20 text-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
        {formatLcp(lcp)}
      </span>
    );
  }
  if (status === 'harus-diperbaiki') {
    return (
      <span className="inline-block w-20 text-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
        {formatLcp(lcp)}
      </span>
    );
  }
  
  return <span className="inline-block w-20 text-center text-neutral-400 dark:text-neutral-500">-</span>;
};

const KeteranganBadge = ({ status }: { status: LcpStatus }) => {
  if (status === 'memenuhi') return (
    <span className="inline-flex items-center justify-center gap-1.5 w-[160px] px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />Memenuhi Standar
    </span>
  );
  if (status === 'harus-diperbaiki') return (
    <span className="inline-flex items-center justify-center gap-1.5 w-[160px] px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
      <XCircle className="w-3.5 h-3.5 shrink-0" />Harus Diperbaiki
    </span>
  );
  return (
    <span className="inline-flex items-center justify-center gap-1.5 w-[160px] px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
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
    <div className="mt-6 space-y-4">
      {/* Klasifikasi cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="absolute -top-3 -right-3 w-14 h-14 bg-white/10 rounded-full" />
          <div className="relative text-center">
            <div className="text-3xl font-bold">{memenuhi}</div>
            <div className="text-emerald-100 text-xs font-medium mt-0.5">Memenuhi Standar (&lt;4s)</div>
            {total > 0 && <div className="text-emerald-200 text-xs mt-0.5">{Math.round((memenuhi / total) * 100)}%</div>}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="absolute -top-3 -right-3 w-14 h-14 bg-white/10 rounded-full" />
          <div className="relative text-center">
            <div className="text-3xl font-bold">{harus}</div>
            <div className="text-orange-100 text-xs font-medium mt-0.5">Perlu Perbaikan (≥4s)</div>
            {total > 0 && <div className="text-orange-200 text-xs mt-0.5">{Math.round((harus / total) * 100)}%</div>}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="absolute -top-3 -right-3 w-14 h-14 bg-white/10 rounded-full" />
          <div className="relative text-center">
            <div className="text-3xl font-bold">{noData}</div>
            <div className="text-slate-200 text-xs font-medium mt-0.5">Belum Ada Data</div>
          </div>
        </div>
      </div>

      {/* Rata-rata LCP */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Rata-rata LCP Desktop</div>
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {avgDesk !== null ? `${avgDesk.toFixed(2)}s` : '-'}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Rata-rata LCP Mobile</div>
              <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                {avgMob !== null ? `${avgMob.toFixed(2)}s` : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Top summary card (total keseluruhan)
interface StatCardProps { gradient: string; icon: React.ReactNode; value: number; label: string; sub?: string }
const StatCard = ({ gradient, icon, value, label, sub }: StatCardProps) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${gradient}`}>
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
    <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
    <div className="relative z-10">
      <div className="mb-3 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">{icon}</div>
      <div className="text-3xl font-bold mb-0.5 leading-none">{value}</div>
      <div className="text-sm font-semibold text-white/90">{label}</div>
      {sub && <div className="text-xs text-white/70 mt-1">{sub}</div>}
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
    <div className="mt-6 space-y-4">
      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Semua Holding</SelectItem>
                {holdingOptions.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Jenis Website</Label>
            <Select value={jenisFilter} onValueChange={setJenisFilter}>
              <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="React JS">React JS</SelectItem>
                <SelectItem value="Wordpress">Wordpress</SelectItem>
                <SelectItem value="Bootstrap">Bootstrap</SelectItem>
                <SelectItem value="Mini LP">Mini LP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">PIC</Label>
            <Select value={picFilter} onValueChange={setPicFilter}>
              <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
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
              <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
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
                <span className="flex items-center justify-center gap-1"><Monitor className="w-3.5 h-3.5" />LCP Desktop</span>
              </TableHead>
              <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-center">
                <span className="flex items-center justify-center gap-1"><Smartphone className="w-3.5 h-3.5" />LCP Mobile</span>
              </TableHead>
              <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-center">Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                  <p className="text-sm">{records.length === 0 ? 'Tidak ada data' : 'Tidak ada data yang sesuai filter'}</p>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((record, idx) => {
                const worstLcp = record.mobile_lcp !== null ? record.mobile_lcp : record.desktop_lcp;
                const status   = getLcpStatus(worstLcp);
                const rowNum   = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                return (
                  <TableRow key={record.id} className="text-sm border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <TableCell className="font-medium text-neutral-700 dark:text-neutral-300">{rowNum}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <a href={record.website?.url} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-medium"
                        title={record.website?.url}>
                        {record.website?.url || '-'}
                      </a>
                      {record.website?.jenis_website && (
                        <span className="text-xs text-muted-foreground">{record.website.jenis_website}</span>
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
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
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
                    className="h-8 w-8 p-0" onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
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
      <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </PageHeader>
  );

  if (loading && records.length === 0) {
    return (
      <>
        {pageHeader}
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <RefreshCw className="w-10 h-10 animate-spin text-amber-500" />
          <p className="text-muted-foreground text-sm">Memuat data LCP…</p>
        </div>
      </>
    );
  }

  if (error && records.length === 0) {
    return (
      <>
        {pageHeader}
        <Card className="border-rose-200 dark:border-rose-800">
          <CardContent className="pt-6 py-12 text-center space-y-3">
            <AlertCircle className="w-12 h-12 mx-auto text-rose-500" />
            <p className="text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
            <Button onClick={fetchData} variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Coba Lagi</Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {pageHeader}
      <div className="space-y-6">

        {/* ── Top Summary Cards (all) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard gradient="bg-gradient-to-br from-blue-500 to-blue-700"      icon={<Globe       className="w-5 h-5 text-white" />} value={totalStats.total}    label="Total Website" />
          <StatCard gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" icon={<ShieldCheck className="w-5 h-5 text-white" />} value={totalStats.memenuhi} label="Memenuhi Standar"  sub="LCP < 4 detik" />
          <StatCard gradient="bg-gradient-to-br from-rose-500 to-rose-700"      icon={<ShieldAlert className="w-5 h-5 text-white" />} value={totalStats.harus}    label="Harus Diperbaiki" sub="LCP ≥ 4 detik" />
          <StatCard gradient="bg-gradient-to-br from-slate-500 to-slate-700"    icon={<HelpCircle  className="w-5 h-5 text-white" />} value={totalStats.noData}   label="Belum Dicek"      sub="Tidak ada data" />
        </div>

        {/* ── Info standar ── */}
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <CardContent className="py-3">
            <div className="flex flex-wrap items-center gap-3 text-sm text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>Standar LCP:</strong>&nbsp;
                <span className="text-emerald-600 font-semibold">✓ &lt; 4 detik</span> = Memenuhi Standar &nbsp;|&nbsp;
                <span className="text-rose-600 font-semibold">✗ ≥ 4 detik</span> = Harus Diperbaiki
              </span>
              {lastRefresh && (
                <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  Diperbarui {new Date(lastRefresh).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Tabs: Dengan Iklan vs Tanpa Iklan ── */}
        <Card>
          <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                Daftar LCP Website
              </CardTitle>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Total: {records.length} website
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="with_ads" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl mb-2">
                <TabsTrigger
                  value="with_ads"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 transition-all duration-200 font-medium"
                >
                  <TrendingDown className="h-4 w-4" />
                  LCP Dengan Iklan ({withAds.length})
                </TabsTrigger>
                <TabsTrigger
                  value="without_ads"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 transition-all duration-200 font-medium"
                >
                  <TrendingUp className="h-4 w-4" />
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

      </div>
    </>
  );
};

export default PageSpeedDashboard;

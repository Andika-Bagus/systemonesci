import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';
import UptimeChart from '@/components/charts/UptimeChart';

interface UptimeDetailModalProps {
  websiteId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface UptimeStats {
  website: {
    id: number;
    url: string;
  };
  current_status: 'up' | 'down' | 'unknown';
  uptime_percentage: number;
  total_checks: number;
  up_checks: number;
  down_checks: number;
  avg_response_time: number | null;
  incidents: Array<{
    id: number;
    started_at: string;
    ended_at: string | null;
    duration: number | null;
    duration_text: string;
    reason: string;
    is_resolved: boolean;
  }>;
  period: {
    days: number;
    from: string | null;
    to: string | null;
  };
}

interface UptimeHistory {
  checked_at: string;
  date: string;
  time: string;
  status: 'up' | 'down';
  http_code: number | null;
  response_time: number | null;
}

export default function UptimeDetailModal({ websiteId, isOpen, onClose }: UptimeDetailModalProps) {
  const [stats, setStats] = useState<UptimeStats | null>(null);
  const [history, setHistory] = useState<UptimeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>('7');

  useEffect(() => {
    if (isOpen && websiteId) {
      fetchData();
    }
  }, [isOpen, websiteId, period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.get(`/uptime/${websiteId}/stats?days=${period}`),
        api.get(`/uptime/${websiteId}/history?days=${period}`)
      ]);

      setStats(statsRes.data);
      setHistory(historyRes.data.history);
    } catch (error) {
      console.error('Error fetching uptime data:', error);
      toast.error('Gagal memuat data uptime');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: 'up' | 'down' | 'unknown') => {
    switch (status) {
      case 'up':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            UP
          </Badge>
        );
      case 'down':
        return (
          <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 text-xs px-3 py-1">
            <AlertCircle className="w-3 h-3 mr-1" />
            DOWN
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-500 text-xs px-3 py-1">
            <Clock className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const formatResponseTime = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Prepare chart data
  const chartData = history.map(h => ({
    datetime: `${h.date.substring(5)} ${h.time}`,
    fullDatetime: `${h.date} ${h.time}`,
    responseTime: h.response_time || 0,
    status: h.status === 'up' ? 1 : 0,
  }));

  // Auto-skip labels if too many data points
  const getTickInterval = () => {
    if (chartData.length > 50) return Math.floor(chartData.length / 10);
    if (chartData.length > 20) return Math.floor(chartData.length / 8);
    return 0;
  };

  if (loading || !stats) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <a 
              href={stats.website.url.startsWith('http') ? stats.website.url : `https://${stats.website.url}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {stats.website.url}
            </a>
          </DialogTitle>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            Period: {stats.period.from && stats.period.to ? `${stats.period.from} - ${stats.period.to}` : `Last ${stats.period.days} days`}
          </p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="daily">Daily Chart</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Uptime Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Status Card */}
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-medium text-white/80 mb-1.5">Status</p>
                    <div className="flex justify-center">
                      {getStatusBadge(stats.current_status)}
                    </div>
                  </div>
                </div>

                {/* Uptime Card */}
                <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-medium text-white/80 mb-0.5">Uptime</p>
                    <p className="text-xl font-bold !text-white" style={{ color: 'white !important' }}>
                      {stats.uptime_percentage}%
                    </p>
                  </div>
                </div>

                {/* Avg Response Card */}
                <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-medium text-white/80 mb-0.5">Avg Response</p>
                    <p className="text-xl font-bold !text-white" style={{ color: 'white !important' }}>
                      {formatResponseTime(stats.avg_response_time)}
                    </p>
                  </div>
                </div>

                {/* Total Checks Card */}
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-medium text-white/80 mb-0.5">Total Checks</p>
                    <p className="text-xl font-bold !text-white" style={{ color: 'white !important' }}>{stats.total_checks}</p>
                    <p className="text-[10px] text-white/80 mt-0.5">
                      <span className="font-semibold !text-white" style={{ color: 'white !important' }}>{stats.up_checks} up</span> / <span className="font-semibold !text-white" style={{ color: 'white !important' }}>{stats.down_checks} down</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Chart */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Response Time Over Time</h3>
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="datetime" 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval={getTickInterval()}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          return payload[0].payload.fullDatetime;
                        }
                        return label;
                      }}
                      formatter={(value: any) => value ? `${value}ms` : 'N/A'}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#3b82f6" 
                      name="Response Time (ms)" 
                      strokeWidth={2.5} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Period Tabs */}
                <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setPeriod("1")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      period === "1"
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    }`}
                  >
                    Hari Ini
                  </button>
                  <button
                    onClick={() => setPeriod("7")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      period === "7"
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    }`}
                  >
                    7 Hari
                  </button>
                  <button
                    onClick={() => setPeriod("30")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      period === "30"
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    }`}
                  >
                    30 Hari
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            {/* Month Filter */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Filter Bulan</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">Pilih bulan untuk melihat detail uptime harian</p>
              </div>
              <select 
                className="px-3 py-2 text-sm border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-blue-900 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
                onChange={() => {
                  // Update selected month - for now just refresh
                  window.location.reload();
                }}
              >
                <option value="">Bulan ini</option>
                <option value="2026-05">Mei 2026</option>
                <option value="2026-04">April 2026</option>
                <option value="2026-03">Maret 2026</option>
                <option value="2026-02">Februari 2026</option>
                <option value="2026-01">Januari 2026</option>
              </select>
            </div>
            
            <div className="p-6 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <UptimeChart 
                websiteId={websiteId} 
                websiteUrl={stats.website.url}
                selectedMonth=""
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">Check History</h3>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow className="bg-neutral-50 dark:bg-neutral-800">
                      <TableHead className="font-bold">Checked At</TableHead>
                      <TableHead className="text-center font-bold">Status</TableHead>
                      <TableHead className="text-center font-bold">HTTP Code</TableHead>
                      <TableHead className="text-center font-bold">Response Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-neutral-500">
                          <Clock className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                          <p className="text-sm">Belum ada data history</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      history.slice(0, 50).map((h, index) => (
                        <TableRow key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                          <TableCell className="font-medium">{h.checked_at}</TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(h.status)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-mono">{h.http_code || '-'}</Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {formatResponseTime(h.response_time)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {history.length > 50 && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-xs text-center text-neutral-500">
                    Menampilkan 50 data terakhir dari {history.length} total checks
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">Downtime Incidents</h3>
            <div className="space-y-3">
              {stats.incidents.length === 0 ? (
                <div className="p-8 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">Tidak ada incident downtime</p>
                  <p className="text-sm text-neutral-500 mt-1">Website berjalan dengan baik</p>
                </div>
              ) : (
                stats.incidents.map((incident) => (
                  <div 
                    key={incident.id}
                    className={`p-4 rounded-lg border ${
                      incident.is_resolved 
                        ? 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700' 
                        : 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`w-5 h-5 ${incident.is_resolved ? 'text-neutral-500' : 'text-rose-500'}`} />
                        <span className="font-bold text-sm">
                          {incident.is_resolved ? '✓ Resolved' : '⚠ Ongoing'}
                        </span>
                      </div>
                      <Badge 
                        variant={incident.is_resolved ? 'outline' : 'destructive'}
                        className="font-semibold"
                      >
                        {incident.duration_text}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1 ml-7 text-neutral-700 dark:text-neutral-300">
                      <p>
                        <span className="text-neutral-500 dark:text-neutral-400">Started:</span>{' '}
                        <span className="font-medium">{incident.started_at}</span>
                      </p>
                      {incident.ended_at && (
                        <p>
                          <span className="text-neutral-500 dark:text-neutral-400">Ended:</span>{' '}
                          <span className="font-medium">{incident.ended_at}</span>
                        </p>
                      )}
                      {incident.reason && (
                        <p>
                          <span className="text-neutral-500 dark:text-neutral-400">Reason:</span>{' '}
                          <span className="font-medium">{incident.reason}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

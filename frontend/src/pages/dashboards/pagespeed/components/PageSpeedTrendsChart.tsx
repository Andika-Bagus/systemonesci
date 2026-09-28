import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area, Legend } from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, Calendar, Sparkles, AlertCircle, Monitor, Smartphone } from 'lucide-react';
import { pageSpeedAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const holdingOptions = [
  'Ridwan Institute', 'Publikasi Indonesia', 'Green Publisher',
  'Riviera Publishing', 'International Journal Labs', 'Al-Makki Publisher',
  'LSP Ditekindo', 'LSP Ebiskraf', 'LSP MSDM', 'SYNTAXNESIA',
  'EDC', 'LPK MKM', 'FOUNDATION', 'STAIKU', 'POLTEK SCI', 'Intention',
];

interface TrendDataPoint {
  date: string;
  date_formatted: string;
  with_ads: {
    desktop_perf: number | null;
    mobile_perf: number | null;
    desktop_lcp: number | null;
    mobile_lcp: number | null;
  };
  without_ads: {
    desktop_perf: number | null;
    mobile_perf: number | null;
    desktop_lcp: number | null;
    mobile_lcp: number | null;
  };
}

export default function PageSpeedTrendsChart() {
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [metricType, setMetricType] = useState<'performance' | 'lcp'>('performance');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [holding, setHolding] = useState('all');

  const fetchTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await pageSpeedAPI.getTrends(days, holding);
      setTrends(res.data.trends || []);
    } catch (err: any) {
      console.error('Error fetching PageSpeed trends:', err);
      setError(err.response?.data?.error || 'Gagal memuat tren historis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [days, holding]);

  // Format data for Recharts based on selected metrics
  const chartData = trends.map((t) => {
    if (metricType === 'performance') {
      return {
        date: t.date_formatted,
        fullDate: t.date,
        'Dengan Iklan': device === 'mobile' ? t.with_ads.mobile_perf : t.with_ads.desktop_perf,
        'Tanpa Iklan': device === 'mobile' ? t.without_ads.mobile_perf : t.without_ads.desktop_perf,
      };
    } else {
      return {
        date: t.date_formatted,
        fullDate: t.date,
        'Dengan Iklan': device === 'mobile' ? t.with_ads.mobile_lcp : t.with_ads.desktop_lcp,
        'Tanpa Iklan': device === 'mobile' ? t.without_ads.mobile_lcp : t.without_ads.desktop_lcp,
      };
    }
  });

  const getPerformanceSummary = () => {
    if (trends.length < 2) return null;
    const first = trends[0];
    const last = trends[trends.length - 1];

    const getDiff = (ads: boolean) => {
      const firstVal = ads 
        ? (device === 'mobile' ? first.with_ads.mobile_perf : first.with_ads.desktop_perf)
        : (device === 'mobile' ? first.without_ads.mobile_perf : first.without_ads.desktop_perf);
      const lastVal = ads
        ? (device === 'mobile' ? last.with_ads.mobile_perf : last.with_ads.desktop_perf)
        : (device === 'mobile' ? last.without_ads.mobile_perf : last.without_ads.desktop_perf);

      if (firstVal === null || lastVal === null) return 0;
      return lastVal - firstVal;
    };

    const diffWith = getDiff(true);
    const diffWithout = getDiff(false);

    return { diffWith, diffWithout };
  };

  const summary = getPerformanceSummary();

  const getTickInterval = () => {
    if (chartData.length <= 7) return 0;
    if (chartData.length <= 15) return 1;
    return Math.floor(chartData.length / 7);
  };

  return (
    <Card className="border border-neutral-200 dark:border-neutral-800 shadow-md">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            Analisis Tren Performa Makro
          </CardTitle>
          <CardDescription>
            Membandingkan rata-rata kecepatan website dengan iklan vs tanpa iklan
          </CardDescription>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Holding Filter */}
          <Select value={holding} onValueChange={setHolding}>
            <SelectTrigger className="h-8 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 w-[140px]">
              <SelectValue placeholder="Semua Holding" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Semua Holding</SelectItem>
              {holdingOptions.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Days Filter */}
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  days === d
                    ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {d} Hari
              </button>
            ))}
          </div>

          {/* Device Filter */}
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1 rounded-md transition-all flex items-center justify-center ${
                device === 'mobile'
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Tampilan Mobile"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1 rounded-md transition-all flex items-center justify-center ${
                device === 'desktop'
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Tampilan Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={fetchTrends}
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg"
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {loading && trends.length === 0 ? (
          <div className="h-[350px] flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-muted-foreground">Memuat data tren historis...</p>
          </div>
        ) : error && trends.length === 0 ? (
          <div className="h-[350px] flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl border-rose-200 bg-rose-50/20 dark:bg-rose-950/10">
            <AlertCircle className="w-10 h-10 text-rose-500" />
            <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
            <Button onClick={fetchTrends} variant="outline" size="sm" className="mt-2">
              <RefreshCw className="w-4 h-4 mr-2" /> Coba Lagi
            </Button>
          </div>
        ) : trends.length === 0 ? (
          <div className="h-[350px] flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl border-neutral-200">
            <Calendar className="w-10 h-10 text-neutral-400" />
            <p className="text-sm text-neutral-500">Belum ada rekaman history data PageSpeed.</p>
          </div>
        ) : (
          <>
            {/* Metric Selector Tabs */}
            <Tabs
              value={metricType}
              onValueChange={(val) => setMetricType(val as 'performance' | 'lcp')}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                <TabsTrigger
                  value="performance"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium text-xs transition-all duration-200"
                >
                  Skor Performa
                </TabsTrigger>
                <TabsTrigger
                  value="lcp"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 font-medium text-xs transition-all duration-200"
                >
                  Waktu LCP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="mt-4">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWithAds" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorWithoutAds" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: '#888' }}
                      interval={getTickInterval()}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 11, fill: '#888' }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) return payload[0].payload.fullDate;
                        return label;
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Area 
                      type="monotone" 
                      dataKey="Dengan Iklan" 
                      stroke="#ef4444" 
                      fill="url(#colorWithAds)" 
                      strokeWidth={2.5}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Tanpa Iklan" 
                      stroke="#10b981" 
                      fill="url(#colorWithoutAds)" 
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="lcp" className="mt-4">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWithAdsLcp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorWithoutAdsLcp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: '#888' }}
                      interval={getTickInterval()}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#888' }}
                      tickFormatter={(v: number) => `${v}s`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) return payload[0].payload.fullDate;
                        return label;
                      }}
                      formatter={(v) => [`${Number(v).toFixed(2)} detik`]}
                    />
                    <ReferenceLine 
                      y={2.5} 
                      stroke="#10b981" 
                      strokeDasharray="4 4" 
                      label={{ value: 'Standar LCP Baik (<2.5s)', fontSize: 10, fill: '#10b981', position: 'insideBottomRight', offset: 10 }} 
                    />
                    <ReferenceLine 
                      y={4.0} 
                      stroke="#ef4444" 
                      strokeDasharray="4 4" 
                      label={{ value: 'Perlu Perbaikan (>=4.0s)', fontSize: 10, fill: '#ef4444', position: 'insideTopRight', offset: 10 }} 
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Area 
                      type="monotone" 
                      dataKey="Dengan Iklan" 
                      stroke="#f97316" 
                      fill="url(#colorWithAdsLcp)" 
                      strokeWidth={2.5}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Tanpa Iklan" 
                      stroke="#06b6d4" 
                      fill="url(#colorWithoutAdsLcp)" 
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>

            {/* Improvement Statistics Cards */}
            {summary && metricType === 'performance' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    summary.diffWith > 0 
                      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' 
                      : summary.diffWith < 0 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' 
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>
                    {summary.diffWith > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 font-semibold uppercase">Pertumbuhan Dengan Iklan</div>
                    <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                      {summary.diffWith > 0 ? '+' : ''}{summary.diffWith.toFixed(1)} poin
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    summary.diffWithout > 0 
                      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' 
                      : summary.diffWithout < 0 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' 
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>
                    {summary.diffWithout > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 font-semibold uppercase">Pertumbuhan Tanpa Iklan</div>
                    <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                      {summary.diffWithout > 0 ? '+' : ''}{summary.diffWithout.toFixed(1)} poin
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

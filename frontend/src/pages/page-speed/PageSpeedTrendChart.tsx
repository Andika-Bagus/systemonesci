import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Minus, RefreshCw, Calendar, BarChart3 } from "lucide-react";
import api from "@/services/api";

interface PageSpeedTrendChartProps {
  websiteId: number;
}

interface HistoryRecord {
  id: number;
  checked_at: string;
  date: string;
  time: string;
  desktop: {
    performance: number | null;
    accessibility: number | null;
    best_practices: number | null;
    seo: number | null;
    lcp: number | null;
    fid: number | null;
    cls: number | null;
  };
  mobile: {
    performance: number | null;
    accessibility: number | null;
    best_practices: number | null;
    seo: number | null;
    lcp: number | null;
    fid: number | null;
    cls: number | null;
  };
}

interface HistoryData {
  website: {
    id: number;
    url: string;
    holding: string;
  };
  history: HistoryRecord[];
  improvement: {
    desktop_performance: number;
    mobile_performance: number;
    desktop_lcp: number;
    mobile_lcp: number;
    desktop_fid: number;
    mobile_fid: number;
    desktop_cls: number;
    mobile_cls: number;
  } | null;
  period: {
    days: number;
    from: string | null;
    to: string | null;
  };
  total_checks: number;
}

export default function PageSpeedTrendChart({ websiteId }: PageSpeedTrendChartProps) {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    fetchHistory();
  }, [websiteId, period]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/page-speed/${websiteId}/history?days=${period}`);
      setData(response.data);
    } catch (error: any) {
      console.error("Error fetching PageSpeed history:", error);
      setError(error.response?.data?.error || error.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading trend data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-sm text-rose-600 dark:text-rose-400 mb-4">{error}</p>
          <button 
            onClick={fetchHistory}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.history.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">No History Data</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Perform PageSpeed checks to start tracking performance trends over time
          </p>
        </div>
      </div>
    );
  }

  const chartData = data.history.map((record) => {
    // Format: MM-DD HH:mm (lebih pendek & readable)
    const [, month, day] = record.date.split('-');
    const shortDate = `${month}-${day} ${record.time}`;
    
    return {
      datetime: shortDate,
      fullDatetime: `${record.date} ${record.time}`,
      desktopPerf: record.desktop.performance,
      mobilePerf: record.mobile.performance,
      desktopLcp: record.desktop.lcp,
      mobileLcp: record.mobile.lcp,
    };
  });

  // Calculate interval untuk X-axis labels (avoid crowding)
  const getTickInterval = () => {
    const dataLength = chartData.length;
    if (dataLength <= 5) return 0; // Show all
    if (dataLength <= 10) return 1; // Show every other
    if (dataLength <= 20) return 2; // Show every 3rd
    return Math.floor(dataLength / 8); // Show max 8 labels
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BarChart3 size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Performance Trend Analysis</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar size={12} />
              <span>{data.total_checks} checks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Changes Summary */}
      {data.improvement && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Performance Changes</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Desktop Performance */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide">Desktop Performance</span>
                  <div className={`p-1 rounded ${data.improvement.desktop_performance > 0 ? 'bg-white/20' : data.improvement.desktop_performance < 0 ? 'bg-white/20' : 'bg-white/10'}`}>
                    {Math.abs(data.improvement.desktop_performance) < 0.01 ? (
                      <Minus size={12} className="text-white" />
                    ) : data.improvement.desktop_performance > 0 ? (
                      <TrendingUp size={12} className="text-white" />
                    ) : (
                      <TrendingDown size={12} className="text-white" />
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">
                    {data.improvement.desktop_performance > 0 ? '+' : ''}{data.improvement.desktop_performance.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-white/80 font-medium">pts</span>
                </div>
              </div>
            </div>

            {/* Mobile Performance */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-3 shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide">Mobile Performance</span>
                  <div className={`p-1 rounded ${data.improvement.mobile_performance > 0 ? 'bg-white/20' : data.improvement.mobile_performance < 0 ? 'bg-white/20' : 'bg-white/10'}`}>
                    {Math.abs(data.improvement.mobile_performance) < 0.01 ? (
                      <Minus size={12} className="text-white" />
                    ) : data.improvement.mobile_performance > 0 ? (
                      <TrendingUp size={12} className="text-white" />
                    ) : (
                      <TrendingDown size={12} className="text-white" />
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">
                    {data.improvement.mobile_performance > 0 ? '+' : ''}{data.improvement.mobile_performance.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-white/80 font-medium">pts</span>
                </div>
              </div>
            </div>

            {/* Desktop LCP */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-3 shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide">Desktop LCP</span>
                  <div className={`p-1 rounded ${data.improvement.desktop_lcp > 0 ? 'bg-white/20' : data.improvement.desktop_lcp < 0 ? 'bg-white/20' : 'bg-white/10'}`}>
                    {Math.abs(data.improvement.desktop_lcp) < 0.01 ? (
                      <Minus size={12} className="text-white" />
                    ) : data.improvement.desktop_lcp > 0 ? (
                      <TrendingUp size={12} className="text-white" />
                    ) : (
                      <TrendingDown size={12} className="text-white" />
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">
                    {data.improvement.desktop_lcp > 0 ? '+' : ''}{data.improvement.desktop_lcp.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-white/80 font-medium">s</span>
                </div>
              </div>
            </div>

            {/* Mobile LCP */}
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg p-3 shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide">Mobile LCP</span>
                  <div className={`p-1 rounded ${data.improvement.mobile_lcp > 0 ? 'bg-white/20' : data.improvement.mobile_lcp < 0 ? 'bg-white/20' : 'bg-white/10'}`}>
                    {Math.abs(data.improvement.mobile_lcp) < 0.01 ? (
                      <Minus size={12} className="text-white" />
                    ) : data.improvement.mobile_lcp > 0 ? (
                      <TrendingUp size={12} className="text-white" />
                    ) : (
                      <TrendingDown size={12} className="text-white" />
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">
                    {data.improvement.mobile_lcp > 0 ? '+' : ''}{data.improvement.mobile_lcp.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-white/80 font-medium">s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info for single check */}
      {!data.improvement && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 Perform another check to see performance changes and trend comparison
          </p>
        </div>
      )}

      {/* Performance Score Chart */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-4">Performance Score Over Time</h4>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <defs>
                <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="datetime" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                angle={-45}
                textAnchor="end"
                height={70}
                interval={getTickInterval()}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
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
              />
              <ReferenceLine y={90} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Good (90+)', fontSize: 10, fill: '#10b981' }} />
              <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Needs Work (50)', fontSize: 10, fill: '#f59e0b' }} />
              <Area type="monotone" dataKey="desktopPerf" stroke="#3b82f6" fill="url(#colorDesktop)" name="Desktop" strokeWidth={2} />
              <Area type="monotone" dataKey="mobilePerf" stroke="#10b981" fill="url(#colorMobile)" name="Mobile" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Period Tabs for Performance */}
          <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPeriod("1")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === "1"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod("30")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === "30"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setPeriod("365")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === "365"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Tahun Ini
            </button>
          </div>
        </CardContent>
      </Card>

      {/* LCP Chart */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">LCP (Largest Contentful Paint)</h4>
            <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
              <div><span className="text-emerald-600">●</span> Good: &lt; 2.5s</div>
              <div><span className="text-amber-600">●</span> OK: 2.5-4s</div>
              <div><span className="text-rose-600">●</span> Poor: &gt; 4s</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <defs>
                <linearGradient id="colorDesktopLcp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMobileLcp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
                formatter={(value: any) => value ? `${(value as number).toFixed(2)}s` : 'N/A'}
              />
              <ReferenceLine y={2.5} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Good', fontSize: 10, fill: '#10b981' }} />
              <ReferenceLine y={4} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Needs Work', fontSize: 10, fill: '#f59e0b' }} />
              <Area type="monotone" dataKey="desktopLcp" stroke="#3b82f6" fill="url(#colorDesktopLcp)" name="Desktop" strokeWidth={2} />
              <Area type="monotone" dataKey="mobileLcp" stroke="#10b981" fill="url(#colorMobileLcp)" name="Mobile" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Period Tabs for LCP */}
          <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPeriod("1")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === "1"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod("30")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === "30"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setPeriod("365")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === "365"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Tahun Ini
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

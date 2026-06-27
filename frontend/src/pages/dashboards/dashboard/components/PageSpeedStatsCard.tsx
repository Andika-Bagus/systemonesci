import { useEffect, useState } from 'react';
import { pageSpeedAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Monitor, Smartphone, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import CustomSelect from '@/components/shared/CustomSelect';

interface PageSpeedStats {
  total_websites: number;
  good_performance: number;
  needs_improvement: number;
  poor_performance: number;
  no_data: number;
  avg_desktop_score: number;
  avg_mobile_score: number;
}

interface StatsData {
  stats: {
    with_ads: PageSpeedStats;
    without_ads: PageSpeedStats;
  };
  summary: {
    total_websites: number;
    websites_with_ads: number;
    websites_without_ads: number;
    overall_avg_desktop: number;
    overall_avg_mobile: number;
  };
}

const PageSpeedStatsCard = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const periodOptions = [
    { value: 'all', label: 'Semua Data' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: '7 Hari Terakhir' },
    { value: 'month', label: '30 Hari Terakhir' }
  ];

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh setiap 5 menit
    const interval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await pageSpeedAPI.getStatsByAds();
      setData(response.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      console.error('PageSpeed Stats Error:', err);
      setError(err.response?.data?.error || 'Gagal memuat statistik PageSpeed');
    } finally {
      setLoading(false);
    }
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStatsSection = (stats: PageSpeedStats) => (
    <div className="mt-8">
      {/* Enhanced Performance Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative text-center">
            <h6 className="text-2xl font-bold text-white mb-1">{stats.good_performance}</h6>
            <span className="text-green-100 text-sm font-medium">Bagus (≥90)</span>
          </div>
        </div>
        
        <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative text-center">
            <h6 className="text-2xl font-bold text-white mb-1">{stats.needs_improvement}</h6>
            <span className="text-yellow-100 text-sm font-medium">Perlu Perbaikan</span>
          </div>
        </div>
        
        <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative text-center">
            <h6 className="text-2xl font-bold text-white mb-1">{stats.poor_performance}</h6>
            <span className="text-red-100 text-sm font-medium">Buruk (&lt;50)</span>
          </div>
        </div>
        
        <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-neutral-500 to-neutral-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative text-center">
            <h6 className="text-2xl font-bold text-white mb-1">{stats.no_data}</h6>
            <span className="text-neutral-100 text-sm font-medium">Belum Ada Data</span>
          </div>
        </div>
      </div>

      {/* Enhanced Average Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Monitor className="h-7 w-7 text-white" />
            </div>
            <div className="flex-grow">
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Rata-rata Desktop</span>
              <h6 className={`text-2xl font-bold mb-0 ${getPerformanceColor(stats.avg_desktop_score)}`}>
                {stats.avg_desktop_score}
              </h6>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Smartphone className="h-7 w-7 text-white" />
            </div>
            <div className="flex-grow">
              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Rata-rata Mobile</span>
              <h6 className={`text-2xl font-bold mb-0 ${getPerformanceColor(stats.avg_mobile_score)}`}>
                {stats.avg_mobile_score}
              </h6>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Performance Distribution */}
      {stats.total_websites > 0 && (
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h6 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Distribusi Performa</h6>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
              {stats.total_websites} website
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-24">
                <div className="w-4 h-4 bg-green-500 rounded-full shrink-0"></div>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Bagus</span>
              </div>
              <div className="flex-grow bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${(stats.good_performance / stats.total_websites) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-green-600 w-12 text-right">
                {Math.round((stats.good_performance / stats.total_websites) * 100)}%
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-24">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shrink-0"></div>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Perbaikan</span>
              </div>
              <div className="flex-grow bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${(stats.needs_improvement / stats.total_websites) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-yellow-600 w-12 text-right">
                {Math.round((stats.needs_improvement / stats.total_websites) * 100)}%
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-24">
                <div className="w-4 h-4 bg-red-500 rounded-full shrink-0"></div>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Buruk</span>
              </div>
              <div className="flex-grow bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${(stats.poor_performance / stats.total_websites) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-red-600 w-12 text-right">
                {Math.round((stats.poor_performance / stats.total_websites) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <Card className="card h-full rounded-xl border-0 !p-0 block shadow-lg">
        <CardContent className="card-body p-6 h-full flex flex-col justify-center">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading PageSpeed Stats...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card h-full rounded-xl border-0 !p-0 block shadow-lg">
        <CardContent className="card-body p-6 h-full flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center h-64 text-red-600">
            <AlertCircle className="h-8 w-8 mb-2" />
            <span className="text-center mb-4">{error}</span>
            <button 
              onClick={fetchStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="card h-full rounded-xl border-0 !p-0 block shadow-lg">
      <CardContent className="card-body p-6 h-full flex flex-col">
        {/* Enhanced Header */}
        <div className="flex items-center flex-wrap gap-2 justify-between mb-6">
          <h6 className="font-bold text-xl mb-0 flex items-center gap-3 text-neutral-900 dark:text-neutral-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Statistik PageSpeed berdasarkan Status Iklan
          </h6>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 transition-colors disabled:opacity-50 hover:shadow-md"
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <CustomSelect
              placeholder="Semua Data"
              options={periodOptions.map(p => p.label)}
            />
          </div>
        </div>

        {/* Enhanced Summary Info */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-6 text-sm text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Total: {data.summary.total_websites} website</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Dengan Iklan: {data.summary.websites_with_ads}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Tanpa Iklan: {data.summary.websites_without_ads}</span>
            </div>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatLastUpdated(lastUpdated)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="with_ads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl mb-6">
            <TabsTrigger 
              value="with_ads" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 transition-all duration-200 font-medium"
            >
              <TrendingDown className="h-4 w-4" />
              <span>Dengan Iklan ({data.summary.websites_with_ads})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="without_ads" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 transition-all duration-200 font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Tanpa Iklan ({data.summary.websites_without_ads})</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="with_ads">
            {renderStatsSection(data.stats.with_ads)}
          </TabsContent>
          
          <TabsContent value="without_ads">
            {renderStatsSection(data.stats.without_ads)}
          </TabsContent>
        </Tabs>

        {/* Enhanced Overall Summary */}
        <div className="mt-8 p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h6 className="font-bold mb-4 text-neutral-900 dark:text-neutral-100">Ringkasan Keseluruhan</h6>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-600 dark:text-neutral-400">Rata-rata Desktop:</span>
              <span className={`text-lg font-bold ${getPerformanceColor(data.summary.overall_avg_desktop)}`}>
                {data.summary.overall_avg_desktop}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-600 dark:text-neutral-400">Rata-rata Mobile:</span>
              <span className={`text-lg font-bold ${getPerformanceColor(data.summary.overall_avg_mobile)}`}>
                {data.summary.overall_avg_mobile}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageSpeedStatsCard;
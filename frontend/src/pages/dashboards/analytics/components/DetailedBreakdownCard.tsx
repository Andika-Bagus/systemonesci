import { useEffect, useState } from 'react';
import { pageSpeedAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Building2, Globe, Target, AlertCircle } from 'lucide-react';

interface WebsiteData {
  id: number;
  url: string;
  holding: string;
  jenis_website: string;
  has_ads: boolean;
  desktop_score: number;
  mobile_score: number;
  overall_score: number;
}

interface BreakdownData {
  holding?: string;
  jenis_website?: string;
  total_websites: number;
  with_ads: number;
  without_ads: number;
  avg_desktop_with_ads: number;
  avg_mobile_with_ads: number;
  avg_desktop_without_ads: number;
  avg_mobile_without_ads: number;
}

interface DetailedBreakdownData {
  top_performing: WebsiteData[];
  worst_performing: WebsiteData[];
  holding_breakdown: BreakdownData[];
  jenis_breakdown: BreakdownData[];
  impact_analysis: {
    potential_improvement: number;
    avg_score_difference_desktop: number;
    avg_score_difference_mobile: number;
    websites_that_could_improve: number;
  };
  period: string;
  period_label: string;
  total_analyzed: number;
}

const DetailedBreakdownCard = () => {
  const [data, setData] = useState<DetailedBreakdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetailedBreakdown();
    
    // Polling setiap 5 menit untuk data real-time
    const interval = setInterval(fetchDetailedBreakdown, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDetailedBreakdown = async () => {
    try {
      setLoading(true);
      const response = await pageSpeedAPI.getDetailedBreakdown('all');
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat detailed breakdown');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderWebsiteList = (websites: WebsiteData[], title: string) => (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <h6 className="font-bold text-neutral-900 dark:text-neutral-100 mb-0">{title}</h6>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {websites.map((website, index) => (
            <div key={website.id} className="flex items-center justify-between p-3 bg-neutral-25 dark:bg-neutral-850 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="flex items-center gap-3 flex-grow min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 font-semibold text-sm shrink-0">
                  #{index + 1}
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{website.url}</span>
                    {website.has_ads && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full font-medium">
                        Iklan
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {website.holding} • {website.jenis_website}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <div className={`text-sm font-bold ${getPerformanceColor(website.desktop_score)} mb-1`}>
                    {website.desktop_score || '-'}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Desktop</div>
                </div>
                <div className="text-center">
                  <div className={`text-sm font-bold ${getPerformanceColor(website.mobile_score)} mb-1`}>
                    {website.mobile_score || '-'}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Mobile</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBreakdownTable = (breakdown: BreakdownData[], type: 'holding' | 'jenis') => (
      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                <h6 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {type === 'holding' ? item.holding : item.jenis_website}
                </h6>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {item.total_websites} website • {item.with_ads} iklan • {item.without_ads} non-iklan
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Dengan Iklan</div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Desktop</span>
                    <span className={`text-sm font-bold ${getScoreColor(item.avg_desktop_with_ads)}`}>
                      {Math.round(item.avg_desktop_with_ads)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(item.avg_desktop_with_ads)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Mobile</span>
                    <span className={`text-sm font-bold ${getScoreColor(item.avg_mobile_with_ads)}`}>
                      {Math.round(item.avg_mobile_with_ads)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(item.avg_mobile_with_ads)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Tanpa Iklan</div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Desktop</span>
                    <span className={`text-sm font-bold ${getScoreColor(item.avg_desktop_without_ads)}`}>
                      {Math.round(item.avg_desktop_without_ads)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(item.avg_desktop_without_ads)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Mobile</span>
                    <span className={`text-sm font-bold ${getScoreColor(item.avg_mobile_without_ads)}`}>
                      {Math.round(item.avg_mobile_without_ads)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(item.avg_mobile_without_ads)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <Card className="card h-full rounded-lg border-0 !p-0 block">
        <CardContent className="card-body p-6 h-full flex flex-col justify-center">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-[44px] h-[44px] rounded-lg inline-flex justify-center items-center text-xl mb-3 bg-blue-100 dark:bg-blue-500/10 border border-blue-400 text-blue-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-200">Loading detailed breakdown...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card h-full rounded-lg border-0 !p-0 block">
        <CardContent className="card-body p-6 h-full flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-[44px] h-[44px] rounded-lg inline-flex justify-center items-center text-xl mb-3 bg-red-100 dark:bg-red-500/10 border border-red-400 text-red-500">
              <AlertCircle className="h-6 w-6" />
            </div>
            <span className="text-center mb-4 text-neutral-600 dark:text-neutral-200">{error}</span>
            <button 
              onClick={fetchDetailedBreakdown}
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
    <Card className="card h-full rounded-lg border-0 !p-0 block">
      <CardContent className="card-body p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center flex-wrap gap-2 justify-between mb-6">
          <h6 className="font-bold text-lg mb-0 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Laporan Detail PageSpeed
          </h6>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="relative overflow-hidden p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h6 className="text-2xl font-bold text-white mb-0">{data.total_analyzed}</h6>
                  <span className="text-blue-100 text-sm font-medium">Total Dianalisis</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden p-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h6 className="text-2xl font-bold text-white mb-0">{data.impact_analysis.potential_improvement}</h6>
                  <span className="text-orange-100 text-sm font-medium">Berpotensi Improve</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden p-6 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h6 className="text-2xl font-bold text-white mb-0">{data.impact_analysis.websites_that_could_improve}</h6>
                  <span className="text-red-100 text-sm font-medium">Perlu Prioritas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden p-6 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h6 className="text-2xl font-bold text-white mb-0">
                    +{Math.round(data.impact_analysis.avg_score_difference_mobile)}
                  </h6>
                  <span className="text-green-100 text-sm font-medium">Potensi Peningkatan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="top_worst" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
            <TabsTrigger 
              value="top_worst" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Top & Worst</span>
              <span className="sm:hidden">T&W</span>
            </TabsTrigger>
            <TabsTrigger 
              value="holding" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Holding</span>
              <span className="sm:hidden">H</span>
            </TabsTrigger>
            <TabsTrigger 
              value="jenis" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Jenis</span>
              <span className="sm:hidden">J</span>
            </TabsTrigger>
            <TabsTrigger 
              value="impact" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Impact</span>
              <span className="sm:hidden">I</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="top_worst" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {renderWebsiteList(data.top_performing, 'Top 10 Performa Terbaik')}
              </div>
              <div>
                {renderWebsiteList(data.worst_performing, 'Top 10 Performa Terburuk')}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="holding" className="mt-6">
            {renderBreakdownTable(data.holding_breakdown, 'holding')}
          </TabsContent>
          
          <TabsContent value="jenis" className="mt-6">
            {renderBreakdownTable(data.jenis_breakdown, 'jenis')}
          </TabsContent>
          
          <TabsContent value="impact" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h6 className="font-bold mb-2 text-blue-700 dark:text-blue-300">Analisis Dampak Iklan</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Website dengan iklan:</span>
                      <span className="font-medium">{data.impact_analysis.potential_improvement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potensi peningkatan desktop:</span>
                      <span className="font-medium text-green-600">
                        +{Math.round(data.impact_analysis.avg_score_difference_desktop)} poin
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potensi peningkatan mobile:</span>
                      <span className="font-medium text-green-600">
                        +{Math.round(data.impact_analysis.avg_score_difference_mobile)} poin
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h6 className="font-bold mb-2 text-orange-700 dark:text-orange-300">Rekomendasi Aksi</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Prioritaskan {data.impact_analysis.websites_that_could_improve} website dengan iklan yang skornya &lt;90</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Evaluasi dampak iklan terhadap performa mobile</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Pertimbangkan optimasi atau penghapusan iklan pada website prioritas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedBreakdownCard;
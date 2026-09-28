import { useEffect, useState, useMemo } from "react";
import { pageSpeedAPI, websiteAPI } from "@/services/api";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Zap, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, Eye, Search, Monitor, Smartphone, TrendingUp, Volume2, VolumeX, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { playCompletionBell } from "@/utils/notificationSound";
import PageHeader from "@/components/PageHeader";
import PageSpeedTrendChart from "./PageSpeedTrendChart";
import ExternalUrlChecker from "./ExternalUrlChecker";
// import { exportPageSpeedReport } from "@/services/exportService"; // Temporarily disabled

interface Website {
  id: number;
  url: string;
  holding: string;
  jenis_website: string;
  has_ads: boolean;
}

interface PageSpeedData {
  id: number;
  website_id: number;
  desktop_performance_score: number | null;
  desktop_accessibility_score: number | null;
  desktop_best_practices_score: number | null;
  desktop_seo_score: number | null;
  desktop_lcp: number | null;
  desktop_fid: number | null;
  desktop_cls: number | null;
  desktop_recommendations: any[];
  mobile_performance_score: number | null;
  mobile_accessibility_score: number | null;
  mobile_best_practices_score: number | null;
  mobile_seo_score: number | null;
  mobile_lcp: number | null;
  mobile_fid: number | null;
  mobile_cls: number | null;
  mobile_recommendations: any[];
  checked_at: string;
}

const PageSpeedMonitor = () => {
  const { user } = useUser();
  const isViewer = user?.role === 'viewer';
  const isHoldingUser = user?.role === 'holding_user';
  const userHolding = user?.holding;
  
  const [websites, setWebsites] = useState<Website[]>([]);
  const [pageSpeedData, setPageSpeedData] = useState<{ [key: number]: PageSpeedData }>({});
  const [checkingIds, setCheckingIds] = useState<Set<number>>(new Set());
  const [_errorIds, setErrorIds] = useState<{ [key: number]: string }>({});
  const [autoCheckInterval, setAutoCheckInterval] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [_lastCompletedId, setLastCompletedId] = useState<number | null>(null); // Track last completed check
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'excellent' | 'good' | 'needs-improvement' | 'poor'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('pageSpeedSoundEnabled');
    return saved !== null ? saved === 'true' : false;
  });
  const [externalCheckerOpen, setExternalCheckerOpen] = useState(false);
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
      case 'Blog':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
    }
  };

  const getPerformanceStatus = (score: number | null): 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'no-data' => {
    if (!score && score !== 0) return 'no-data';
    if (score >= 90) return 'excellent';
    if (score >= 50) return 'good';
    if (score >= 25) return 'needs-improvement';
    return 'poor';
  };

  const filteredWebsites = useMemo(() => {
    let result = websites;

    // Filter by holding for holding_user
    if (isHoldingUser && userHolding) {
      result = result.filter(website => website.holding === userHolding);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(website => 
        website.url.toLowerCase().includes(searchLower) ||
        website.holding.toLowerCase().includes(searchLower) ||
        website.jenis_website.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(website => {
        const data = pageSpeedData[website.id];
        if (!data) return false;
        
        const desktopStatus = getPerformanceStatus(data.desktop_performance_score);
        const mobileStatus = getPerformanceStatus(data.mobile_performance_score);
        
        // Filter by worst status between desktop and mobile
        const statusOrder = ['poor', 'needs-improvement', 'good', 'excellent'];
        const desktopIdx = statusOrder.indexOf(desktopStatus as any);
        const mobileIdx = statusOrder.indexOf(mobileStatus as any);
        
        const worstStatus = desktopIdx < mobileIdx ? desktopStatus : mobileStatus;
        
        return worstStatus === statusFilter;
      });
    }

    return result;
  }, [websites, searchTerm, statusFilter, pageSpeedData, isHoldingUser, userHolding]);

  const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedWebsites = filteredWebsites.slice(startIdx, endIdx);

  useEffect(() => {
    fetchWebsites();
    fetchAllPageSpeeds();
    
    // Refresh websites every 10 seconds to catch newly added websites
    const interval = setInterval(() => {
      fetchWebsites();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoCheckInterval > 0) {
      const interval = setInterval(() => {
        websites.forEach(website => {
          checkPageSpeed(website.id);
        });
      }, autoCheckInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoCheckInterval, websites]);

  const fetchWebsites = async () => {
    try {
      const response = await websiteAPI.getAll();
      setWebsites(response.data);
    } catch (error) {
      // Silently fail on background polling - don't show error toast
      // Only log for debugging
      console.warn('Failed to fetch websites (background sync):', error);
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('pageSpeedSoundEnabled', String(newValue));
    toast.success(newValue ? "Suara notifikasi diaktifkan" : "Suara notifikasi dinonaktifkan");
  };

  const fetchAllPageSpeeds = async () => {
    try {
      const response = await pageSpeedAPI.getAll();
      const dataMap: { [key: number]: PageSpeedData } = {};
      response.data.forEach((item: PageSpeedData) => {
        // Parse JSON strings if they're stored as strings
        if (typeof item.desktop_recommendations === 'string') {
          item.desktop_recommendations = JSON.parse(item.desktop_recommendations || '[]');
        }
        if (typeof item.mobile_recommendations === 'string') {
          item.mobile_recommendations = JSON.parse(item.mobile_recommendations || '[]');
        }
        dataMap[item.website_id] = item;
      });
      setPageSpeedData(dataMap);
    } catch (error) {
      console.error("Error fetching page speeds:", error);
    }
  };

  const checkPageSpeed = async (websiteId: number) => {
    setCheckingIds(prev => new Set(prev).add(websiteId));
    setErrorIds(prev => {
      const newErrors = { ...prev };
      delete newErrors[websiteId];
      return newErrors;
    });

    try {
      const response = await pageSpeedAPI.check(websiteId);
      
      if (response.data) {
        const data = response.data;
        if (typeof data.desktop_recommendations === 'string') {
          data.desktop_recommendations = JSON.parse(data.desktop_recommendations || '[]');
        }
        if (typeof data.mobile_recommendations === 'string') {
          data.mobile_recommendations = JSON.parse(data.mobile_recommendations || '[]');
        }
        
        if (data.desktop_performance_score === null && data.mobile_performance_score === null) {
          setErrorIds(prev => ({
            ...prev,
            [websiteId]: "Gagal mengambil data dari PageSpeed API. Periksa URL website atau coba lagi nanti."
          }));
          toast.error("Gagal mengecek PageSpeed - API tidak merespons");
        } else {
          setPageSpeedData(prev => ({
            ...prev,
            [data.website_id]: data
          }));
          
          // Mark as last completed
          setLastCompletedId(websiteId);
          
          // ALWAYS play bell sound on completion (no toggle check)
          playCompletionBell();
          
          // Trigger notification dropdown to refresh LANGSUNG
          window.dispatchEvent(new Event('refreshNotifications'));
          
          toast.success("Analysis complete. Website performance report is ready");
          
          // Auto-open detail modal ONLY if this is the latest completed check
          setTimeout(() => {
            setLastCompletedId(current => {
              // Only open modal if this websiteId is still the latest
              if (current === websiteId) {
                setExpandedId(websiteId);
              }
              return current;
            });
          }, 500);
        }
      }
    } catch (error: any) {
      let errorMsg = "Gagal mengecek PageSpeed";
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMsg = "Timeout - pemeriksaan memakan waktu terlalu lama";
      } else if (error.response?.status === 401) {
        errorMsg = "Sesi Anda telah berakhir, silakan login kembali";
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorIds(prev => ({
        ...prev,
        [websiteId]: errorMsg
      }));
    } finally {
      setCheckingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(websiteId);
        return newSet;
      });
    }
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

  // Temporarily disabled - Export PDF function
  // const handleExportPDF = async (websiteId: number, websiteUrl: string) => {
  //   setExportingIds(prev => new Set(prev).add(websiteId));
  //   try {
  //     await exportPageSpeedReport(websiteId, websiteUrl);
  //     toast.success("PDF berhasil diunduh");
  //   } catch (error) {
  //     console.error('Export error:', error);
  //     toast.error("Gagal mengunduh PDF");
  //   } finally {
  //     setExportingIds(prev => {
  //       const newSet = new Set(prev);
  //       newSet.delete(websiteId);
  //       return newSet;
  //     });
  //   }
  // };

  const getScoreColor = (score: number | null) => {
    if (!score && score !== 0) return "text-neutral-600";
    if (score >= 90) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number | null) => {
    if (!score && score !== 0) return "bg-neutral-100";
    if (score >= 90) return "bg-green-100";
    if (score >= 50) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getVisiblePages = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const ScoreCard = ({ label, score }: { label: string; score: number | null }) => {
    const getGradient = () => {
      if (score === null) return "from-slate-500 to-slate-600";
      if (score >= 90) return "from-emerald-500 to-emerald-600";
      if (score >= 50) return "from-amber-500 to-amber-600";
      return "from-rose-500 to-rose-600";
    };

    const getStatusText = () => {
      if (score === null) return "No data";
      if (score >= 90) return "Excellent";
      if (score >= 50) return "Good";
      return "Needs work";
    };

    return (
      <div className={`p-3 rounded-lg bg-gradient-to-br ${getGradient()} text-white shadow-md overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-medium text-white/80 mb-1 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold !text-white" style={{ color: 'white !important' }}>
            {score !== null ? score : "-"}
          </p>
          <p className="text-[10px] text-white/80 mt-1">{getStatusText()}</p>
        </div>
      </div>
    );
  };

  const MetricCard = ({ label, value, unit = "" }: { label: string; value: number | null; unit?: string }) => {
    const getGradient = () => {
      if (label === "LCP") {
        if (value === null) return "from-slate-500 to-slate-600";
        if (value < 2.5) return "from-emerald-500 to-emerald-600";
        if (value < 4) return "from-amber-500 to-amber-600";
        return "from-rose-500 to-rose-600";
      }
      if (label === "CLS") {
        if (value === null) return "from-slate-500 to-slate-600";
        if (value < 0.1) return "from-emerald-500 to-emerald-600";
        if (value < 0.25) return "from-amber-500 to-amber-600";
        return "from-rose-500 to-rose-600";
      }
      return "from-blue-500 to-blue-600";
    };

    const getStatusText = () => {
      if (value === null) return "No data";
      if (label === "LCP") {
        if (value < 2.5) return "Good";
        if (value < 4) return "Needs improvement";
        return "Poor";
      }
      if (label === "CLS") {
        if (value < 0.1) return "Good";
        if (value < 0.25) return "Needs improvement";
        return "Poor";
      }
      return "";
    };

    return (
      <div className={`p-3 rounded-lg bg-gradient-to-br ${getGradient()} text-white shadow-md overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-medium text-white/80 mb-1 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold !text-white" style={{ color: 'white !important' }}>
            {value !== null ? `${value}${unit}` : "-"}
          </p>
          {getStatusText() && (
            <p className="text-[10px] text-white/80 mt-1">{getStatusText()}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Breadcrumb */}
      <PageHeader
        icon={Zap}
        title={`PageSpeed Monitor ${isHoldingUser && userHolding ? `- ${userHolding}` : ''}`}
        subtitle={isHoldingUser ? `Monitor performa website ${userHolding}` : 'Pantau performa website Anda'}
        iconColor="bg-amber-500"
        iconShadow="shadow-amber-200"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="h-9 w-9 rounded-full"
          title={soundEnabled ? "Nonaktifkan suara notifikasi" : "Aktifkan suara notifikasi"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-green-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {/* Auto Check Settings - Hidden for holding users */}
        {!isViewer && !isHoldingUser && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pemeriksaan Otomatis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={autoCheckInterval === 0 ? "default" : "outline"}
                onClick={() => setAutoCheckInterval(0)}
                size="sm"
              >
                Manual
              </Button>
              <Button
                variant={autoCheckInterval === 600 ? "default" : "outline"}
                onClick={() => setAutoCheckInterval(600)}
                size="sm"
              >
                10 Min
              </Button>
              <Button
                variant={autoCheckInterval === 1800 ? "default" : "outline"}
                onClick={() => setAutoCheckInterval(1800)}
                size="sm"
              >
                30 Min
              </Button>
              <Button
                variant={autoCheckInterval === 3600 ? "default" : "outline"}
                onClick={() => setAutoCheckInterval(3600)}
                size="sm"
              >
                1 Jam
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => setExternalCheckerOpen(true)}
              >
                <Globe size={16} className="mr-2" />
                Cek URL Eksternal
              </Button>
              {/* Comprehensive Report & Debug Data - Hidden for now */}
              {/* <Link to="/page-speed/comprehensive-report">
                <Button variant="outline" size="sm" className="ml-2">
                  <Download size={16} className="mr-2" />
                  Comprehensive Report
                </Button>
              </Link>
              <Link to="/page-speed/debug">
                <Button variant="outline" size="sm" className="ml-2">
                  <Bug size={16} className="mr-2" />
                  Debug Data
                </Button>
              </Link> */}
            </div>
          </CardContent>
        </Card>
        )}

        {/* Websites Table */}
        <Card>
          <CardHeader className="border-b border-neutral-200 dark:border-neutral-700 px-4 sm:px-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Daftar Website
              </CardTitle>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total: {websites.length} website</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
        {/* Search Box */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari website, holding, jenis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
                />
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
                  variant={statusFilter === 'excellent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('excellent')}
                  className={`text-xs ${statusFilter === 'excellent' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                >
                  ✓ Excellent (90+)
                </Button>
                <Button
                  variant={statusFilter === 'good' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('good')}
                  className={`text-xs ${statusFilter === 'good' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}`}
                >
                  ◐ Good (50-89)
                </Button>
                <Button
                  variant={statusFilter === 'needs-improvement' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('needs-improvement')}
                  className={`text-xs ${statusFilter === 'needs-improvement' ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}`}
                >
                  ⚠ Needs Improvement (25-49)
                </Button>
                <Button
                  variant={statusFilter === 'poor' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('poor')}
                  className={`text-xs ${statusFilter === 'poor' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                >
                  ✗ Poor (&lt;25)
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <TableHead className="w-8 sm:w-12 font-bold text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">No</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 min-w-[200px] text-xs sm:text-sm">URL</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 min-w-[120px] text-xs sm:text-sm">Holding</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 min-w-[100px] text-xs sm:text-sm">Jenis</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300 min-w-[60px] text-xs sm:text-sm">Ads</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300 min-w-[70px] text-xs sm:text-sm">Desktop</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300 min-w-[70px] text-xs sm:text-sm">Mobile</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300 min-w-[100px] text-xs sm:text-sm">Dicek</TableHead>
                    <TableHead className="text-right w-16 sm:w-24 font-bold text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWebsites.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                        <p className="text-sm">{searchTerm ? 'Tidak ada website yang sesuai dengan pencarian' : 'Tidak ada data website'}</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedWebsites.map((website, index) => {
                      const data = pageSpeedData[website.id];
                      return (
                        <TableRow key={website.id} className="text-sm border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                          <TableCell className="font-medium text-neutral-700 dark:text-neutral-300 w-8">{startIdx + index + 1}</TableCell>
                          <TableCell className="flex-1">
                            <a
                              href={website.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-medium text-xs"
                            >
                              {website.url}
                            </a>
                          </TableCell>
                          <TableCell className="text-neutral-600 dark:text-neutral-400 w-auto">
                            <span className={`inline-block text-center px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getHoldingColor(website.holding)}`}>
                              {website.holding}
                            </span>
                          </TableCell>
                          <TableCell className="text-neutral-600 dark:text-neutral-400 w-auto">
                            <span className={`inline-block text-center px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getJenisColor(website.jenis_website)}`}>
                              {website.jenis_website}
                            </span>
                          </TableCell>
                          <TableCell className="text-center w-12">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block ${website.has_ads ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                              {website.has_ads ? 'Ya' : 'Tidak'}
                            </span>
                          </TableCell>
                          <TableCell className="text-center w-14">
                            {data ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getScoreBgColor(data.desktop_performance_score)} ${getScoreColor(data.desktop_performance_score)}`}>
                                {data.desktop_performance_score}
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center w-14">
                            {data ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getScoreBgColor(data.mobile_performance_score)} ${getScoreColor(data.mobile_performance_score)}`}>
                                {data.mobile_performance_score}
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-xs text-neutral-600 dark:text-neutral-400 w-16 whitespace-nowrap">
                            {data ? (
                              <span>{formatDate(data.checked_at)}</span>
                            ) : (
                              <span className="text-neutral-400">Belum</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right w-auto">
                            <div className="flex gap-1 justify-end items-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 flex-shrink-0"
                                onClick={() => setExpandedId(expandedId === website.id ? null : website.id)}
                                title="Lihat Detail"
                              >
                                <Eye size={14} />
                              </Button>
                              {/* Download PDF Button - Temporarily Disabled */}
                              {/* {data && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleExportPDF(website.id, website.url)}
                                  disabled={exportingIds.has(website.id)}
                                  title="Unduh PDF"
                                >
                                  {exportingIds.has(website.id) ? (
                                    <RefreshCw size={14} className="animate-spin" />
                                  ) : (
                                    <Download size={14} />
                                  )}
                                </Button>
                              )} */}
                              <Button
                                variant="default"
                                size="sm"
                                className="h-8 px-2 flex-shrink-0"
                                onClick={() => checkPageSpeed(website.id)}
                                disabled={checkingIds.has(website.id) || isViewer}
                                title={isViewer ? "Viewers cannot run checks" : "Jalankan pemeriksaan PageSpeed"}
                              >
                                {checkingIds.has(website.id) ? (
                                  <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                  <Zap size={14} />
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
              <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground text-center md:text-left">
                  Menampilkan {Math.min(startIdx + 1, filteredWebsites.length)} - {Math.min(endIdx, filteredWebsites.length)} dari {filteredWebsites.length} data
                  {searchTerm && ` (dari ${websites.length} total)`}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </Button>
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {getVisiblePages(currentPage, totalPages).map((page, idx) => (
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-muted-foreground">...</span>
                      ) : (
                        <Button
                          key={`page-${page}`}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setCurrentPage(page as number)}
                        >
                          {page}
                        </Button>
                      )
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight size={16} className="ml-1 sm:ml-0" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {expandedId && pageSpeedData[expandedId] && (
          <Dialog open={expandedId !== null} onOpenChange={() => setExpandedId(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  <a href={websites.find(w => w.id === expandedId)?.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                    {websites.find(w => w.id === expandedId)?.url}
                  </a>
                </DialogTitle>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  Terakhir dicek: {new Date(pageSpeedData[expandedId].checked_at).toLocaleString("id-ID")}
                </p>
              </DialogHeader>

              <Tabs defaultValue="desktop" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="desktop" className="flex items-center gap-2">
                    <Monitor size={16} />
                    Desktop
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="flex items-center gap-2">
                    <Smartphone size={16} />
                    Mobile
                  </TabsTrigger>
                  <TabsTrigger value="trend" className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    Trend
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="desktop" className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Performance Scores</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <ScoreCard label="Performance" score={pageSpeedData[expandedId].desktop_performance_score} />
                      <ScoreCard label="Accessibility" score={pageSpeedData[expandedId].desktop_accessibility_score} />
                      <ScoreCard label="Best Practices" score={pageSpeedData[expandedId].desktop_best_practices_score} />
                      <ScoreCard label="SEO" score={pageSpeedData[expandedId].desktop_seo_score} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Core Web Vitals</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <MetricCard label="LCP" value={pageSpeedData[expandedId].desktop_lcp} unit="s" />
                      <MetricCard label="FID" value={pageSpeedData[expandedId].desktop_fid} unit="ms" />
                      <MetricCard label="CLS" value={pageSpeedData[expandedId].desktop_cls} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mobile" className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Performance Scores</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <ScoreCard label="Performance" score={pageSpeedData[expandedId].mobile_performance_score} />
                      <ScoreCard label="Accessibility" score={pageSpeedData[expandedId].mobile_accessibility_score} />
                      <ScoreCard label="Best Practices" score={pageSpeedData[expandedId].mobile_best_practices_score} />
                      <ScoreCard label="SEO" score={pageSpeedData[expandedId].mobile_seo_score} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Core Web Vitals</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <MetricCard label="LCP" value={pageSpeedData[expandedId].mobile_lcp} unit="s" />
                      <MetricCard label="FID" value={pageSpeedData[expandedId].mobile_fid} unit="ms" />
                      <MetricCard label="CLS" value={pageSpeedData[expandedId].mobile_cls} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="trend" className="space-y-6">
                  <PageSpeedTrendChart websiteId={expandedId} />
                </TabsContent>

                <TabsContent value="debug" className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-4">🐛 Debug Information</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-white rounded border">
                        <h4 className="font-semibold text-green-700 mb-2">Desktop Metrics:</h4>
                        <p className="text-sm"><strong>Performance:</strong> {pageSpeedData[expandedId].desktop_performance_score || 'NULL'}</p>
                        <p className="text-sm"><strong>Accessibility:</strong> {pageSpeedData[expandedId].desktop_accessibility_score || 'NULL'}</p>
                        <p className="text-sm"><strong>Best Practices:</strong> {pageSpeedData[expandedId].desktop_best_practices_score || 'NULL'}</p>
                        <p className="text-sm"><strong>SEO:</strong> {pageSpeedData[expandedId].desktop_seo_score || 'NULL'}</p>
                        <p className="text-sm"><strong>LCP:</strong> {pageSpeedData[expandedId].desktop_lcp || 'NULL'}</p>
                        <p className="text-sm"><strong>FID:</strong> {pageSpeedData[expandedId].desktop_fid || 'NULL'}</p>
                        <p className="text-sm"><strong>CLS:</strong> {pageSpeedData[expandedId].desktop_cls || 'NULL'}</p>
                      </div>
                      <div className="p-4 bg-white rounded border">
                        <h4 className="font-semibold text-green-700 mb-2">Mobile Metrics:</h4>
                        <p className="text-sm"><strong>Performance:</strong> {pageSpeedData[expandedId].mobile_performance_score || 'NULL'}</p>
                        <p className="text-sm"><strong>Accessibility:</strong> {pageSpeedData[expandedId].mobile_accessibility_score || 'NULL'}</p>
                        <p className="text-sm"><strong>Best Practices:</strong> {pageSpeedData[expandedId].mobile_best_practices_score || 'NULL'}</p>
                        <p className="text-sm"><strong>SEO:</strong> {pageSpeedData[expandedId].mobile_seo_score || 'NULL'}</p>
                        <p className="text-sm"><strong>LCP:</strong> {pageSpeedData[expandedId].mobile_lcp || 'NULL'}</p>
                        <p className="text-sm"><strong>FID:</strong> {pageSpeedData[expandedId].mobile_fid || 'NULL'}</p>
                        <p className="text-sm"><strong>CLS:</strong> {pageSpeedData[expandedId].mobile_cls || 'NULL'}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded border">
                      <h4 className="font-semibold text-blue-700 mb-2">Metadata:</h4>
                      <p className="text-sm"><strong>Website ID:</strong> {expandedId}</p>
                      <p className="text-sm"><strong>URL:</strong> {websites.find(w => w.id === expandedId)?.url}</p>
                      <p className="text-sm"><strong>Holding:</strong> {websites.find(w => w.id === expandedId)?.holding}</p>
                      <p className="text-sm"><strong>Jenis Website:</strong> {websites.find(w => w.id === expandedId)?.jenis_website}</p>
                      <p className="text-sm"><strong>Has Ads:</strong> {websites.find(w => w.id === expandedId)?.has_ads ? 'Yes' : 'No'}</p>
                      <p className="text-sm"><strong>Last Checked:</strong> {new Date(pageSpeedData[expandedId].checked_at).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                </TabsContent>

              </Tabs>
            </DialogContent>
          </Dialog>
        )}
        
        {/* External URL Checker Modal */}
        <ExternalUrlChecker 
          isOpen={externalCheckerOpen}
          onClose={() => setExternalCheckerOpen(false)}
        />
      </div>
    </>
  );
};

export default PageSpeedMonitor;

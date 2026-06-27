import { useState, useEffect } from 'react';

import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Activity, AlertCircle, CheckCircle, Clock, Zap, ChevronLeft, ChevronRight, RefreshCw, Eye, Volume2, VolumeX } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import api from '@/services/api';
import { toast } from 'sonner';
import UptimeDetailModal from './UptimeDetailModal';
import MiniUptimeChart from '@/components/charts/MiniUptimeChart';

interface Website {
  id: number;
  url: string;
  holding: string;
  jenis_website: string;
  letak_server: string;
  pic: string;
}

interface UptimeStatus {
  website_id: number;
  url: string;
  status: 'up' | 'down' | 'unknown';
  http_code: number | null;
  response_time: number | null;
  last_checked: string | null;
}

export default function UptimeMonitor() {
  const { user } = useUser();
  const isViewer = user?.role === 'viewer';
  
  const [websites, setWebsites] = useState<Website[]>([]);
  const [uptimeStatuses, setUptimeStatuses] = useState<Record<number, UptimeStatus>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [checkingWebsites, setCheckingWebsites] = useState<Set<number>>(new Set());
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [holdingFilter, setHoldingFilter] = useState<string>('all');
  const [serverFilter, setServerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previousDownCount, setPreviousDownCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    // Load sound preference from localStorage
    const saved = localStorage.getItem('uptime_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [downWebsites, setDownWebsites] = useState<UptimeStatus[]>([]);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [chartRefreshTime, setChartRefreshTime] = useState<number>(Date.now());

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
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
    }
  };

  useEffect(() => {
    fetchWebsites();
    fetchAllUptimeStatus();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAllUptimeStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Save sound preference to localStorage
  useEffect(() => {
    localStorage.setItem('uptime_sound_enabled', soundEnabled.toString());
  }, [soundEnabled]);

  const fetchWebsites = async () => {
    try {
      const response = await api.get('/websites');
      setWebsites(response.data);
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast.error('Gagal memuat data website');
    }
  };

  const fetchAllUptimeStatus = async () => {
    try {
      const response = await api.get('/uptime/all-status');
      const statusMap: Record<number, UptimeStatus> = {};
      response.data.forEach((status: UptimeStatus) => {
        statusMap[status.website_id] = status;
      });
      
      // Get current down websites
      const currentDownWebsites = Object.values(statusMap).filter(s => s.status === 'down');
      const currentDownCount = currentDownWebsites.length;
      
      // Get current sound setting from localStorage to ensure latest value
      const isSoundEnabled = localStorage.getItem('uptime_sound_enabled') === 'true';
      
      // If down count increased, trigger alert
      if (currentDownCount > previousDownCount && previousDownCount >= 0) {
        if (isSoundEnabled) {
          playAlertSound();
        }
        displayDownAlert(currentDownWebsites);
      }
      
      // Update state
      setPreviousDownCount(currentDownCount);
      setDownWebsites(currentDownWebsites);
      setUptimeStatuses(statusMap);
    } catch (error) {
      console.error('Error fetching uptime status:', error);
    }
  };

  const playAlertSound = () => {
    try {
      // Create audio context for alert beep first
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // Alert frequency
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  };

  const speakAlert = (downWebsitesList: UptimeStatus[]) => {
    try {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Create speech message
        let message = '';
        if (downWebsitesList.length === 1) {
          const websiteName = downWebsitesList[0].url.replace('https://', '').replace('http://', '').replace('www.', '');
          message = `Peringatan! Website ${websiteName} sedang down`;
        } else {
          message = `Peringatan! ${downWebsitesList.length} website sedang down`;
        }
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'id-ID'; // Indonesian language
        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1.0; // Normal pitch
        utterance.volume = 1.0; // Full volume
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error speaking alert:', error);
    }
  };

  const displayDownAlert = (downWebsitesList: UptimeStatus[]) => {
    if (downWebsitesList.length === 0) return;
    
    const websiteList = downWebsitesList.map(w => w.url).join(', ');
    
    // Toast notification
    toast.error(`⚠️ Website Down Alert!\n${downWebsitesList.length} website(s) are currently down`, {
      duration: 10000,
      position: 'top-center',
    });
    
    // Browser notification (if permission granted)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 Website Down Alert!', {
        body: `${downWebsitesList.length} website(s) are down: ${websiteList}`,
        icon: '/favicon.ico',
        requireInteraction: true,
      });
    }
    
    // Speak the alert only if sound is enabled
    const isSoundEnabled = localStorage.getItem('uptime_sound_enabled') === 'true';
    if (isSoundEnabled) {
      speakAlert(downWebsitesList);
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('uptime_sound_enabled', newValue.toString());
    toast.success(newValue ? 'Suara alert diaktifkan' : 'Suara alert dimatikan');
  };

  const checkUptime = async (websiteId: number) => {
    setCheckingWebsites(prev => new Set(prev).add(websiteId));
    
    try {
      console.log('🔵 Starting uptime check for websiteId:', websiteId);
      console.log('🔵 Current date before check:', new Date().toDateString(), 'Day:', new Date().getDate());
      
      const response = await api.post(`/uptime/check/${websiteId}`);
      console.log('✅ Uptime check response:', response.data);
      toast.success('Uptime check berhasil!');
      
      // Refresh status after check
      await fetchAllUptimeStatus();
      console.log('✅ Status refreshed');
      
      // AGGRESSIVE CHART REFRESH - Multiple waves to ensure update
      const baseTime = Date.now();
      const currentStatus = response.data?.status || 'unknown';
      
      console.log('🚀 AGGRESSIVE CHART REFRESH after uptime check for websiteId:', websiteId);
      console.log('🚀 Current status after check:', currentStatus);
      console.log('🚀 Current date after check:', new Date().toDateString(), 'Day:', new Date().getDate());
      
      // Wave 1: Immediate refresh
      setChartRefreshTime(baseTime);
      console.log('🌊 Wave 1 - Immediate refresh:', baseTime);
      
      // Wave 2: Short delay refresh
      setTimeout(() => {
        const wave2Time = Date.now();
        setChartRefreshTime(wave2Time);
        console.log('🌊 Wave 2 - Short delay refresh:', wave2Time);
      }, 50);
      
      // Wave 3: Medium delay refresh to ensure all components catch up
      setTimeout(() => {
        const wave3Time = Date.now();
        setChartRefreshTime(wave3Time);
        console.log('🌊 Wave 3 - Final refresh wave:', wave3Time);
        console.log('🎯 All charts should now show TODAY:', new Date().getDate(), 'blocks');
      }, 200);
      
      // Check if the website is down after check and play alert
      // Get current sound setting from localStorage to ensure latest value
      const isSoundEnabled = localStorage.getItem('uptime_sound_enabled') === 'true';
      
      if (currentStatus === 'down' && isSoundEnabled) {
        // Get website info
        const website = websites.find(w => w.id === websiteId);
        if (website) {
          const downWebsite: UptimeStatus = {
            website_id: websiteId,
            url: website.url,
            status: 'down',
            http_code: response.data?.http_code || null,
            response_time: response.data?.response_time || null,
            last_checked: response.data?.checked_at || new Date().toISOString(),
          };
          
          // Play beep and speak alert
          playAlertSound();
          setTimeout(() => {
            speakAlert([downWebsite]);
          }, 400);
        }
      }
    } catch (error: any) {
      console.error('Error checking uptime:', error);
      toast.error(error.response?.data?.error || 'Gagal melakukan uptime check');
    } finally {
      setCheckingWebsites(prev => {
        const newSet = new Set(prev);
        newSet.delete(websiteId);
        return newSet;
      });
    }
  };

  const checkAllUptime = async () => {
    setIsCheckingAll(true);
    toast.info(`Memulai check uptime untuk ${websites.length} website...`, {
      duration: 3000,
    });

    let successCount = 0;
    let failCount = 0;

    // Check all websites sequentially to avoid overwhelming the server
    for (const website of websites) {
      try {
        await api.post(`/uptime/check/${website.id}`);
        successCount++;
      } catch (error) {
        console.error(`Error checking ${website.url}:`, error);
        failCount++;
      }
    }

    // Refresh all statuses after checking
    await fetchAllUptimeStatus();
    
    // AGGRESSIVE CHART REFRESH - Multiple waves for check all
    const baseTime = Date.now();
    console.log('🚀 AGGRESSIVE REFRESH ALL CHARTS after checking all websites');
    console.log('🚀 Base refresh timestamp:', baseTime);
    
    // Wave 1: Immediate refresh
    setChartRefreshTime(baseTime);
    console.log('🌊 Wave 1 - Immediate refresh all:', baseTime);
    
    // Wave 2: Short delay
    setTimeout(() => {
      const wave2Time = Date.now();
      setChartRefreshTime(wave2Time);
      console.log('🌊 Wave 2 - Short delay refresh all:', wave2Time);
    }, 100);
    
    // Wave 3: Medium delay
    setTimeout(() => {
      const wave3Time = Date.now();
      setChartRefreshTime(wave3Time);
      console.log('🌊 Wave 3 - Medium delay refresh all:', wave3Time);
    }, 250);
    
    // Wave 4: Final wave to ensure all charts catch up
    setTimeout(() => {
      const finalTime = Date.now();
      setChartRefreshTime(finalTime);
      console.log('🌊 Wave 4 - FINAL refresh all charts:', finalTime);
      console.log('🎯 ALL CHARTS should now show TODAY:', new Date().getDate(), 'blocks');
    }, 500);

    setIsCheckingAll(false);

    // Show summary toast
    if (failCount === 0) {
      toast.success(`✅ Berhasil check ${successCount} website!`, {
        duration: 5000,
      });
    } else {
      toast.warning(`Check selesai: ${successCount} berhasil, ${failCount} gagal`, {
        duration: 5000,
      });
    }
  };

  const getStatusBadge = (status: 'up' | 'down' | 'unknown') => {
    switch (status) {
      case 'up':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            UP
          </Badge>
        );
      case 'down':
        return (
          <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            DOWN
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-500">
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

  const formatLastChecked = (dateString: string | null) => {
    if (!dateString) return 'Belum pernah dicek';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      website.holding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      website.jenis_website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (website.letak_server && website.letak_server.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesHolding = holdingFilter === 'all' || website.holding === holdingFilter;
    const matchesServer = serverFilter === 'all' || website.letak_server === serverFilter;
    
    const websiteStatus = uptimeStatuses[website.id]?.status || 'unknown';
    const matchesStatus = statusFilter === 'all' || websiteStatus === statusFilter;
    
    return matchesSearch && matchesHolding && matchesServer && matchesStatus;
  });

  // Get unique holdings and servers for filter options
  const uniqueHoldings = Array.from(new Set(websites.map(w => w.holding))).sort();
  const uniqueServers = Array.from(new Set(websites.map(w => w.letak_server).filter(Boolean))).sort();

  // Pagination
  const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWebsites = filteredWebsites.slice(startIndex, endIndex);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, holdingFilter, serverFilter, statusFilter]);

  const openDetailModal = (websiteId: number) => {
    setSelectedWebsiteId(websiteId);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <PageHeader
        icon={Activity}
        title="Uptime Monitor"
        subtitle="Monitor status dan availability website"
        iconColor="bg-emerald-600"
        iconShadow="shadow-emerald-200"
      >
        <Button
          size="icon"
          variant="outline"
          onClick={toggleSound}
          className="h-9 w-9 rounded-full"
          title={soundEnabled ? 'Matikan suara alert' : 'Aktifkan suara alert'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-green-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {/* Auto-Check Info Banner */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Auto-Check Scheduler
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Sistem akan otomatis check uptime semua website <strong>setiap 5 menit</strong>. 
                  Data terakhir di-update: <strong>{Object.keys(uptimeStatuses).length > 0 ? 'Aktif' : 'Belum ada data'}</strong>
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-blue-700 dark:text-blue-300">Scheduler Running</span>
                  </div>
                  <span className="text-blue-400">•</span>
                  <span className="text-blue-700 dark:text-blue-300">
                    Total Checks: {Object.keys(uptimeStatuses).length} website
                  </span>
                  {downWebsites.length > 0 && (
                    <>
                      <span className="text-blue-400">•</span>
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">
                        {downWebsites.length} Down
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Websites Card */}
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xs font-medium text-white/80 mb-1">Total Websites</p>
              <p className="text-2xl font-bold !text-white" style={{ color: 'white !important' }}>{websites.length}</p>
            </CardContent>
          </Card>

          {/* Online Card */}
          <Card className="border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xs font-medium text-white/80 mb-1">Online</p>
              <p className="text-2xl font-bold !text-white" style={{ color: 'white !important' }}>
                {Object.values(uptimeStatuses).filter(s => s.status === 'up').length}
              </p>
            </CardContent>
          </Card>

          {/* Offline Card */}
          <Card className="border-0 bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xs font-medium text-white/80 mb-1">Offline</p>
              <p className="text-2xl font-bold !text-white" style={{ color: 'white !important' }}>
                {Object.values(uptimeStatuses).filter(s => s.status === 'down').length}
              </p>
            </CardContent>
          </Card>

          {/* Avg Response Card */}
          <Card className="border-0 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xs font-medium text-white/80 mb-1">Avg Response</p>
              <p className="text-2xl font-bold !text-white" style={{ color: 'white !important' }}>
                {(() => {
                  const times = Object.values(uptimeStatuses)
                    .filter(s => s.status === 'up' && s.response_time)
                    .map(s => s.response_time!);
                  const avg = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
                  return formatResponseTime(Math.round(avg));
                })()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Websites Table */}
        <Card>
          <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Daftar Website
              </CardTitle>
              <Button
                onClick={checkAllUptime}
                disabled={isCheckingAll || websites.length === 0}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isCheckingAll ? 'animate-spin' : ''}`} />
                {isCheckingAll ? `Checking... (${websites.length} websites)` : 'Check All Websites'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Search Box & Filters */}
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

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Holding Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Holding</label>
                  <select
                    value={holdingFilter}
                    onChange={(e) => setHoldingFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Semua Holding</option>
                    {uniqueHoldings.map(holding => (
                      <option key={holding} value={holding}>{holding}</option>
                    ))}
                  </select>
                </div>

                {/* Server Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Letak Server</label>
                  <select
                    value={serverFilter}
                    onChange={(e) => setServerFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Semua Server</option>
                    {uniqueServers.map(server => (
                      <option key={server} value={server}>{server}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Semua Status</option>
                    <option value="up">🟢 UP</option>
                    <option value="down">🔴 DOWN</option>
                    <option value="unknown">⚪ Unknown</option>
                  </select>
                </div>

                {/* Reset Button */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 invisible">Reset</label>
                  {(holdingFilter !== 'all' || serverFilter !== 'all' || statusFilter !== 'all') ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setHoldingFilter('all');
                        setServerFilter('all');
                        setStatusFilter('all');
                      }}
                      className="w-full"
                    >
                      Reset Filter
                    </Button>
                  ) : (
                    <div className="h-10"></div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto -mx-6 px-6">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <TableHead className="w-12 font-bold text-neutral-700 dark:text-neutral-300">No</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">URL</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Holding</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Jenis</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Status</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Response Time</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300 w-72">Uptime Chart (Bulan ini)</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Last Check</TableHead>
                    <TableHead className="text-right w-48 font-bold text-neutral-700 dark:text-neutral-300">Aksi</TableHead>
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
                      const status = uptimeStatuses[website.id];
                      const isChecking = checkingWebsites.has(website.id);

                      return (
                        <TableRow key={website.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                          <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                          <TableCell>
                            <a 
                              href={website.url.startsWith('http') ? website.url : `https://${website.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {website.url}
                            </a>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-block min-w-[140px] text-center px-3 py-1 rounded-full text-xs font-semibold ${getHoldingColor(website.holding)}`}>
                              {website.holding}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-block min-w-[100px] text-center px-3 py-1 rounded-full text-xs font-semibold ${getJenisColor(website.jenis_website)}`}>
                              {website.jenis_website}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {status ? getStatusBadge(status.status) : getStatusBadge('unknown')}
                          </TableCell>
                          <TableCell className="text-center">
                            {status ? formatResponseTime(status.response_time) : '-'}
                          </TableCell>
                          <TableCell className="text-center p-2">
                            <div className="w-64 mx-auto">
                              <MiniUptimeChart 
                                key={`${website.id}-${chartRefreshTime}`}
                                websiteId={website.id} 
                                forceRefresh={chartRefreshTime}
                                currentStatus={status?.status || 'unknown'}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-xs text-muted-foreground">
                            {status ? formatLastChecked(status.last_checked) : 'Belum pernah dicek'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => checkUptime(website.id)}
                                disabled={isChecking || isViewer}
                                title={isViewer ? "Viewers cannot run checks" : "Check Uptime"}
                              >
                                <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                              </Button>
                              <Button
                                size="icon"
                                onClick={() => openDetailModal(website.id)}
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
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
            {filteredWebsites.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredWebsites.length)} dari {filteredWebsites.length} website
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedWebsiteId && (
        <UptimeDetailModal
          websiteId={selectedWebsiteId}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedWebsiteId(null);
          }}
        />
      )}
    </>
  );
}

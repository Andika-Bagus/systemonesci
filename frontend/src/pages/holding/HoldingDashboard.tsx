import { useEffect, useState, useMemo } from "react";
import { pageSpeedAPI, websiteAPI } from "@/services/api";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Smartphone, 
  Search, 
  AlertCircle,
  BarChart3,
  Globe,
  Activity
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

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
  mobile_performance_score: number | null;
  checked_at: string;
}

const HoldingDashboard = () => {
  const { user } = useUser();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [pageSpeedData, setPageSpeedData] = useState<{ [key: number]: PageSpeedData }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'excellent' | 'good' | 'needs-improvement' | 'poor'>('all');
  
  // Get holding from user (holding_user role)
  const userHolding = user?.holding || "Ridwan Institute"; // Fallback untuk testing

  // Color functions
  const getHoldingColor = (holding: string) => {
    const holdingColors: Record<string, string> = {
      'Ridwan Institute': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
      'Publikasi Indonesia': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      'Green Publisher': 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
      'Riviera Publishing': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
      'International Journal Labs': 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400',
      'Al-Makki Publisher': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
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

  const getPerformanceStatus = (score: number | null): 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'no-data' => {
    if (!score && score !== 0) return 'no-data';
    if (score >= 90) return 'excellent';
    if (score >= 50) return 'good';
    if (score >= 25) return 'needs-improvement';
    return 'poor';
  };

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

  // Filter websites hanya untuk holding ini
  const holdingWebsites = useMemo(() => {
    return websites.filter(website => website.holding === userHolding);
  }, [websites, userHolding]);

  // Filter berdasarkan search dan status
  const filteredWebsites = useMemo(() => {
    let result = holdingWebsites;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(website => 
        website.url.toLowerCase().includes(searchLower) ||
        website.jenis_website.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(website => {
        const data = pageSpeedData[website.id];
        if (!data) return false;
        
        const desktopStatus = getPerformanceStatus(data.desktop_performance_score);
        const mobileStatus = getPerformanceStatus(data.mobile_performance_score);
        
        const statusOrder = ['poor', 'needs-improvement', 'good', 'excellent'];
        const desktopIdx = statusOrder.indexOf(desktopStatus as any);
        const mobileIdx = statusOrder.indexOf(mobileStatus as any);
        
        const worstStatus = desktopIdx < mobileIdx ? desktopStatus : mobileStatus;
        
        return worstStatus === statusFilter;
      });
    }

    return result;
  }, [holdingWebsites, searchTerm, statusFilter, pageSpeedData]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = holdingWebsites.length;
    const withData = holdingWebsites.filter(w => pageSpeedData[w.id]).length;
    
    let excellent = 0, good = 0, needsWork = 0, poor = 0;
    let totalDesktop = 0, totalMobile = 0, desktopCount = 0, mobileCount = 0;
    
    holdingWebsites.forEach(website => {
      const data = pageSpeedData[website.id];
      if (data) {
        // Count performance categories (use worst score between desktop/mobile)
        const desktopStatus = getPerformanceStatus(data.desktop_performance_score);
        const mobileStatus = getPerformanceStatus(data.mobile_performance_score);
        
        const statusOrder = ['poor', 'needs-improvement', 'good', 'excellent'];
        const desktopIdx = statusOrder.indexOf(desktopStatus as any);
        const mobileIdx = statusOrder.indexOf(mobileStatus as any);
        
        const worstStatus = desktopIdx < mobileIdx ? desktopStatus : mobileStatus;
        
        switch(worstStatus) {
          case 'excellent': excellent++; break;
          case 'good': good++; break;
          case 'needs-improvement': needsWork++; break;
          case 'poor': poor++; break;
        }

        // Average scores
        if (data.desktop_performance_score !== null) {
          totalDesktop += data.desktop_performance_score;
          desktopCount++;
        }
        if (data.mobile_performance_score !== null) {
          totalMobile += data.mobile_performance_score;
          mobileCount++;
        }
      }
    });
    
    return {
      total,
      withData,
      excellent,
      good,
      needsWork,
      poor,
      avgDesktop: desktopCount > 0 ? Math.round(totalDesktop / desktopCount) : 0,
      avgMobile: mobileCount > 0 ? Math.round(totalMobile / mobileCount) : 0,
    };
  }, [holdingWebsites, pageSpeedData]);

  useEffect(() => {
    fetchWebsites();
    fetchAllPageSpeeds();
  }, []);

  const fetchWebsites = async () => {
    try {
      const response = await websiteAPI.getAll();
      setWebsites(response.data);
    } catch (error) {
      console.error("Error fetching websites:", error);
    }
  };

  const fetchAllPageSpeeds = async () => {
    try {
      const response = await pageSpeedAPI.getAll();
      const dataMap: { [key: number]: PageSpeedData } = {};
      response.data.forEach((item: PageSpeedData) => {
        dataMap[item.website_id] = item;
      });
      setPageSpeedData(dataMap);
    } catch (error) {
      console.error("Error fetching page speeds:", error);
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

  return (
    <>
      <PageHeader
        icon={Globe}
        title={`${userHolding} - Dashboard`}
        subtitle="PageSpeed Monitor"
        iconColor="bg-blue-600"
        iconShadow="shadow-blue-200"
      />

      <div className="space-y-6">
        {/* Header Info */}
        <div className="text-center py-6">
          <Badge className={`text-lg px-4 py-2 ${getHoldingColor(userHolding)}`}>
            {userHolding}
          </Badge>
          <h2 className="text-2xl font-bold mt-3 text-neutral-700 dark:text-neutral-300">
            Website Performance Dashboard
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Monitor performa website milik {userHolding}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Website</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stats.total}</p>
                </div>
                <Globe className="w-12 h-12 text-blue-500 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Avg Desktop Score</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stats.avgDesktop}</p>
                </div>
                <Monitor className="w-12 h-12 text-green-500 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Avg Mobile Score</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stats.avgMobile}</p>
                </div>
                <Smartphone className="w-12 h-12 text-purple-500 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Need Attention</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stats.needsWork + stats.poor}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-orange-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribusi Performa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.excellent}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Excellent (90+)</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.good}</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Good (50-89)</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.needsWork}</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Needs Work (25-49)</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.poor}</div>
                <div className="text-sm text-red-700 dark:text-red-300">Poor (&lt;25)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Website List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Website Performance List
              </CardTitle>
              <Badge variant="outline">{filteredWebsites.length} dari {holdingWebsites.length} website</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search & Filter */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari website..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

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
                  className={`text-xs ${statusFilter === 'excellent' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  Excellent
                </Button>
                <Button
                  variant={statusFilter === 'good' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('good')}
                  className={`text-xs ${statusFilter === 'good' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
                >
                  Good
                </Button>
                <Button
                  variant={statusFilter === 'needs-improvement' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('needs-improvement')}
                  className={`text-xs ${statusFilter === 'needs-improvement' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                >
                  Needs Work
                </Button>
                <Button
                  variant={statusFilter === 'poor' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('poor')}
                  className={`text-xs ${statusFilter === 'poor' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                >
                  Poor
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:bg-neutral-900">
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-center">Ads</TableHead>
                    <TableHead className="text-center">Desktop</TableHead>
                    <TableHead className="text-center">Mobile</TableHead>
                    <TableHead className="text-center">Last Check</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWebsites.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                        <p className="text-sm">
                          {searchTerm ? 'Tidak ada website yang sesuai dengan pencarian' : 'Tidak ada data website'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWebsites.map((website, index) => {
                      const data = pageSpeedData[website.id];
                      return (
                        <TableRow key={website.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="max-w-xs">
                            <a
                              href={website.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate block"
                            >
                              {website.url}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge className={getJenisColor(website.jenis_website)}>
                              {website.jenis_website}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={website.has_ads ? 'default' : 'outline'}>
                              {website.has_ads ? 'Ya' : 'Tidak'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {data ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreBgColor(data.desktop_performance_score)} ${getScoreColor(data.desktop_performance_score)}`}>
                                {data.desktop_performance_score || '-'}
                              </span>
                            ) : (
                              <span className="text-neutral-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {data ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreBgColor(data.mobile_performance_score)} ${getScoreColor(data.mobile_performance_score)}`}>
                                {data.mobile_performance_score || '-'}
                              </span>
                            ) : (
                              <span className="text-neutral-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-xs text-neutral-600 dark:text-neutral-400">
                            {data ? formatDate(data.checked_at) : 'Belum dicek'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HoldingDashboard;
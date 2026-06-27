import { useEffect, useState } from "react";
import { pageSpeedAPI, websiteAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, Database, Globe, Activity } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const DebugDataPage = () => {
  const [loading, _setLoading] = useState(false);
  const [websitesData, setWebsitesData] = useState<any>(null);
  const [pageSpeedsData, setPageSpeedsData] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<{
    websites: 'idle' | 'loading' | 'success' | 'error';
    pageSpeeds: 'idle' | 'loading' | 'success' | 'error';
  }>({
    websites: 'idle',
    pageSpeeds: 'idle',
  });
  const [errors, setErrors] = useState<{
    websites?: string;
    pageSpeeds?: string;
  }>({});

  // Auto-fetch on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchWebsites(),
      fetchPageSpeeds()
    ]);
  };

  const fetchWebsites = async () => {
    setApiStatus(prev => ({ ...prev, websites: 'loading' }));
    setErrors(prev => ({ ...prev, websites: undefined }));
    
    try {
      console.log('🌐 Fetching websites...');
      const response = await websiteAPI.getAll();
      console.log('✅ Websites response:', response);
      
      setWebsitesData({
        count: response.data?.length || 0,
        data: response.data || [],
        raw: response
      });
      setApiStatus(prev => ({ ...prev, websites: 'success' }));
      toast.success(`Berhasil fetch ${response.data?.length || 0} websites`);
    } catch (error: any) {
      console.error('❌ Websites error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      setErrors(prev => ({ ...prev, websites: errorMsg }));
      setApiStatus(prev => ({ ...prev, websites: 'error' }));
      toast.error(`Error fetch websites: ${errorMsg}`);
    }
  };

  const fetchPageSpeeds = async () => {
    setApiStatus(prev => ({ ...prev, pageSpeeds: 'loading' }));
    setErrors(prev => ({ ...prev, pageSpeeds: undefined }));
    
    try {
      console.log('⚡ Fetching page speeds...');
      const response = await pageSpeedAPI.getAll();
      console.log('✅ PageSpeeds response:', response);
      
      setPageSpeedsData({
        count: response.data?.length || 0,
        data: response.data || [],
        raw: response
      });
      setApiStatus(prev => ({ ...prev, pageSpeeds: 'success' }));
      toast.success(`Berhasil fetch ${response.data?.length || 0} page speeds`);
    } catch (error: any) {
      console.error('❌ PageSpeeds error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      setErrors(prev => ({ ...prev, pageSpeeds: errorMsg }));
      setApiStatus(prev => ({ ...prev, pageSpeeds: 'error' }));
      toast.error(`Error fetch page speeds: ${errorMsg}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'loading':
        return 'Loading...';
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      default:
        return 'Idle';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'loading':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <>
      <PageHeader
        icon={Database}
        title="Debug Data Page"
        subtitle="Test dan debugging koneksi API dan data"
        iconColor="bg-purple-500"
        iconShadow="shadow-purple-200"
      >
        <Button
          onClick={fetchAllData}
          disabled={loading}
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {/* API Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Websites Status */}
          <Card className={`border-2 ${getStatusBg(apiStatus.websites)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-base">Websites API</CardTitle>
                </div>
                {getStatusIcon(apiStatus.websites)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="text-sm font-semibold">{getStatusText(apiStatus.websites)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Data:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {websitesData?.count ?? '-'}
                </span>
              </div>
              {errors.websites && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-400">
                  {errors.websites}
                </div>
              )}
              <Button
                onClick={fetchWebsites}
                size="sm"
                variant="outline"
                className="w-full mt-2"
                disabled={apiStatus.websites === 'loading'}
              >
                <RefreshCw className={`w-3 h-3 mr-2 ${apiStatus.websites === 'loading' ? 'animate-spin' : ''}`} />
                Refresh Websites
              </Button>
            </CardContent>
          </Card>

          {/* PageSpeeds Status */}
          <Card className={`border-2 ${getStatusBg(apiStatus.pageSpeeds)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-base">PageSpeeds API</CardTitle>
                </div>
                {getStatusIcon(apiStatus.pageSpeeds)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="text-sm font-semibold">{getStatusText(apiStatus.pageSpeeds)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Data:</span>
                <span className="text-2xl font-bold text-amber-600">
                  {pageSpeedsData?.count ?? '-'}
                </span>
              </div>
              {errors.pageSpeeds && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-400">
                  {errors.pageSpeeds}
                </div>
              )}
              <Button
                onClick={fetchPageSpeeds}
                size="sm"
                variant="outline"
                className="w-full mt-2"
                disabled={apiStatus.pageSpeeds === 'loading'}
              >
                <RefreshCw className={`w-3 h-3 mr-2 ${apiStatus.pageSpeeds === 'loading' ? 'animate-spin' : ''}`} />
                Refresh PageSpeeds
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Websites Data Display */}
        {websitesData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Websites Data ({websitesData.count})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {websitesData.count === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold">Tidak ada data websites</p>
                  <p className="text-sm mt-1">Database mungkin kosong atau ada masalah koneksi</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {websitesData.data.slice(0, 4).map((website: any) => (
                      <div
                        key={website.id}
                        className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-semibold text-blue-600">#{website.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {website.holding}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate text-blue-900 dark:text-blue-100">
                          {website.url}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-white dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                            {website.jenis_website}
                          </span>
                          {website.has_ads && (
                            <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                              Has Ads
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {websitesData.count > 4 && (
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Dan {websitesData.count - 4} website lainnya...
                    </p>
                  )}
                </div>
              )}
              
              {/* Raw Data Toggle */}
              <details className="mt-4">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  Show Raw Response
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                  {JSON.stringify(websitesData.raw, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        {/* PageSpeeds Data Display */}
        {pageSpeedsData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                PageSpeeds Data ({pageSpeedsData.count})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pageSpeedsData.count === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold">Tidak ada data page speeds</p>
                  <p className="text-sm mt-1">Belum ada website yang di-check atau data belum tersinkronisasi</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pageSpeedsData.data.slice(0, 4).map((ps: any) => {
                      const website = websitesData?.data.find((w: any) => w.id === ps.website_id);
                      return (
                        <div
                          key={ps.id}
                          className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-semibold text-amber-600">#{ps.website_id}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(ps.checked_at).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          {website && (
                            <p className="text-sm font-medium truncate text-amber-900 dark:text-amber-100 mb-2">
                              {website.url}
                            </p>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center p-2 bg-white dark:bg-amber-900/30 rounded">
                              <p className="text-xs text-muted-foreground">Desktop</p>
                              <p className="text-lg font-bold text-amber-600">
                                {ps.desktop_performance_score ?? '-'}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-amber-900/30 rounded">
                              <p className="text-xs text-muted-foreground">Mobile</p>
                              <p className="text-lg font-bold text-amber-600">
                                {ps.mobile_performance_score ?? '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {pageSpeedsData.count > 4 && (
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Dan {pageSpeedsData.count - 4} page speed lainnya...
                    </p>
                  )}
                </div>
              )}
              
              {/* Raw Data Toggle */}
              <details className="mt-4">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  Show Raw Response
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                  {JSON.stringify(pageSpeedsData.raw, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-sm">ℹ️ Informasi Debug</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2 text-muted-foreground">
            <p>• Halaman ini digunakan untuk testing koneksi API dan melihat data mentah</p>
            <p>• Jika data tidak muncul, cek Console (F12) untuk error detail</p>
            <p>• Jika status "Error", cek network tab untuk melihat response dari server</p>
            <p>• API Base URL: <code className="px-1 py-0.5 bg-white dark:bg-gray-900 rounded">{import.meta.env.VITE_API_BASE_URL || 'https://api.itmsci.com/api'}</code></p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DebugDataPage;

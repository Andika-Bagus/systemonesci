import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface PageSpeedDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PageSpeedData | null;
  websiteUrl: string;
}

const getScoreBgColor = (score: number | null) => {
  if (!score && score !== 0) return "bg-neutral-400";
  if (score >= 90) return "bg-green-500";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-500";
};

const ScoreCard = ({ label, score }: { label: string; score: number | null }) => (
  <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">{label}</p>
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-full ${getScoreBgColor(score)} flex items-center justify-center`}>
        <span 
          className="text-lg font-bold !text-white"
          style={{ 
            color: 'white !important',
            fontWeight: 'bold !important',
            fontSize: '18px !important'
          }}
        >
          {score !== null ? score : "-"}
        </span>
      </div>
      <div className="flex-1">
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              score === null ? "bg-neutral-400" : score >= 90 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${score ? (score / 100) * 100 : 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

const MetricCard = ({ label, value, unit = "" }: { label: string; value: number | null; unit?: string }) => (
  <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">{label}</p>
    <p className="text-lg font-bold text-neutral-900 dark:text-white">
      {value !== null ? `${value}${unit}` : "-"}
    </p>
  </div>
);

export default function PageSpeedDetailModal({ isOpen, onClose, data, websiteUrl }: PageSpeedDetailModalProps) {
  if (!data) return null;

  // Parse recommendations if they're JSON strings
  const desktopRecommendations = typeof data.desktop_recommendations === 'string' 
    ? JSON.parse(data.desktop_recommendations || '[]')
    : (data.desktop_recommendations || []);
  
  const mobileRecommendations = typeof data.mobile_recommendations === 'string'
    ? JSON.parse(data.mobile_recommendations || '[]')
    : (data.mobile_recommendations || []);

  // Debug log
  console.log('=== PageSpeed Recommendations Debug ===');
  console.log('Desktop Recommendations:', desktopRecommendations);
  console.log('Desktop Recommendations Length:', desktopRecommendations.length);
  console.log('Mobile Recommendations:', mobileRecommendations);
  console.log('Mobile Recommendations Length:', mobileRecommendations.length);
  console.log('Raw Desktop Data:', data.desktop_recommendations);
  console.log('Raw Mobile Data:', data.mobile_recommendations);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="pagespeed-modal-description">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
              {websiteUrl}
            </a>
          </DialogTitle>
          <p id="pagespeed-modal-description" className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            Terakhir dicek: {new Date(data.checked_at).toLocaleString("id-ID")}
          </p>
        </DialogHeader>

        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="desktop">🖥️ DESKTOP TEST</TabsTrigger>
            <TabsTrigger value="mobile">📱 MOBILE TEST</TabsTrigger>
            <TabsTrigger value="recommendations">💡 Rekomendasi</TabsTrigger>
            <TabsTrigger value="trend">🔥 Trend</TabsTrigger>
            <TabsTrigger value="debug">🐛 Debug</TabsTrigger>
          </TabsList>


          <TabsContent value="desktop" className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Performance Scores</h3>
              <div className="grid grid-cols-2 gap-4">
                <ScoreCard label="Performance" score={data.desktop_performance_score} />
                <ScoreCard label="Accessibility" score={data.desktop_accessibility_score} />
                <ScoreCard label="Best Practices" score={data.desktop_best_practices_score} />
                <ScoreCard label="SEO" score={data.desktop_seo_score} />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Core Web Vitals</h3>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard label="LCP" value={data.desktop_lcp} unit="s" />
                <MetricCard label="FID" value={data.desktop_fid} unit="ms" />
                <MetricCard label="CLS" value={data.desktop_cls} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Performance Scores</h3>
              <div className="grid grid-cols-2 gap-4">
                <ScoreCard label="Performance" score={data.mobile_performance_score} />
                <ScoreCard label="Accessibility" score={data.mobile_accessibility_score} />
                <ScoreCard label="Best Practices" score={data.mobile_best_practices_score} />
                <ScoreCard label="SEO" score={data.mobile_seo_score} />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100">Core Web Vitals</h3>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard label="LCP" value={data.mobile_lcp} unit="s" />
                <MetricCard label="FID" value={data.mobile_fid} unit="ms" />
                <MetricCard label="CLS" value={data.mobile_cls} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Desktop Recommendations */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span className="text-blue-600">🖥️</span> Desktop
                </h3>
                {desktopRecommendations && desktopRecommendations.length > 0 ? (
                  <div className="space-y-3">
                    {desktopRecommendations.slice(0, 10).map((rec: any, index: number) => (
                      <div key={index} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{rec.score || 0}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">{rec.title}</h4>
                            {rec.description && (
                              <p className="text-[10px] text-neutral-600 dark:text-neutral-400 line-clamp-2" dangerouslySetInnerHTML={{ __html: rec.description }}></p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                    <p className="text-xs text-green-800 dark:text-green-200 font-medium">
                      ✨ Website sudah optimal!
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile Recommendations */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span className="text-green-600">📱</span> Mobile
                </h3>
                {mobileRecommendations && mobileRecommendations.length > 0 ? (
                  <div className="space-y-3">
                    {mobileRecommendations.slice(0, 10).map((rec: any, index: number) => (
                      <div key={index} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{rec.score || 0}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">{rec.title}</h4>
                            {rec.description && (
                              <p className="text-[10px] text-neutral-600 dark:text-neutral-400 line-clamp-2" dangerouslySetInnerHTML={{ __html: rec.description }}></p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                    <p className="text-xs text-green-800 dark:text-green-200 font-medium">
                      ✨ Website sudah optimal!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trend" className="space-y-6">
            <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">🎉 TAB TREND BERHASIL MUNCUL!</h3>
              <p className="text-blue-600 text-lg mb-2">Grafik trend akan ditampilkan di sini.</p>
              <p className="text-sm text-blue-500">Website ID: {data.website_id}</p>
              <p className="text-sm text-blue-500">URL: {websiteUrl}</p>
              <div className="mt-4 p-4 bg-white rounded border">
                <p className="font-semibold">✅ Fitur Trend sudah aktif!</p>
                <p className="text-sm text-gray-600">Grafik line chart akan menampilkan perubahan performa dari waktu ke waktu.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="debug" className="space-y-6">
            <div className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-4">🐛 TAB DEBUG BERHASIL MUNCUL!</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-white rounded border">
                  <h4 className="font-semibold text-green-700 mb-2">Desktop Data:</h4>
                  <p className="text-sm"><strong>Performance:</strong> {data.desktop_performance_score || 'NULL'}</p>
                  <p className="text-sm"><strong>LCP:</strong> {data.desktop_lcp || 'NULL'}</p>
                  <p className="text-sm"><strong>FID:</strong> {data.desktop_fid || 'NULL'}</p>
                  <p className="text-sm"><strong>CLS:</strong> {data.desktop_cls || 'NULL'}</p>
                </div>
                <div className="p-4 bg-white rounded border">
                  <h4 className="font-semibold text-green-700 mb-2">Mobile Data:</h4>
                  <p className="text-sm"><strong>Performance:</strong> {data.mobile_performance_score || 'NULL'}</p>
                  <p className="text-sm"><strong>LCP:</strong> {data.mobile_lcp || 'NULL'}</p>
                  <p className="text-sm"><strong>FID:</strong> {data.mobile_fid || 'NULL'}</p>
                  <p className="text-sm"><strong>CLS:</strong> {data.mobile_cls || 'NULL'}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
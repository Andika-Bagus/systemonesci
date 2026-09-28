import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Zap, Loader2, AlertCircle, Check, Monitor, Smartphone, X, RefreshCw, TrendingUp } from "lucide-react";
import { pageSpeedAPI } from "@/services/api";

interface ExternalCheckResult {
  url: string;
  checked_at: string;
  strategy: 'desktop' | 'mobile' | 'both';
  results: {
    desktop?: {
      performance_score: number;
      accessibility_score: number;
      best_practices_score: number;
      seo_score: number;
      lcp: number | null;
      fid: number | null;
      cls: number | null;
      recommendations: Array<{
        title: string;
        description: string;
        score: number;
      }>;
    };
    mobile?: {
      performance_score: number;
      accessibility_score: number;
      best_practices_score: number;
      seo_score: number;
      lcp: number | null;
      fid: number | null;
      cls: number | null;
      recommendations: Array<{
        title: string;
        description: string;
        score: number;
      }>;
    };
  };
}

interface ExternalUrlCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExternalUrlChecker = ({ isOpen, onClose }: ExternalUrlCheckerProps) => {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<'desktop' | 'mobile' | 'both'>('both');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExternalCheckResult | null>(() => {
    // Load dari localStorage saat component mount
    try {
      const saved = localStorage.getItem('externalUrlCheckResult');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);

  // Save result ke localStorage setiap kali berubah
  const saveResult = (newResult: ExternalCheckResult | null) => {
    setResult(newResult);
    if (newResult) {
      localStorage.setItem('externalUrlCheckResult', JSON.stringify(newResult));
    } else {
      localStorage.removeItem('externalUrlCheckResult');
    }
  };

  const handleClearResult = () => {
    saveResult(null);
    setUrl("");
    setError(null);
  };

  const handleCheck = async () => {
    if (!url.trim()) {
      toast.error("Masukkan URL terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);
    saveResult(null);

    try {
      const response = await pageSpeedAPI.checkExternalUrl({
        url: url.trim(),
        strategy,
      });

      saveResult(response.data);
      toast.success("Pemeriksaan PageSpeed selesai!");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Gagal mengecek URL, coba lagi";
      setError(errorMsg);
      // Don't show toast error - only show in UI error display
      // This prevents error toasts from appearing during loading/retries
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ScoreCardBig = ({
    label,
    score,
  }: {
    label: string;
    score: number | null;
  }) => {
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
      <div
        className={`p-3 rounded-lg bg-gradient-to-br ${getGradient()} text-white shadow-md overflow-hidden relative min-h-[120px] flex flex-col justify-center`}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-white/90 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">
            {score !== null ? score : "-"}
          </p>
          <p className="text-xs text-white/80 mt-1">{getStatusText()}</p>
        </div>
      </div>
    );
  };

  const VitalCardBig = ({
    label,
    value,
    good,
  }: {
    label: string;
    value: number | null;
    good: (val: number) => boolean;
  }) => {
    // Ensure value is a number and check against good function
    const isGood = value !== null && value !== undefined && !isNaN(value as number) && good(value as number);
    
    // Dynamic color based on status
    const getColor = () => {
      if (value === null || value === undefined) return "from-slate-500 to-slate-600";
      if (isGood) return "from-green-500 to-green-600";
      return "from-red-500 to-red-600";
    };

    return (
      <div
        className={`p-3 rounded-lg bg-gradient-to-br ${getColor()} text-white shadow-md overflow-hidden relative min-h-[120px] flex flex-col justify-center`}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-white/90 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">
            {value !== null && value !== undefined ? `${(value as number).toFixed((value as number) < 10 ? 2 : 0)}` : "-"}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-white/80">{value !== null && value !== undefined ? (isGood ? "Good" : "Poor") : "No data"}</p>
            {value !== null && value !== undefined && (
              isGood ? (
                <Check className="w-3 h-3 text-white" />
              ) : (
                <AlertCircle className="w-3 h-3 text-white" />
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="absolute right-4 top-4 z-50">
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 px-4 py-4">
          {/* Input Section */}
          {!result ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
                  URL Website
                </label>
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleCheck();
                    }
                  }}
                  className="text-base h-10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
                  Tipe Pemeriksaan
                </label>
                <div className="flex gap-2">
                  {(["desktop", "mobile", "both"] as const).map((s) => (
                    <Button
                      key={s}
                      variant={strategy === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStrategy(s)}
                      disabled={loading}
                      className="flex-1"
                    >
                      {s === "both" ? "Desktop & Mobile" : s === "desktop" ? "Desktop" : "Mobile"}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCheck}
                disabled={loading || !url.trim()}
                className="w-full h-10 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sedang memeriksa (1-3 menit)...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Mulai Pemeriksaan
                  </>
                )}
              </Button>

              {loading && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    ℹ️ Pemeriksaan sedang berlangsung. Mohon tunggu...
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Error Display */}
          {error && !loading && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-100 text-sm">
                    Error
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-4">
              {/* URL and Date */}
              <div>
                <h3 className="text-base font-bold text-blue-600 dark:text-blue-400 break-all">
                  {result.url}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Terakhir dicek: {formatDate(result.checked_at)}
                </p>
              </div>

              {/* Tabs */}
              <Tabs
                defaultValue={
                  result.strategy === "both" ? "desktop" : result.strategy
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-8 text-xs">
                  {result.results.desktop && (
                    <TabsTrigger value="desktop" className="text-xs gap-1">
                      <Monitor className="w-3 h-3" />
                      Desktop
                    </TabsTrigger>
                  )}
                  {result.results.mobile && (
                    <TabsTrigger value="mobile" className="text-xs gap-1">
                      <Smartphone className="w-3 h-3" />
                      Mobile
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="info" className="text-xs gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Info
                  </TabsTrigger>
                </TabsList>

                {result.results.desktop && (
                  <TabsContent value="desktop" className="space-y-3 mt-3">
                    <div>
                      <h4 className="font-bold text-sm mb-2">Performance Scores</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <ScoreCardBig
                          label="Performance"
                          score={result.results.desktop.performance_score}
                        />
                        <ScoreCardBig
                          label="Accessibility"
                          score={result.results.desktop.accessibility_score}
                        />
                        <ScoreCardBig
                          label="Best Practices"
                          score={result.results.desktop.best_practices_score}
                        />
                        <ScoreCardBig
                          label="SEO"
                          score={result.results.desktop.seo_score}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Core Web Vitals</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <VitalCardBig
                          label="LCP"
                          value={result.results.desktop.lcp}
                          good={(v) => v <= 2.5}
                        />
                        <VitalCardBig
                          label="FID"
                          value={result.results.desktop.fid}
                          good={(v) => v <= 100}
                        />
                        <VitalCardBig
                          label="CLS"
                          value={result.results.desktop.cls}
                          good={(v) => v <= 0.1}
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}

                {result.results.mobile && (
                  <TabsContent value="mobile" className="space-y-3 mt-3">
                    <div>
                      <h4 className="font-bold text-sm mb-2">Performance Scores</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <ScoreCardBig
                          label="Performance"
                          score={result.results.mobile.performance_score}
                        />
                        <ScoreCardBig
                          label="Accessibility"
                          score={result.results.mobile.accessibility_score}
                        />
                        <ScoreCardBig
                          label="Best Practices"
                          score={result.results.mobile.best_practices_score}
                        />
                        <ScoreCardBig
                          label="SEO"
                          score={result.results.mobile.seo_score}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Core Web Vitals</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <VitalCardBig
                          label="LCP"
                          value={result.results.mobile.lcp}
                          good={(v) => v <= 4}
                        />
                        <VitalCardBig
                          label="FID"
                          value={result.results.mobile.fid}
                          good={(v) => v <= 300}
                        />
                        <VitalCardBig
                          label="CLS"
                          value={result.results.mobile.cls}
                          good={(v) => v <= 0.25}
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="info" className="space-y-2 mt-3">
                  <div className="flex gap-1">
                    <Button
                      onClick={() => {
                        setResult(null);
                        setUrl(result.url);
                        setStrategy(result.strategy);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-8"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Cek Ulang
                    </Button>
                    <Button
                      onClick={handleClearResult}
                      variant="destructive"
                      size="sm"
                      className="flex-1 text-xs h-8"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalUrlChecker;

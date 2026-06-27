import { useEffect, useState } from "react";
import { websiteAPI, pageSpeedAPI } from "@/services/api";
import { exportComprehensiveReport } from "@/services/comprehensiveReportService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Download, RefreshCw, AlertCircle, FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface Website {
  id: number;
  url: string;
  holding: string;
  jenis_website: string;
  has_ads: boolean;
}

interface PageSpeedData {
  website_id: number;
  desktop_performance_score: number | null;
  mobile_performance_score: number | null;
  checked_at: string;
}

const ComprehensiveReport = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [pageSpeedData, setPageSpeedData] = useState<{ [key: number]: PageSpeedData }>({});
  const [holdings, setHoldings] = useState<string[]>([]);
  const [selectedHolding, setSelectedHolding] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch websites
      const websitesResponse = await websiteAPI.getAll();
      setWebsites(websitesResponse.data);

      // Extract unique holdings
      const uniqueHoldings = [...new Set(websitesResponse.data.map((w: Website) => w.holding))] as string[];
      setHoldings(uniqueHoldings.sort());

      // Fetch page speed data
      const pageSpeedResponse = await pageSpeedAPI.getAll();
      const dataMap: { [key: number]: PageSpeedData } = {};
      pageSpeedResponse.data.forEach((ps: any) => {
        dataMap[ps.website_id] = ps;
      });
      setPageSpeedData(dataMap);
    } catch (error) {
      toast.error("Gagal mengambil data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportComprehensiveReport(selectedHolding || undefined);
      toast.success("PDF berhasil diunduh");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Gagal mengunduh PDF");
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate statistics
  const getFilteredWebsites = () => {
    if (!selectedHolding) return websites;
    return websites.filter(w => w.holding === selectedHolding);
  };

  const filteredWebsites = getFilteredWebsites();
  
  const stats = {
    total: filteredWebsites.length,
    checked: filteredWebsites.filter(w => pageSpeedData[w.id]).length,
    excellent: filteredWebsites.filter(w => {
      const ps = pageSpeedData[w.id];
      return ps && ((ps.desktop_performance_score ?? 0) >= 90 || (ps.mobile_performance_score ?? 0) >= 90);
    }).length,
    good: filteredWebsites.filter(w => {
      const ps = pageSpeedData[w.id];
      return ps && 
        (((ps.desktop_performance_score ?? 0) >= 50 && (ps.desktop_performance_score ?? 0) < 90) ||
         ((ps.mobile_performance_score ?? 0) >= 50 && (ps.mobile_performance_score ?? 0) < 90));
    }).length,
    needsImprovement: filteredWebsites.filter(w => {
      const ps = pageSpeedData[w.id];
      return ps && 
        (((ps.desktop_performance_score ?? 0) >= 25 && (ps.desktop_performance_score ?? 0) < 50) ||
         ((ps.mobile_performance_score ?? 0) >= 25 && (ps.mobile_performance_score ?? 0) < 50));
    }).length,
    poor: filteredWebsites.filter(w => {
      const ps = pageSpeedData[w.id];
      return ps && 
        (((ps.desktop_performance_score ?? 0) < 25) ||
         ((ps.mobile_performance_score ?? 0) < 25));
    }).length,
  };

  const averageDesktop = filteredWebsites.length > 0
    ? Math.round(
        filteredWebsites
          .filter(w => pageSpeedData[w.id]?.desktop_performance_score !== null)
          .reduce((sum, w) => sum + (pageSpeedData[w.id]?.desktop_performance_score || 0), 0) /
          filteredWebsites.filter(w => pageSpeedData[w.id]?.desktop_performance_score !== null).length
      )
    : 0;

  const averageMobile = filteredWebsites.length > 0
    ? Math.round(
        filteredWebsites
          .filter(w => pageSpeedData[w.id]?.mobile_performance_score !== null)
          .reduce((sum, w) => sum + (pageSpeedData[w.id]?.mobile_performance_score || 0), 0) /
          filteredWebsites.filter(w => pageSpeedData[w.id]?.mobile_performance_score !== null).length
      )
    : 0;

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Comprehensive Report"
        subtitle="Generate laporan keseluruhan PageSpeed"
        iconColor="bg-amber-600"
        iconShadow="shadow-amber-200"
      />

      <div className="space-y-6">
        {/* Filter & Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Holding</label>
                <Select value={selectedHolding || "all"} onValueChange={(value) => setSelectedHolding(value === "all" ? "" : value)}>
                  <SelectTrigger className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Semua Holding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Holding</SelectItem>
                    {holdings.map((holding) => (
                      <SelectItem key={holding} value={holding}>
                        {holding}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleExport}
                  disabled={isExporting || filteredWebsites.length === 0}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download size={16} className="mr-2" />
                      Download PDF Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Total Websites</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-xs text-muted-foreground mt-2">Checked: {stats.checked}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Avg Desktop</p>
                  <p className="text-3xl font-bold text-green-600">{averageDesktop}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Avg Mobile</p>
                  <p className="text-3xl font-bold text-green-600">{averageMobile}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Excellent</p>
                  <p className="text-3xl font-bold text-green-600">{stats.excellent}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Poor</p>
                  <p className="text-3xl font-bold text-red-600">{stats.poor}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">Excellent (90+)</span>
                  <span className="text-sm font-bold">{stats.excellent}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${stats.total > 0 ? (stats.excellent / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-600">Good (50-89)</span>
                  <span className="text-sm font-bold">{stats.good}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${stats.total > 0 ? (stats.good / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-orange-600">Needs Improvement (25-49)</span>
                  <span className="text-sm font-bold">{stats.needsImprovement}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${stats.total > 0 ? (stats.needsImprovement / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-red-600">Poor (&lt;25)</span>
                  <span className="text-sm font-bold">{stats.poor}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${stats.total > 0 ? (stats.poor / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Website List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Websites ({filteredWebsites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredWebsites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                <p className="text-sm">Tidak ada website untuk holding ini</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredWebsites.map((website) => {
                  const ps = pageSpeedData[website.id];
                  const desktopScore = ps?.desktop_performance_score;
                  const mobileScore = ps?.mobile_performance_score;

                  const getScoreBg = (score: number | null) => {
                    if (!score && score !== 0) return "bg-neutral-100";
                    if (score >= 90) return "bg-green-100";
                    if (score >= 50) return "bg-yellow-100";
                    return "bg-red-100";
                  };

                  const getScoreColor = (score: number | null) => {
                    if (!score && score !== 0) return "text-neutral-600";
                    if (score >= 90) return "text-green-600";
                    if (score >= 50) return "text-yellow-600";
                    return "text-red-600";
                  };

                  return (
                    <div key={website.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{website.url}</p>
                        <p className="text-xs text-muted-foreground">{website.holding} • {website.jenis_website}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <div className={`px-3 py-1 rounded text-xs font-semibold ${getScoreBg(desktopScore)} ${getScoreColor(desktopScore)}`}>
                          D: {desktopScore !== null ? desktopScore : '-'}
                        </div>
                        <div className={`px-3 py-1 rounded text-xs font-semibold ${getScoreBg(mobileScore)} ${getScoreColor(mobileScore)}`}>
                          M: {mobileScore !== null ? mobileScore : '-'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ComprehensiveReport;

import { Card, CardContent } from "@/components/ui/card";
import { pageSpeedAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface PageSpeedItem {
  website_id: number;
  website_url: string;
  desktop_performance_score: number | null;
  mobile_performance_score: number | null;
  created_at?: string;
}

const TransactionsCard = () => {
  const [pageSpeedData, setPageSpeedData] = useState<PageSpeedItem[]>([]);

  useEffect(() => {
    fetchPageSpeedData();
    
    // Polling setiap 30 detik untuk data real-time
    const interval = setInterval(fetchPageSpeedData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPageSpeedData = async () => {
    try {
      const pageSpeedRes = await pageSpeedAPI.getAll();
      const pageSpeedList = pageSpeedRes.data || [];

      // Ambil 4 data PageSpeed terbaru berdasarkan checked_at
      const combined = pageSpeedList
        .map((ps: any) => ({
          website_id: ps.website_id,
          website_url: ps.website?.url || 'N/A',
          desktop_performance_score: ps.desktop_performance_score || null,
          mobile_performance_score: ps.mobile_performance_score || null,
          created_at: ps.checked_at,
        }))
        .filter((item: PageSpeedItem) => item.desktop_performance_score !== null || item.mobile_performance_score !== null)
        // Sort by checked_at descending (pengecekan terbaru dulu)
        .sort((a: PageSpeedItem, b: PageSpeedItem) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        })
        .slice(0, 4);

      setPageSpeedData(combined);
    } catch (error) {
      console.error('Error fetching page speed data:', error);
      setPageSpeedData([]);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score && score !== 0) return "text-neutral-600";
    if (score >= 90) return "text-green-600 font-bold";
    if (score >= 50) return "text-yellow-600 font-bold";
    return "text-red-600 font-bold";
  };

  const getScoreBgColor = (score: number | null) => {
    if (!score && score !== 0) return "bg-neutral-100 dark:bg-neutral-600/20";
    if (score >= 90) return "bg-green-100 dark:bg-green-600/20";
    if (score >= 50) return "bg-yellow-100 dark:bg-yellow-600/20";
    return "bg-red-100 dark:bg-red-600/20";
  };

  return (
    <Card className="card h-full rounded-lg border-0 !p-0 block">
      <CardContent className="card-body p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center flex-wrap gap-2 justify-between mb-6">
          <h6 className="font-bold text-lg mb-0">PageSpeed Monitor</h6>
          <Link to="/page-speed" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
            View All <span>›</span>
          </Link>
        </div>

        {/* PageSpeed List */}
        <div className="mt-8">
          {pageSpeedData.length === 0 ? (
            <p className="text-sm text-neutral-600 dark:text-neutral-200">Belum ada data PageSpeed</p>
          ) : (
            pageSpeedData.map((item, index) => (
              <div
                key={item.website_id}
                className={`flex items-center justify-between gap-4 ${index === pageSpeedData.length - 1 ? "mb-0" : "mb-6"}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-[40px] h-[40px] rounded-full flex justify-center items-center shrink-0 ${getScoreBgColor(item.desktop_performance_score)}`}>
                    <Zap className={`h-5 w-5 ${getScoreColor(item.desktop_performance_score)}`} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h6 className="text-base mb-0 font-normal truncate">{item.website_url}</h6>
                    <span className="text-sm text-neutral-600 dark:text-neutral-200 font-normal">
                      Desktop: {item.desktop_performance_score || '-'}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-base ${getScoreColor(item.mobile_performance_score)}`}>
                    {item.mobile_performance_score || '-'}
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-200">Mobile</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsCard;

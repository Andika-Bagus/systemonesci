import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { pageSpeedAPI } from '@/services/api';

export default function PageSpeedOverviewCard() {
  const [stats, setStats] = useState({ memenuhi: 0, harus: 0, noData: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await pageSpeedAPI.getAll();
        const records = response.data;
        
        let memenuhi = 0, harus = 0, noData = 0;
        
        records.forEach((r: any) => {
          const lcp = r.mobile_lcp !== null ? r.mobile_lcp : r.desktop_lcp;
          if (lcp === null || lcp === undefined) {
            noData++;
          } else {
            const num = Number(lcp);
            if (isNaN(num)) noData++;
            else if (num < 4) memenuhi++;
            else harus++;
          }
        });
        
        setStats({ memenuhi, harus, noData, total: records.length });
      } catch (error) {
        console.error('Error fetching pagespeed stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-amber-500" />
          PageSpeed LCP Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Memenuhi (&lt;4s)</span>
              </div>
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{stats.memenuhi}</p>
            </div>
            
            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span className="text-sm font-semibold text-rose-800 dark:text-rose-300">Perbaikan (≥4s)</span>
              </div>
              <p className="text-3xl font-bold text-rose-700 dark:text-rose-400">{stats.harus}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-300">Belum Dicek</span>
              </div>
              <p className="text-2xl font-bold text-slate-700 dark:text-slate-400">{stats.noData}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

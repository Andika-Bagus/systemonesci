import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import api from '@/services/api';

export default function UptimeOverviewCard() {
  const [stats, setStats] = useState({ online: 0, offline: 0, avgResponse: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/uptime/all-status');
        const data = response.data;
        
        const online = data.filter((s: any) => s.status === 'up').length;
        const offline = data.filter((s: any) => s.status === 'down').length;
        const total = data.length;
        
        const responseTimes = data.filter((s: any) => s.status === 'up' && s.response_time).map((s: any) => s.response_time);
        const avgResponse = responseTimes.length > 0 ? responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length : 0;
        
        setStats({ online, offline, avgResponse, total });
      } catch (error) {
        console.error('Error fetching uptime stats:', error);
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
          <Activity className="w-5 h-5 text-blue-500" />
          Uptime Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Online</span>
              </div>
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{stats.online}</p>
            </div>
            
            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span className="text-sm font-semibold text-rose-800 dark:text-rose-300">Offline</span>
              </div>
              <p className="text-3xl font-bold text-rose-700 dark:text-rose-400">{stats.offline}</p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">Rata-rata Response Time</span>
              </div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {stats.avgResponse < 1000 ? `${Math.round(stats.avgResponse)} ms` : `${(stats.avgResponse / 1000).toFixed(2)} s`}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

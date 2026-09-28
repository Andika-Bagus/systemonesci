import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Loader2 } from 'lucide-react';
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { pageSpeedAPI } from '@/services/api';

export default function PageSpeedChartCard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await pageSpeedAPI.getAll();
        const records = response.data;
        
        let memenuhi = 0, perbaikan = 0, buruk = 0, noData = 0;
        
        records.forEach((r: any) => {
          const lcp = r.mobile_lcp !== null ? r.mobile_lcp : r.desktop_lcp;
          if (lcp === null || lcp === undefined) {
            noData++;
          } else {
            const num = Number(lcp);
            if (isNaN(num)) noData++;
            else if (num <= 2.5) memenuhi++; // Good
            else if (num <= 4.0) perbaikan++; // Needs Improvement
            else buruk++; // Poor
          }
        });
        
        setData([
          { name: 'Sangat Baik (< 2.5s)', value: memenuhi, color: '#10b981' }, // Emerald
          { name: 'Perlu Perbaikan (2.5s - 4s)', value: perbaikan, color: '#f59e0b' }, // Amber
          { name: 'Buruk (> 4s)', value: buruk, color: '#ef4444' }, // Rose
        ]);
      } catch (error) {
        console.error('Error fetching pagespeed stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></span>
            {payload[0].payload.name}
          </p>
          <p className="text-lg font-bold mt-1" style={{ color: payload[0].payload.color }}>
            {payload[0].value} Website
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-base font-semibold">Distribusi PageSpeed LCP</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="ml-3 text-sm text-neutral-600">Memuat grafik...</span>
          </div>
        ) : (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  style={{ fontSize: '11px', fontWeight: 500 }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                  tickMargin={5}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.05)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

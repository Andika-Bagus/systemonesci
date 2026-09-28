import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '@/services/api';

export default function UptimeChartCard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/uptime/all-status');
        const stats = response.data;
        
        const online = stats.filter((s: any) => s.status === 'up').length;
        const offline = stats.filter((s: any) => s.status === 'down').length;
        const unknown = stats.filter((s: any) => s.status !== 'up' && s.status !== 'down').length;
        
        setData([
          { name: 'Online', value: online, color: '#10b981' }, // Emerald
          { name: 'Offline', value: offline, color: '#ef4444' }, // Rose
          ...(unknown > 0 ? [{ name: 'Unknown', value: unknown, color: '#94a3b8' }] : []) // Slate
        ]);
      } catch (error) {
        console.error('Error fetching uptime stats:', error);
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
            {payload[0].name}
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
      <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-base font-semibold">Status Uptime Real-time</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-sm text-neutral-600">Memuat grafik...</span>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value, entry: any) => <span style={{ color: entry.color, fontWeight: 500 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

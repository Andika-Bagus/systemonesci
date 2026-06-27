import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { websiteAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { Users, Server, Building2, Globe, Loader2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const SystemCharts = () => {
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    websiteAPI.getAll()
      .then(res => setWebsites(Array.isArray(res.data) ? res.data : []))
      .catch(() => setWebsites([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-sm text-neutral-600">Memuat statistik...</span>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="text-center py-12">
        <Globe className="w-16 h-16 mx-auto mb-3 text-neutral-300" />
        <p className="text-sm text-neutral-500">Tidak ada data website</p>
      </div>
    );
  }

  const groupBy = (key: string) => {
    const map = new Map<string, number>();
    websites.forEach((w: any) => {
      const val = String(w[key] || 'Unknown');
      map.set(val, (map.get(val) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count, value: count }))
      .sort((a, b) => b.count - a.count);
  };

  const picData = groupBy('pic').slice(0, 8);
  const serverData = groupBy('letak_server').slice(0, 6);
  const holdingData = groupBy('holding').slice(0, 6);
  const typeData = groupBy('jenis_website');

  // Modern blue-based color palette
  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-blue-600 font-bold">
            {payload[0].value} website
          </p>
        </div>
      );
    }
    return null;
  };

  const ChartCard = ({ title, icon: Icon, children }: any) => (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Bar Chart - Website per PIC */}
      <ChartCard title="Top 8 Website per PIC" icon={Users}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={picData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#94a3b8" 
              style={{ fontSize: '12px' }}
              width={95}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }} />
            <Bar dataKey="count" fill="#2563eb" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Pie Chart - Website per Server */}
      <ChartCard title="Distribusi per Server" icon={Server}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={serverData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {serverData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bar Chart - Website per Holding */}
      <ChartCard title="Website per Holding" icon={Building2}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={holdingData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }} />
            <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
              {holdingData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Pie Chart - Tipe Website */}
      <ChartCard title="Distribusi Tipe Website" icon={Globe}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {typeData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default SystemCharts;

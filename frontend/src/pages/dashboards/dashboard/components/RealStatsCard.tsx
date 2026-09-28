import { useEffect, useState } from 'react';
import { websiteAPI, gamblingAPI, domainAPI, pageSpeedAPI } from '@/services/api';
import { Globe, Database, AlertTriangle, Calendar, Gauge, Loader2 } from 'lucide-react';

interface DashboardStats {
  totalWebsites: number;
  totalOJS: number;
  domainExpiringSoon: number;
  slowWebsites: number;
  gamblingFlags: number;
}

const RealStatsCard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalWebsites: 0,
    totalOJS: 0,
    domainExpiringSoon: 0,
    slowWebsites: 0,
    gamblingFlags: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      // Note: websiteAPI.getAll() now excludes OJS instances, so we count OJS separately
      const [websitesRes, ojsRes, domainsRes, gamblingRes, pageSpeedRes] = await Promise.all([
        websiteAPI.getAll(),
        fetch('/api/ojs-instances').then(r => r.json()).catch(() => ({ data: [] })),
        domainAPI.getStats().catch(() => ({ data: { expiring_soon: 0 } })),
        gamblingAPI.getStats().catch(() => ({ data: { flagged: 0 } })),
        pageSpeedAPI.getAll().catch(() => ({ data: [] })),
      ]);

      // Websites (excluding OJS)
      const websites = websitesRes.data || [];

      // OJS instances
      const ojsInstances = ojsRes.data || [];

      // Count slow websites (mobile or desktop score < 50)
      const slowCount = pageSpeedRes.data.filter((ps: any) => 
        (ps.mobile_score && ps.mobile_score < 50) || 
        (ps.desktop_score && ps.desktop_score < 50)
      ).length;

      setStats({
        totalWebsites: websites.length,
        totalOJS: ojsInstances.length,
        domainExpiringSoon: domainsRes.data.expiring_soon || 0,
        slowWebsites: slowCount,
        gamblingFlags: gamblingRes.data.flagged || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Website',
      value: stats.totalWebsites,
      icon: Globe,
      bgColor: 'bg-blue-600',
      description: 'Website terdaftar',
    },
    {
      title: 'Total OJS',
      value: stats.totalOJS,
      icon: Database,
      bgColor: 'bg-purple-600',
      description: 'OJS instances',
    },
    {
      title: 'Domain Expiring',
      value: stats.domainExpiringSoon,
      icon: Calendar,
      bgColor: 'bg-orange-600',
      description: 'Domain akan expire',
    },
    {
      title: 'Performance Issues',
      value: stats.slowWebsites,
      icon: Gauge,
      bgColor: 'bg-red-600',
      description: 'Website lambat',
    },
    {
      title: 'Gambling Flags',
      value: stats.gamblingFlags,
      icon: AlertTriangle,
      bgColor: 'bg-rose-600',
      description: 'Konten terdeteksi',
    },
  ];

  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-sm text-neutral-600">Memuat statistik...</span>
      </div>
    );
  }

  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 flex items-center gap-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
              <p className="text-white/90 text-sm font-medium">{card.title}</p>
              <p className="text-white/70 text-xs mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RealStatsCard;

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pageSpeedAPI, gamblingAPI, domainAPI } from '@/services/api';
import { Activity, Zap, Shield, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  type: 'pagespeed' | 'gambling' | 'domain' | 'uptime';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
  icon: any;
}

const RecentActivityCard = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchRecentActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const activities: ActivityItem[] = [];

      // Fetch recent page speed checks
      try {
        const pageSpeedRes = await pageSpeedAPI.getAll();
        pageSpeedRes.data.slice(0, 5).forEach((ps: any) => {
          if (ps.updated_at) {
            activities.push({
              id: `ps-${ps.id}`,
              type: 'pagespeed',
              title: 'PageSpeed Check',
              description: `Website checked - Score: ${ps.mobile_score || ps.desktop_score || 'N/A'}`,
              timestamp: new Date(ps.updated_at),
              status: (ps.mobile_score >= 90 || ps.desktop_score >= 90) ? 'success' : 
                      (ps.mobile_score >= 50 || ps.desktop_score >= 50) ? 'warning' : 'error',
              icon: Zap,
            });
          }
        });
      } catch (err) {
        console.error('Failed to fetch page speed activities:', err);
      }

      // Fetch recent gambling scans
      try {
        const gamblingRes = await gamblingAPI.getAllScans();
        gamblingRes.data.slice(0, 5).forEach((scan: any) => {
          if (scan.scanned_at) {
            activities.push({
              id: `gb-${scan.id}`,
              type: 'gambling',
              title: 'Gambling Scan',
              description: `Scan ${scan.is_flagged ? 'detected gambling content' : 'completed - clean'}`,
              timestamp: new Date(scan.scanned_at),
              status: scan.is_flagged ? 'error' : 'success',
              icon: Shield,
            });
          }
        });
      } catch (err) {
        console.error('Failed to fetch gambling activities:', err);
      }

      // Fetch domain info
      try {
        const domainsRes = await domainAPI.getAll();
        domainsRes.data.slice(0, 3).forEach((domain: any) => {
          if (domain.updated_at) {
            activities.push({
              id: `dm-${domain.id}`,
              type: 'domain',
              title: 'Domain Check',
              description: `Domain checked - ${domain.domain_expires_at ? 'Expires soon' : 'Status OK'}`,
              timestamp: new Date(domain.updated_at),
              status: domain.domain_expires_at ? 'warning' : 'info',
              icon: Calendar,
            });
          }
        });
      } catch (err) {
        console.error('Failed to fetch domain activities:', err);
      }

      // Sort by timestamp (most recent first)
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setActivities(activities.slice(0, 10)); // Show only latest 10
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Latest monitoring activities
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm">No recent activities</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getStatusColor(activity.status)}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h6 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {activity.title}
                          </h6>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 flex-shrink-0">
                          <Clock size={12} />
                          {formatDistanceToNow(activity.timestamp, { 
                            addSuffix: true,
                            locale: id 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { domainAPI, gamblingAPI, pageSpeedAPI } from '@/services/api';
import { AlertTriangle, Calendar, Zap, Shield, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'domain' | 'performance' | 'gambling';
  title: string;
  description: string;
  url?: string;
  icon: any;
}

const CriticalAlertsCard = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    
    // Auto refresh every minute
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const newAlerts: Alert[] = [];

      // Check expiring domains
      try {
        const domainsRes = await domainAPI.getExpiringSoon();
        domainsRes.data.forEach((domain: any) => {
          if (domain.domain_expires_at) {
            const daysUntilExpiry = Math.ceil(
              (new Date(domain.domain_expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            newAlerts.push({
              id: `domain-${domain.id}`,
              type: daysUntilExpiry <= 7 ? 'critical' : 'warning',
              category: 'domain',
              title: `Domain Expiring in ${daysUntilExpiry} days`,
              description: domain.url,
              url: domain.url,
              icon: Calendar,
            });
          }
        });
      } catch (err) {
        console.error('Failed to fetch domain alerts:', err);
      }

      // Check slow websites
      try {
        const pageSpeedRes = await pageSpeedAPI.getAll();
        const slowSites = pageSpeedRes.data.filter((ps: any) => 
          (ps.mobile_score && ps.mobile_score < 30) || 
          (ps.desktop_score && ps.desktop_score < 30)
        );
        
        slowSites.slice(0, 5).forEach((ps: any) => {
          newAlerts.push({
            id: `perf-${ps.id}`,
            type: 'warning',
            category: 'performance',
            title: 'Very Poor Performance Detected',
            description: `Score: ${ps.mobile_score || ps.desktop_score}/100`,
            url: ps.website?.url,
            icon: Zap,
          });
        });
      } catch (err) {
        console.error('Failed to fetch performance alerts:', err);
      }

      // Check gambling flags
      try {
        const gamblingRes = await gamblingAPI.getByStatus('flagged');
        gamblingRes.data.slice(0, 5).forEach((scan: any) => {
          newAlerts.push({
            id: `gambling-${scan.id}`,
            type: 'critical',
            category: 'gambling',
            title: 'Gambling Content Detected',
            description: `${scan.matches_found} keyword matches found`,
            url: scan.website?.url,
            icon: Shield,
          });
        });
      } catch (err) {
        console.error('Failed to fetch gambling alerts:', err);
      }

      // Sort by severity (critical first)
      newAlerts.sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return severityOrder[a.type] - severityOrder[b.type];
      });

      setAlerts(newAlerts.slice(0, 8)); // Show only top 8 alerts
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      default:
        return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-600';
      case 'warning':
        return 'bg-yellow-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="border-b bg-gradient-to-r from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-800/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Critical Alerts</CardTitle>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                Issues requiring attention
              </p>
            </div>
          </div>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="text-sm">
              {alerts.filter(a => a.type === 'critical').length} Critical
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">All Clear!</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              No critical alerts at the moment
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[500px] overflow-y-auto">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getTypeColor(alert.type)} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h6 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {alert.title}
                        </h6>
                        <Badge 
                          variant={alert.type === 'critical' ? 'destructive' : 'secondary'}
                          className="text-xs capitalize flex-shrink-0"
                        >
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {alert.description}
                      </p>
                      {alert.url && (
                        <a
                          href={alert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                        >
                          <span className="truncate max-w-xs">{alert.url}</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
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

export default CriticalAlertsCard;

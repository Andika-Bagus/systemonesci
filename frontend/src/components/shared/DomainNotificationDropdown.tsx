import { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { domainAPI } from '@/services/api';
import { Link } from 'react-router-dom';

interface ExpiringDomain {
  id: number;
  url: string;
  holding: string;
  domain_expires_at: string;
  days_until_expiry: number;
  domain_status: string;
}

export default function DomainNotificationDropdown() {
  const [expiringDomains, setExpiringDomains] = useState<ExpiringDomain[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchExpiringDomains();
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchExpiringDomains();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const fetchExpiringDomains = async () => {
    try {
      const response = await domainAPI.getExpiringSoon();
      setExpiringDomains(response.data.data || []);
      setCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching expiring domains:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysColor = (days: number) => {
    if (days < 0) return 'text-red-600 dark:text-red-400';
    if (days <= 7) return 'text-red-600 dark:text-red-400';
    if (days <= 15) return 'text-orange-600 dark:text-orange-400';
    if (days <= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getUrgencyBadge = (days: number) => {
    if (days < 0) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">EXPIRED</span>;
    }
    if (days <= 7) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">URGENT</span>;
    }
    if (days <= 15) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">HIGH</span>;
    }
    if (days <= 30) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">MEDIUM</span>;
    }
    return null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Calendar className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] max-h-[500px] overflow-y-auto">
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Domain Expiring Soon
            </h3>
            {count > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                {count} domain{count > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {expiringDomains.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              Semua domain aman
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              Tidak ada domain yang akan expire dalam 30 hari
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {expiringDomains.slice(0, 10).map((domain) => (
              <DropdownMenuItem
                key={domain.id}
                className="px-4 py-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 focus:bg-neutral-50 dark:focus:bg-neutral-800/50"
                asChild
              >
                <Link to="/domain" className="block">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-1.5 rounded-full ${
                      domain.days_until_expiry < 0 ? 'bg-red-100 dark:bg-red-900/30' :
                      domain.days_until_expiry <= 7 ? 'bg-red-100 dark:bg-red-900/30' :
                      domain.days_until_expiry <= 15 ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}>
                      <AlertCircle className={`h-4 w-4 ${
                        domain.days_until_expiry < 0 ? 'text-red-600 dark:text-red-400' :
                        domain.days_until_expiry <= 7 ? 'text-red-600 dark:text-red-400' :
                        domain.days_until_expiry <= 15 ? 'text-orange-600 dark:text-orange-400' :
                        'text-yellow-600 dark:text-yellow-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {domain.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </p>
                        {getUrgencyBadge(domain.days_until_expiry)}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        {domain.holding}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Expires: {formatDate(domain.domain_expires_at)}
                        </p>
                        <p className={`text-xs font-semibold ${getDaysColor(domain.days_until_expiry)}`}>
                          {domain.days_until_expiry < 0 
                            ? `${Math.abs(domain.days_until_expiry)} hari lalu`
                            : `${domain.days_until_expiry} hari lagi`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {expiringDomains.length > 0 && (
          <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
            <Link to="/domain">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Lihat Semua Domain
              </Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

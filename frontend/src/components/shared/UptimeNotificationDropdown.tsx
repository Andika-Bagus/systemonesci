import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Activity, AlertCircle, CheckCircle, X, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";

interface UptimeStatus {
  website_id: number;
  url: string;
  status: 'up' | 'down' | 'unknown';
  http_code: number | null;
  response_time: number | null;
  last_checked: string | null;
}

const UptimeNotificationDropdown = () => {
  const [downWebsites, setDownWebsites] = useState<UptimeStatus[]>([]);

  useEffect(() => {
    fetchDownWebsites();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchDownWebsites, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDownWebsites = async () => {
    try {
      const response = await api.get('/uptime/all-status');
      const downSites = response.data.filter((s: UptimeStatus) => s.status === 'down');
      setDownWebsites(downSites);
    } catch (error) {
      console.error('Error fetching uptime status:', error);
    }
  };

  const formatLastChecked = (dateString: string | null) => {
    if (!dateString) return 'Belum pernah dicek';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const dismissWebsite = (websiteId: number) => {
    setDownWebsites(prev => prev.filter(w => w.website_id !== websiteId));
    toast.success("Notifikasi disembunyikan");
  };

  const dismissAll = () => {
    setDownWebsites([]);
    toast.success("Semua notifikasi disembunyikan");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className={cn(
            "rounded-[50%] sm:w-10 sm:h-10 w-8 h-8 text-neutral-900 dark:text-white bg-gray-200/75 hover:bg-gray-200 focus-visible:ring-0 dark:bg-slate-600 dark:hover:bg-slate-500 border-0 cursor-pointer data-[state=open]:bg-gray-300 dark:data-[state=open]:bg-slate-500 relative"
          )}
        >
          <Activity className="h-5 w-5" />
          {downWebsites.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
              {downWebsites.length > 9 ? '9+' : downWebsites.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-[420px] max-h-[unset] me-6 p-0 rounded-2xl overflow-hidden shadow-lg block">
        <div className="">
          <div className="py-3 px-4 rounded-lg bg-rose-100 dark:bg-rose-900/25 m-4 flex items-center justify-between gap-2">
            <h6 className="text-lg text-neutral-900 dark:text-white font-semibold mb-0">
              Uptime Alerts
            </h6>
            <span className="sm:w-10 sm:h-10 w-8 h-8 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-bold flex justify-center items-center rounded-full">
              {downWebsites.length}
            </span>
          </div>
          <div className="scroll-sm !border-t-0">
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
              {downWebsites.length > 0 ? (
                downWebsites.map((website) => (
                  <div
                    key={website.website_id}
                    className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-3 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 group"
                  >
                    <Link
                      to="/uptime"
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="flex-shrink-0 relative w-11 h-11 bg-rose-100 dark:bg-rose-600/20 text-rose-600 flex justify-center items-center rounded-full">
                        <AlertCircle className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6 className="text-sm font-semibold mb-1 truncate text-rose-900 dark:text-rose-100">
                          {website.url}
                        </h6>
                        <p className="mb-1 text-xs text-neutral-600 dark:text-neutral-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatLastChecked(website.last_checked)}
                        </p>
                        {website.http_code && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 font-mono">
                            HTTP {website.http_code}
                          </p>
                        )}
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dismissWebsite(website.website_id);
                      }}
                      className="flex-shrink-0 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Sembunyikan notifikasi"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                  <CheckCircle className="w-8 h-8 mb-2 opacity-50 text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">All websites are UP!</p>
                  <p className="text-xs text-neutral-500 mt-1">No downtime detected</p>
                </div>
              )}
            </div>

            {downWebsites.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 p-3 space-y-2">
                <Link
                  to="/uptime"
                  className="block text-center text-rose-600 dark:text-rose-400 font-semibold hover:underline py-2"
                >
                  View Uptime Monitor
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={dismissAll}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  Clear All Notifications
                </Button>
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UptimeNotificationDropdown;

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Bell, AlertCircle, Zap, CheckCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { notificationAPI } from "@/services/api";
import { playNotificationSound } from "@/utils/notificationSound";
import { toast } from "sonner";

interface PageSpeedNotification {
  id: number;
  type: 'low_performance' | 'pagespeed_checked';
  title: string;
  message: string;
  read: boolean;
  read_at: string | null;
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<PageSpeedNotification[]>([]);
  const [soundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('notificationSoundEnabled');
    return saved !== null ? saved === 'true' : false; // DEFAULT: false (OFF)
  });
  const playedNotificationIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 3 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 3000);
    
    // Listen for custom event to refresh notifications
    const handleRefresh = () => {
      fetchNotifications();
    };
    window.addEventListener('refreshNotifications', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshNotifications', handleRefresh);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      
      // Filter for PageSpeed related notifications
      const pageSpeedNotifs = (response.data?.data || response.data || []).filter((n: any) => 
        n.type === 'low_performance' || n.type === 'pagespeed_checked'
      );
      
      // Play sound only for NEW notifications (not seen before) if enabled
      pageSpeedNotifs.forEach((notif: PageSpeedNotification) => {
        if (!playedNotificationIds.current.has(notif.id) && soundEnabled) {
          playNotificationSound();
          playedNotificationIds.current.add(notif.id);
        }
      });
      
      setNotifications(pageSpeedNotifs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    if (type === 'pagespeed_checked') {
      return <CheckCircle className="w-5 h-5" />;
    }
    return <Zap className="w-5 h-5" />;
  };

  const getNotificationBgColor = (type: string) => {
    if (type === 'pagespeed_checked') {
      return 'bg-green-100 dark:bg-green-600/20 text-green-600';
    }
    return 'bg-red-100 dark:bg-red-600/20 text-red-600';
  };

  const deleteNotification = (e: React.MouseEvent, notifId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Update UI immediately
    setNotifications(prev => prev.filter(n => n.id !== notifId));
    toast.success("Notifikasi dihapus");
    
    // Call API in background (fire and forget)
    notificationAPI.delete(notifId).catch(error => {
      console.error('Delete notification error:', error);
      toast.error("Gagal menghapus notifikasi");
    });
  };

  const deleteAllNotifications = () => {
    // Update UI immediately
    setNotifications([]);
    toast.success("Semua notifikasi dihapus");
    
    // Call API in background (fire and forget)
    notificationAPI.deleteAll().catch(error => {
      console.error('Delete all notifications error:', error);
      toast.error("Gagal menghapus notifikasi");
    });
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
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-[420px] max-h-[unset] me-6 p-0 rounded-2xl overflow-hidden shadow-lg block">
        <div className="">
          <div className="py-3 px-4 rounded-lg bg-primary/10 dark:bg-primary/25 m-4 flex items-center justify-between gap-2">
            <h6 className="text-lg text-neutral-900 dark:text-white font-semibold mb-0">
              PageSpeed Alerts
            </h6>
            <span className="sm:w-10 sm:h-10 w-8 h-8 bg-white dark:bg-slate-800 text-primary dark:text-primary font-bold flex justify-center items-center rounded-full">
              {notifications.length}
            </span>
          </div>
          <div className="scroll-sm !border-t-0">
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-3 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 group"
                  >
                    <Link
                      to="/page-speed"
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className={`flex-shrink-0 relative w-11 h-11 ${getNotificationBgColor(notif.type)} flex justify-center items-center rounded-full`}>
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6 className="text-sm font-semibold mb-1 truncate">
                          {notif.title}
                        </h6>
                        <p className="mb-1 text-xs text-neutral-600 dark:text-neutral-300 truncate">
                          {notif.message}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => deleteNotification(e, notif.id)}
                      className="flex-shrink-0 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus notifikasi"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">All websites performing well</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 p-3 space-y-2">
                <Link
                  to="/page-speed"
                  className="block text-center text-primary dark:text-primary font-semibold hover:underline py-2"
                >
                  View PageSpeed Monitor
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteAllNotifications}
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

export default NotificationDropdown;

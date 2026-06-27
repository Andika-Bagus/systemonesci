import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Mail, AlertCircle, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ticketAPI } from "@/services/api";
import { speakTicketNotification } from "@/utils/notificationSound";

interface TicketNotification {
  id: number;
  ticket_number: string;
  judul: string;
  nama_holding: string;
  prioritas: 'rendah' | 'sedang' | 'tinggi' | 'mendesak';
  created_at: string;
  createdBy?: {
    name: string;
  };
}

const TicketNotificationDropdown = () => {
  const [notifications, setNotifications] = useState<TicketNotification[]>([]);
  const [soundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ticketSoundEnabled');
    return saved !== null ? saved === 'true' : false; // DEFAULT: false (OFF)
  });
  const playedTicketIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 3 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await ticketAPI.getAll();
      const tickets = response.data?.data || response.data || [];

      // Get only recent tickets (created in last 24 hours)
      const recentTickets = tickets
        .filter((ticket: TicketNotification) => {
          const createdDate = new Date(ticket.created_at);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return createdDate > oneDayAgo;
        })
        .sort((a: TicketNotification, b: TicketNotification) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      // Play sound only for NEW tickets (not seen before) if enabled
      recentTickets.forEach((ticket: TicketNotification) => {
        if (!playedTicketIds.current.has(ticket.id) && soundEnabled) {
          speakTicketNotification();
          playedTicketIds.current.add(ticket.id);
        }
      });

      setNotifications(recentTickets);
    } catch (error) {
      console.error('Error fetching ticket notifications:', error);
    }
  };

  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case 'mendesak':
        return 'bg-red-100 text-red-700';
      case 'tinggi':
        return 'bg-orange-100 text-orange-700';
      case 'sedang':
        return 'bg-yellow-100 text-yellow-700';
      case 'rendah':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
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
          <Mail className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-[420px] max-h-[unset] me-6 p-0 rounded-2xl overflow-hidden shadow-lg block">
        <div className="">
          <div className="py-3 px-4 rounded-lg bg-blue-50 dark:bg-blue-900/25 m-4 flex items-center justify-between gap-2">
            <h6 className="text-lg text-neutral-900 dark:text-white font-semibold mb-0">
              Ticket Notifications
            </h6>
            <span className="sm:w-10 sm:h-10 w-8 h-8 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold flex justify-center items-center rounded-full">
              {notifications.length}
            </span>
          </div>
          <div className="scroll-sm !border-t-0">
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    to={`/tickets/${notif.id}`}
                    className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-3 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 relative w-11 h-11 bg-blue-100 dark:bg-blue-600/20 text-blue-600 flex justify-center items-center rounded-full">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6 className="text-sm font-semibold mb-1 truncate">
                          {notif.ticket_number}: {notif.judul}
                        </h6>
                        <p className="mb-1 text-xs text-neutral-600 dark:text-neutral-300 truncate">
                          {notif.nama_holding}
                        </p>
                        <div className="flex gap-2 text-xs">
                          <span className={`px-2 py-1 rounded ${getPriorityColor(notif.prioritas)}`}>
                            {notif.prioritas}
                          </span>
                          <span className="text-neutral-500">{formatDate(notif.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No new tickets</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="text-center py-3 px-4 border-t border-neutral-200 dark:border-neutral-700">
                <Link
                  to="/tickets"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-center"
                >
                  View All Tickets
                </Link>
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TicketNotificationDropdown;

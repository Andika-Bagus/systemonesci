import { ModeToggle } from "@/components/ModeToggle";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import TicketNotificationDropdown from "@/components/shared/TicketNotificationDropdown";
import UptimeNotificationDropdown from "@/components/shared/UptimeNotificationDropdown";
import DomainNotificationDropdown from "@/components/shared/DomainNotificationDropdown";
import ProfileDropdown from "@/components/shared/ProfileDropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { UserRole } from "@/utils/roleUtils";

const Header = () => {
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserRole(user.role as UserRole);
            } catch {
                setUserRole(null);
            }
        }
    }, []);

    const isTicketingUser = userRole === 'ticketing_user';
    const isViewer = userRole === 'viewer';

    return (
        <div className="bg-sidebar border-b border-neutral-200 dark:border-slate-700 flex items-center justify-between sm:h-18 h-13 shrink-0 gap-2 md:px-6 px-4 py-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-18 sticky top-0 z-[2]">
            <div className="col-auto flex-1">
                <div className="flex flex-wrap items-center gap-[16px]">

                    {/* <SidebarToggle /> */}
                    {!isViewer && <SidebarTrigger className={cn(`!p-0 h-auto w-auto !bg-transparent cursor-pointer text-neutral-700 hover:text-neutral-900 dark:text-neutral-200`)} />}

                    {/* Scrolling Text Animation */}
                    <style>{`
                      @keyframes scroll-text {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(calc(100vw - 200px)); }
                      }
                      .scroll-text {
                        animation: scroll-text 8s linear infinite;
                        white-space: nowrap;
                      }
                    `}</style>
                    <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 overflow-hidden flex-1">
                      <div className="scroll-text">
                        Syntax Corporation Indonesia - Easy For Everyone - IT Maintainance
                      </div>
                    </div>
                </div>
            </div>

            <div className="col-auto">
                <div className="flex flex-wrap items-center gap-3">

                    {/* Light & Dark Mode */}
                    <ModeToggle />

                    {/* Ticket Notification Start - Hide for ticketing user and viewer */}
                    {!isTicketingUser && !isViewer && <TicketNotificationDropdown />}
                    {/* Ticket Notification End   */}

                    {/* Uptime Notification Start - Hide for ticketing user and viewer */}
                    {!isTicketingUser && !isViewer && <UptimeNotificationDropdown />}
                    {/* Uptime Notification End   */}

                    {/* Domain Notification Start - Hide for ticketing user */}
                    {!isTicketingUser && <DomainNotificationDropdown />}
                    {/* Domain Notification End   */}

                    {/* PageSpeed Notification Start - Hide for ticketing user and viewer */}
                    {!isTicketingUser && !isViewer && <NotificationDropdown />}
                    {/* PageSpeed Notification End   */}

                    {/* Profile dropdown start */}
                    <ProfileDropdown hideSettings={isTicketingUser} />
                    {/* Profile dropdown end */}

                </div>
            </div>
        </div>
    );
};

export default Header;
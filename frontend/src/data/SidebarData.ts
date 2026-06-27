import { House, Server, Ticket, Zap, Activity, Calendar, BarChart3 } from "lucide-react";
import type { UserRole } from "@/utils/roleUtils";

export interface NavItem {
  title?: string;
  url?: string;
  icon?: any;
  isActive?: boolean;
  label?: string;
  items?: NavItem[];
  circleColor?: string;
  requiredRoles?: (UserRole | string)[];
}

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
      isActive: true,
      requiredRoles: ['superadmin', 'ojs_user', 'wp_admin'],
    },
    {
      title: "PageSpeed Performance",
      url: "/dashboard-pagespeed",
      icon: BarChart3,
      requiredRoles: ['superadmin', 'wp_admin'],
    },
    {
      title: "PageSpeed Monitor",
      url: "/page-speed",
      icon: Zap,
      requiredRoles: ['superadmin', 'wp_admin', 'pagespeed'],
    },
    {
      title: "Uptime Monitor",
      url: "/uptime",
      icon: Activity,
      requiredRoles: ['superadmin', 'wp_admin'],
    },
    {
      title: "Domain Monitor",
      url: "/domain",
      icon: Calendar,
      requiredRoles: ['superadmin', 'wp_admin', 'viewer'],
    },
    {
      label: "Management",
      requiredRoles: ['superadmin', 'ticketing_user', 'wp_admin'],
    },
    {
      title: "Support Tickets",
      url: "/tickets",
      icon: Ticket,
      requiredRoles: ['superadmin', 'ticketing_user'],
    },
    {
      title: "Website Management",
      url: "#",
      icon: Server,
      isActive: true,
      requiredRoles: ['superadmin', 'wp_admin'],
      items: [
        {
          title: "Websites",
          url: "/websites",
          circleColor: "bg-blue-600",
          requiredRoles: ['superadmin', 'wp_admin'],
        },
        {
          title: "OJS Instances",
          url: "/ojs-instances",
          circleColor: "bg-purple-600",
          requiredRoles: ['superadmin', 'ojs_user'],
        },
        {
          title: "OJS Secure",
          url: "/ojs-secure",
          circleColor: "bg-red-600",
          requiredRoles: ['superadmin'],
        },
        {
          title: "SOP Web",
          url: "/sop-webs",
          circleColor: "bg-green-600",
          requiredRoles: ['superadmin'],
        },
      ],
    },
  ],
};

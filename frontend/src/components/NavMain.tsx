import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import type { UserRole } from "@/utils/roleUtils";

interface SidebarItem {
  title?: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url?: string;
    circleColor: string;
    requiredRoles?: (UserRole | string)[];
  }[];
  label?: string;
  requiredRoles?: (UserRole | string)[];
}

export function NavMain({ items }: { items: SidebarItem[] }) {
  const location = useLocation();
  const pathname = location.pathname;
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // State: which dropdown is open
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role as UserRole);
      } catch (error) {
        console.error('Error parsing user:', error);
        setUserRole(null);
      }
    }
  }, []);

  // Check if user has access to item
  const hasAccess = (requiredRoles?: (UserRole | string)[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!userRole) return false;
    return requiredRoles.includes(userRole as UserRole | string);
  };

  // Toggle a dropdown
  const handleToggleGroup = (title?: string) => {
    if (!title) return;
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  // Check if dropdown contains active page
  const isDropdownActive = (item: SidebarItem) => {
    if (!item.items) return false;
    return item.items.some(
      (sub) => sub.url && (pathname === sub.url || pathname.startsWith(sub.url))
    );
  };

  return (
    <SidebarGroup className="flex flex-col w-full p-0 gap-0">
      <SidebarMenu className="space-y-0.5">
        {items.map((item) => {
          // Check access for this item
          if (!hasAccess(item.requiredRoles)) {
            return null;
          }

          // Dropdown with subitems
          if (item.items && item.items.length > 0 && item.title) {
            // Filter subitems by role
            const accessibleSubItems = item.items.filter((sub) =>
              hasAccess(sub.requiredRoles)
            );

            if (accessibleSubItems.length === 0) {
              return null;
            }

            const isActiveDropdown = isDropdownActive(item);
            const isOpen = isActiveDropdown || openGroup === item.title;

            return (
              <SidebarMenuItem key={item.title} className="px-2">
                <Collapsible open={isOpen}>
                  <div>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => handleToggleGroup(item.title)}
                        className={cn(
                          "flex items-center py-2 px-3 text-sm font-medium rounded-md transition-all duration-200",
                          isOpen
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-semibold"
                            : "text-slate-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-slate-800"
                        )}
                      >
                        {item.icon && (
                          <item.icon className="!w-4.5 !h-4.5" />
                        )}
                        <span>{item.title}</span>
                        <ChevronRight
                          className={cn(
                            "ms-auto transition-transform duration-200",
                            isOpen ? "rotate-90" : ""
                          )}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="mt-1 ms-6 space-y-0.5">
                        {accessibleSubItems.map((subItem) => {
                          if (!subItem.url) return null;
                          const isSubActive =
                            pathname === subItem.url ||
                            pathname.startsWith(subItem.url);

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  "py-1.5 px-3 text-sm rounded-md transition-all duration-200",
                                  isSubActive
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-semibold"
                                    : "text-slate-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-slate-800"
                                )}
                              >
                                <NavLink
                                  to={subItem.url}
                                  className="flex items-center gap-3.5"
                                  onClick={() =>
                                    item.title && setOpenGroup(item.title)
                                  }
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${subItem.circleColor}`}
                                  />
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </SidebarMenuItem>
            );
          }

          // Label
          if (item.label) {
            return (
              <SidebarGroupLabel 
                key={`label-${item.label}`}
                className="px-2 py-1.5 mt-1 mb-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                {item.label}
              </SidebarGroupLabel>
            );
          }

          // Top-level single page
          if (item.url && item.title) {
            const isMenuActive =
              pathname === item.url || pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title} className="px-2">
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "flex items-center py-2 px-3 text-sm font-medium rounded-md transition-all duration-200",
                    isMenuActive 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-semibold" 
                      : "text-slate-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-slate-800"
                  )}
                  onClick={() => setOpenGroup(null)} // Close all dropdowns
                >
                  <Link to={item.url} className="flex items-center gap-2">
                    {item.icon && (
                      <item.icon className="!w-4.5 !h-4.5" />
                    )}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return null;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

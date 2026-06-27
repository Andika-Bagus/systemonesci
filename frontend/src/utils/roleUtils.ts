export type UserRole = 'superadmin' | 'ticketing_user' | 'ojs_user' | 'wp_admin' | 'viewer' | 'holding_user' | 'admin' | 'pagespeed';

export const rolePermissions: Record<UserRole, string[]> = {
  superadmin: [
    'dashboard',
    'tickets',
    'websites',
    'ojs-instances',
    'sop-webs',
    'page-speed',
    'users-list',
    'company',
  ],
  admin: [
    'dashboard',
    'tickets',
    'websites',
    'ojs-instances',
    'sop-webs',
    'page-speed',
    'users-list',
    'company',
  ],
  ticketing_user: [
    'tickets',
  ],
  ojs_user: [
    'dashboard',
    'ojs-instances',
  ],
  wp_admin: [
    'dashboard',
    'websites',
    'page-speed',
  ],
  viewer: [
    'domain',
  ],
  holding_user: [
    'page-speed',
  ],
  pagespeed: [
    'page-speed',
  ],
};

export const canAccessPage = (userRole: UserRole | null, pageName: string): boolean => {
  if (!userRole) return false;
  return rolePermissions[userRole]?.includes(pageName) ?? false;
};

export const getAccessiblePages = (userRole: UserRole | null): string[] => {
  if (!userRole) return [];
  return rolePermissions[userRole] ?? [];
};

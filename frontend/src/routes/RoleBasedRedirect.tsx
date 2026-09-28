import { Navigate } from 'react-router-dom';
import type { UserRole } from '@/utils/roleUtils';

const RoleBasedRedirect = () => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const role = user.role as UserRole;

    // Holding user goes directly to page-speed monitor
    if (role === 'holding_user') {
      return <Navigate to="/page-speed" replace />;
    }

    // PageSpeed user goes directly to page-speed monitor (same as holding user but different role)
    if (role === 'pagespeed') {
      return <Navigate to="/page-speed" replace />;
    }

    // Viewer goes directly to domain monitor
    if (role === 'viewer') {
      return <Navigate to="/domain" replace />;
    }

    // Ticketing user goes directly to tickets page
    if (role === 'ticketing_user' || role === 'user_tiket') {
      return <Navigate to="/tickets" replace />;
    }

    // All other roles go to dashboard
    return <Navigate to="/dashboard" replace />;
  } catch {
    return <Navigate to="/auth/login" replace />;
  }
};

export default RoleBasedRedirect;

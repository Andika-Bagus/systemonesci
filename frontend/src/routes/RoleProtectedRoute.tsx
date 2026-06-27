import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { UserRole } from '@/utils/roleUtils';

interface RoleProtectedRouteProps {
  element: React.ReactElement;
  requiredRoles: UserRole[];
}

const RoleProtectedRoute = ({ element, requiredRoles }: RoleProtectedRouteProps) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setHasAccess(false);
        return;
      }

      const user = JSON.parse(userStr);
      const userRole = user.role as UserRole;
      const access = requiredRoles && requiredRoles.length > 0 
        ? requiredRoles.includes(userRole)
        : true;
      setHasAccess(access);
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    }
  }, [requiredRoles]);

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default RoleProtectedRoute;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminPasswordModal } from '../admin/AdminPasswordModal';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
      const authTime = parseInt(localStorage.getItem('adminAuthTime') || '0', 10);
      const now = Date.now();
      const authDuration = 30 * 60 * 1000; // 30 minutes

      if (!authenticated || (now - authTime) >= authDuration) {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    return () => {
      clearInterval(interval);
      if (!location.pathname.includes('/admin')) {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
      }
    };
  }, [location.pathname, navigate]);

  if (isAuthorized === null) {
    return null; // Initial load - prevent flash
  }

  if (!isAuthorized) {
    return <AdminPasswordModal />;
  }

  return <>{children}</>;
}
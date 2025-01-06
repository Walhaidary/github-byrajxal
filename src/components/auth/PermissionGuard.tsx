import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

interface PermissionGuardProps {
  requiredPermission: string;
  children: React.ReactNode;
}

export default function PermissionGuard({ requiredPermission, children }: PermissionGuardProps) {
  const { permissions, isLoading } = usePermissions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!permissions.includes(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
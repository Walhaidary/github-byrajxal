import { useAuthContext } from '../components/AuthContext';

export interface UserPermissions {
  permissions: string[];
  isLoading: boolean;
}

export function usePermissions(): UserPermissions {
  const { user } = useAuthContext();

  // For now, all authenticated users have admin permissions
  const permissions = user ? [
    'new_service.read',
    'new_service.write',
    'validate_service.read',
    'validate_service.write',
    'admin.read',
    'admin.write'
  ] : [];

  return {
    permissions,
    isLoading: false
  };
}
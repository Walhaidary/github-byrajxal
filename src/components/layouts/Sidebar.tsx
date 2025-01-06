import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FileText, CheckSquare, Settings } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { permissions } = usePermissions();
  const location = useLocation();
  
  useEffect(() => {
    if (!location.pathname.includes('/admin')) {
      sessionStorage.removeItem('adminAuthenticated');
    }
  }, [location]);

  const navigation = [
    {
      name: 'New Service Receipt',
      to: '/dashboard/new-service',
      icon: FileText,
      permission: 'new_service.read'
    },
    {
      name: 'Service Request Management',
      to: '/dashboard/validate-service',
      icon: CheckSquare,
      permission: 'validate_service.read'
    },
    {
      name: 'Administration',
      to: '/dashboard/admin',
      icon: Settings,
      permission: 'admin.read'
    }
  ].filter(item => permissions.includes(item.permission));

  if (!isOpen) return null;

  return (
    <div className="fixed h-full bg-white w-64 transition-all duration-300">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-facebook-primary/10 text-facebook-primary'
                    : 'text-facebook-gray hover:bg-gray-50 hover:text-facebook-text'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
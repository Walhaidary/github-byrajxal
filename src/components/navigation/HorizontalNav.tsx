import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, Settings } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

export function HorizontalNav() {
  const { permissions } = usePermissions();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
      permission: 'new_service.read',
      exact: true
    },
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

  return (
    <nav className="bg-[#E7F3FF] border-b border-[#E4E6EB] print:hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-12">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex-1 inline-flex items-center justify-center px-4 text-sm font-medium border-b-[3px] transition-all duration-200 ${
                  isActive || (!item.exact && location.pathname.startsWith(item.to))
                    ? 'border-facebook-primary text-facebook-primary bg-white'
                    : 'border-transparent text-facebook-gray hover:text-facebook-primary hover:bg-white/50'
                }`
              }
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
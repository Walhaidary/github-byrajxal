import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { SearchBar } from '../search/SearchBar';
import { useAuthContext } from '../AuthContext';

export function MainNavbar() {
  const { user } = useAuthContext();

  return (
    <nav className="bg-[#0079BD] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with home icon */}
          <Link to="/dashboard" className="flex items-center space-x-2 text-2xl font-bold tracking-tight shrink-0">
            <Home className="h-6 w-6" />
            <span>AutoTrack</span>
          </Link>

          {/* Center section with nav and search */}
          <div className="flex items-center justify-end flex-1 space-x-8 ml-16">
            {/* Navigation links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-white hover:text-white/90 px-3 py-2 text-sm font-medium tracking-tight">
                Dashboard
              </Link>
              <Link to="/dashboard/new-service" className="text-white hover:text-white/90 px-3 py-2 text-sm font-medium tracking-tight">
                New Receipt
              </Link>
              <Link to="/dashboard/validate-service" className="text-white hover:text-white/90 px-3 py-2 text-sm font-medium tracking-tight">
                Request Management
              </Link>
              <Link to="/dashboard/admin" className="text-white hover:text-white/90 px-3 py-2 text-sm font-medium tracking-tight">
                Admin
              </Link>
            </div>

            {/* Search bar */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* User menu */}
            <div className="flex items-center ml-4">
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
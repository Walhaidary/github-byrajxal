import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, LogOut } from 'lucide-react';
import { useAuthContext } from '../AuthContext';
import { signOut } from '../../lib/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-facebook-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Truck className="h-10 w-10 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">
              Service Receipt Tracker
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white/90">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white/90 hover:text-white rounded-md hover:bg-facebook-hover transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
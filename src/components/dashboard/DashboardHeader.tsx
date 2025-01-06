import React from 'react';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="bg-blue-600 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Receipts Dashboard</h1>
        <p className="mt-1 text-blue-100">
          Welcome back, {user?.email?.split('@')[0]}!
        </p>
      </div>
    </div>
  );
}
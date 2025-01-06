import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainNavbar } from '../navigation/MainNavbar';
import { SecondaryNavbar } from '../navigation/SecondaryNavbar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <SecondaryNavbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
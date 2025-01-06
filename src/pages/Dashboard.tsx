import React, { useState } from 'react';
import { useAuthContext } from '../components/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MonthFilter } from '../components/dashboard/MonthFilter';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { DelayedReceiptsTable } from '../components/dashboard/DelayedReceiptsTable';

export default function Dashboard() {
  const { user } = useAuthContext();
  const [selectedMonth, setSelectedMonth] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-end mb-6">
          <MonthFilter
            selectedMonth={selectedMonth}
            onChange={setSelectedMonth}
          />
        </div>
        
        <div className="space-y-6">
          <MetricsGrid selectedMonth={selectedMonth} />
          <DelayedReceiptsTable />
        </div>
      </div>
    </div>
  );
}
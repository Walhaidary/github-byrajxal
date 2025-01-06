import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Select } from '../ui/Select';

interface MonthFilterProps {
  selectedMonth: string;
  onChange: (month: string) => void;
}

export function MonthFilter({ selectedMonth, onChange }: MonthFilterProps) {
  // Generate last 12 months options
  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    // Add "All Time" option
    options.push({ value: '', label: 'All Time' });
    
    // Add last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = format(date, 'yyyy-MM');
      const label = format(date, 'MMMM yyyy');
      options.push({ value, label });
    }
    
    return options;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
      <div className="flex items-center text-gray-500">
        <Calendar className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Time Period:</span>
      </div>
      <Select
        value={selectedMonth}
        onChange={(e) => onChange(e.target.value)}
        options={getMonthOptions()}
        className="w-48"
      />
    </div>
  );
}
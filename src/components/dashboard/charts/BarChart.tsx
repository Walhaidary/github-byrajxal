import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DataPoint {
  date: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
}

export function BarChart({ data }: BarChartProps) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Average Lead Time (Days)',
        data: data.map(d => d.value),
        backgroundColor: '#93C5FD',
        borderColor: '#3B82F6',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}
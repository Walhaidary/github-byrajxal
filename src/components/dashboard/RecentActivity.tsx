import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatNumber } from '../../utils/formatters';

interface Activity {
  id: string;
  type: 'created' | 'approved' | 'paid';
  serial_number: string;
  service_provider_name: string;
  total_cost: number;
  date: string;
}

export function RecentActivity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const { data: receipts, error } = await supabase
          .from('service_receipts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        const formattedActivities: Activity[] = [];
        receipts?.forEach(receipt => {
          // Add creation activity
          formattedActivities.push({
            id: `${receipt.id}-created`,
            type: 'created',
            serial_number: receipt.serial_number,
            service_provider_name: receipt.service_provider_name,
            total_cost: receipt.total_cost,
            date: receipt.created_at
          });

          // Add approval activity if approved
          if (receipt.status === 'approved') {
            formattedActivities.push({
              id: `${receipt.id}-approved`,
              type: 'approved',
              serial_number: receipt.serial_number,
              service_provider_name: receipt.service_provider_name,
              total_cost: receipt.total_cost,
              date: receipt.approved_at || receipt.created_at
            });
          }

          // Add payment activity if paid
          if (receipt.payment_status === 'paid') {
            formattedActivities.push({
              id: `${receipt.id}-paid`,
              type: 'paid',
              serial_number: receipt.serial_number,
              service_provider_name: receipt.service_provider_name,
              total_cost: receipt.total_cost,
              date: receipt.payment_date || receipt.created_at
            });
          }
        });

        // Sort by date and take the most recent 5
        formattedActivities.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setActivities(formattedActivities.slice(0, 5));
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'paid':
        return <CreditCard className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getActivityText = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return 'created';
      case 'approved':
        return 'approved';
      case 'paid':
        return 'marked as paid';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-facebook-text mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-facebook-text mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => navigate(`/dashboard/receipt/${activity.id.split('-')[0]}`)}
          >
            {getActivityIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-facebook-text truncate">
                Receipt {activity.serial_number} was {getActivityText(activity.type)}
              </p>
              <p className="text-sm text-facebook-gray truncate">
                {activity.service_provider_name} - {formatNumber(activity.total_cost)}
              </p>
            </div>
            <div className="text-sm text-facebook-gray">
              {format(new Date(activity.date), 'MMM d, HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
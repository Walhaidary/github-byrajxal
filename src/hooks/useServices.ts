import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  name: string;
  price: number;
  provider_id: string;
}

export function useServices(providerId: string | null) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchServices() {
      if (!providerId) {
        setServices([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('services')
          .select('id, name, price, provider_id')
          .eq('provider_id', providerId)
          .order('name');

        if (fetchError) throw fetchError;
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch services'));
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [providerId]);

  return { services, loading, error };
}
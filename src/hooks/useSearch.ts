import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ServiceReceipt } from '../types/serviceReceipt';

export function useSearch() {
  const [searchResults, setSearchResults] = useState<ServiceReceipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchReceipts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error: searchError } = await supabase
        .from('service_receipts')
        .select(`
          *,
          service_receipt_items (
            id,
            service_cost,
            number_of_operations,
            number_of_units
          )
        `)
        .ilike('serial_number', `%${query}%`)
        .order('created_at', { ascending: false });

      if (searchError) throw searchError;
      setSearchResults(data || []);
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err : new Error('Search failed'));
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchResults, loading, error, searchReceipts };
}
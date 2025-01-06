import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';
import { ServiceReceipt } from '../../types/serviceReceipt';
import { formatNumber } from '../../utils/formatters';

interface SearchResultsProps {
  results: ServiceReceipt[];
  loading: boolean;
  error: Error | null;
  onClose: () => void;
}

export function SearchResults({ results, loading, error, onClose }: SearchResultsProps) {
  const navigate = useNavigate();

  const handleResultClick = (id: string) => {
    navigate(`/dashboard/receipt/${id}`);
    onClose();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        Failed to search receipts. Please try again.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No receipts found
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {results.map((receipt) => (
        <button
          key={receipt.id}
          onClick={() => handleResultClick(receipt.id)}
          className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between group"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">
              {receipt.serial_number}
            </p>
            <p className="text-sm text-gray-500">
              {receipt.service_provider_name} - {formatNumber(receipt.helper_field)}
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  );
}
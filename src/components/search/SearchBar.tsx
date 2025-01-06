import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import { SearchResults } from './SearchResults';
import { useClickOutside } from '../../hooks/useClickOutside';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchResults, loading, error, searchReceipts } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchRef, () => setIsOpen(false));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchReceipts(query);
        setIsOpen(true);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchReceipts]);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-64">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="search"
          placeholder="Search receipts by serial number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-white border border-transparent rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <SearchResults
            results={searchResults}
            loading={loading}
            error={error}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
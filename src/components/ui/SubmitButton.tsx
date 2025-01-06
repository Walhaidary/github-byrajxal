import React from 'react';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  loading: boolean;
  children: React.ReactNode;
}

export default function SubmitButton({ loading, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative flex w-full justify-center rounded-md bg-facebook-primary px-3 py-2 text-sm font-semibold text-white hover:bg-facebook-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-facebook-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : children}
    </button>
  );
}
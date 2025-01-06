import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-sm rounded px-2 py-1 mt-2">
        {content}
      </div>
    </div>
  );
}
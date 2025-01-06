import React from 'react';

interface LoginFormSectionProps {
  children: React.ReactNode;
}

export function LoginFormSection({ children }: LoginFormSectionProps) {
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}
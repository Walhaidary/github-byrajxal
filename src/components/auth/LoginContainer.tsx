import React from 'react';

interface LoginContainerProps {
  children: React.ReactNode;
}

export function LoginContainer({ children }: LoginContainerProps) {
  return (
    <div className="min-h-screen w-full flex">
      {children}
    </div>
  );
}
import React from 'react';

interface LoginHeroSectionProps {
  children: React.ReactNode;
}

export function LoginHeroSection({ children }: LoginHeroSectionProps) {
  return (
    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-b from-[#71c1d6] to-[#3485b7]">
      {children}
    </div>
  );
}
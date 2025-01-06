import React from 'react';

export function LoginHero() {
  return (
    <div className="h-full flex flex-col justify-between p-8 lg:p-12">
      <div className="flex items-center space-x-3">
        <img 
          src="https://docs.wfp.org/api/documents/WFP-0000134531/download/" 
          alt="WFP Logo" 
          className="h-12 lg:h-16"
        />
        <div className="text-white">
          <div className="text-xl lg:text-2xl font-bold">WFP</div>
          <div className="text-sm">World Food Programme</div>
        </div>
      </div>

      <div className="space-y-6">
        <blockquote className="text-2xl lg:text-3xl font-light text-white leading-snug">
          "Collaboration is the engine that drives logistics from mere coordination to seamless execution."
        </blockquote>
        <p className="text-white text-base lg:text-lg">- Wolfgang Haas</p>
      </div>

      <div /> {/* Spacer */}
    </div>
  );
}
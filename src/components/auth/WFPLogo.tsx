import React from 'react';

export function WFPLogo() {
  return (
    <div className="flex items-center space-x-2">
      <img 
        src="https://docs.wfp.org/api/documents/WFP-0000134531/download/" 
        alt="WFP Logo" 
        className="h-12"
      />
    </div>
  );
}
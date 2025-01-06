import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Truck, ArrowRight, Loader2 } from 'lucide-react';
import { signUp } from '../../lib/auth';

// ... rest of the imports and interfaces ...

export default function SignupForm({ adminMode = false }: SignupFormProps) {
  // ... component logic remains the same ...

  return (
    <div className={adminMode ? '' : 'w-full max-w-md space-y-8'}>
      {!adminMode && (
        <>
          <div className="flex justify-center">
            <Truck className="h-10 w-10 text-[#8b5cf6]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us to start managing your service receipts
          </p>
        </>
      )}

      {/* Rest of the form JSX remains the same */}
    </div>
  );
}
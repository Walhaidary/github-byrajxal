import React from 'react';

export function LoginLinks() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-end">
        <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
          Forgot password?
        </a>
      </div>
      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <a href="/signup" className="text-blue-600 hover:text-blue-500">
          Sign up
        </a>
      </div>
    </div>
  );
}
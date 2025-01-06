import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { LoginHero } from '../auth/LoginHero';

const ADMIN_PASSWORD = '733153303';

export function AdminPasswordModal() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminAuthTime', Date.now().toString());
        navigate('/dashboard/admin', { replace: true });
      } else {
        setError(true);
        setPassword('');
      }
    } catch (err) {
      console.error('Error in admin authentication:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <LoginHero />

      {/* Right side - Admin password form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-12">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 rounded-full bg-[#3485b7]/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-[#3485b7]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">Admin Access Required</h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Please enter the administrator password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-700">
                  Incorrect password. Please try again.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setError(false);
                    setPassword(e.target.value);
                  }}
                  required
                  autoFocus
                  disabled={loading}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#3485b7] focus:outline-none focus:ring-1 focus:ring-[#3485b7] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3485b7] hover:bg-[#71c1d6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3485b7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verifying...' : 'Continue to Admin'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3485b7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
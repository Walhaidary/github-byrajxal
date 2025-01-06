import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { signIn } from '../../lib/auth';
import { FormInput } from './FormInput';
import { FormError } from './FormError';

interface LocationState {
  from?: Location;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signIn(formData.email, formData.password);
      if (signInError) throw signInError;
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex items-center text-sm mb-8">
            <a href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </a>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <FormError message={error} />}

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex items-center justify-between">
            <a href="/forgot-password" className="text-sm text-[#3485b7] hover:text-[#71c1d6]">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                     shadow-sm text-sm font-medium text-white bg-[#3485b7] hover:bg-[#71c1d6] 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3485b7] 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <a href="/signup" className="text-sm text-[#3485b7] hover:text-[#71c1d6]">
              Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
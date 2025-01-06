import React, { useState } from 'react';
import { signUp } from '../../../lib/auth';
import { CreateUserForm } from './CreateUserForm';
import { Info } from 'lucide-react';
import { UserFormData } from './types';

const initialFormData: UserFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user'
};

export function CreateUser() {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: signUpError } = await signUp(formData.email, formData.password);

      if (signUpError) throw signUpError;

      setSuccess(true);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Header */}
      <div className="bg-blue-600 text-white py-6 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Create New User</h1>
          <p className="mt-1 text-blue-100">Add a new user to the system</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Info Box */}
          <div className="p-6 border-b border-gray-200 bg-blue-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Important Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    New users will need to verify their email address before accessing the system.
                    Make sure to provide a valid email address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create User Form */}
          <CreateUserForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            error={error}
            success={success}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
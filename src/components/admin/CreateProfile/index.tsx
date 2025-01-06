import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { CreateProfileForm } from './CreateProfileForm';
import { ProfileFormData } from './types';
import { validateProfileForm } from './validation';

const initialFormData: ProfileFormData = {
  email: '',
  password: '',
  role: 'user'
};

export function CreateProfile() {
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
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
    
    const validationErrors = validateProfileForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // First create the user in auth.users
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Failed to create user');

      // Update the user's role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: formData.role })
        .eq('id', authData.user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CreateProfileForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
        success={success}
        loading={loading}
      />
    </div>
  );
}

export default CreateProfile;
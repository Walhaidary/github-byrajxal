import { ProfileFormData } from './types';

export function validateProfileForm(data: ProfileFormData): Record<string, string | undefined> {
  const errors: Record<string, string | undefined> = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.role) {
    errors.role = 'Role is required';
  }

  return errors;
}
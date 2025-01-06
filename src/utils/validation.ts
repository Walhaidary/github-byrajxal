export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required';
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/.test(password);

  const errors = [];
  
  if (password.length < minLength) {
    errors.push('at least 8 characters');
  }
  if (!hasUpperCase) {
    errors.push('an uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('a lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('a number');
  }
  if (!hasSpecialChar) {
    errors.push('a special character');
  }

  if (errors.length > 0) {
    return `Password must contain ${errors.join(', ')}`;
  }

  return undefined;
};

export const validatePasswordConfirmation = (password: string, confirmPassword: string): string | undefined => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return undefined;
};
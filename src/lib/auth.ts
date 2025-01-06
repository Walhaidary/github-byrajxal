import { AuthError, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

export async function signIn(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<AuthResponse> {
  try {
    // Clear any existing session first
    await supabase.auth.signOut();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
      options: {
        persistSession: rememberMe
      }
    });

    if (error) {
      console.error('Sign in error:', error);
      return { 
        user: null, 
        error: {
          ...error,
          message: 'Invalid email or password. Please try again.'
        }
      };
    }

    return { user: data?.user ?? null, error: null };
  } catch (error) {
    console.error('Authentication error:', error);
    return { 
      user: null, 
      error: error as AuthError 
    };
  }
}

export async function signUp(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          email: email.trim().toLowerCase(),
          role: 'user'
        }
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }

    if (!data.user) {
      return { 
        user: null, 
        error: new Error('Failed to create user account') as AuthError 
      };
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      user: null, 
      error: error as AuthError 
    };
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear all auth state
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthTime');
    sessionStorage.clear();
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

export async function resetPassword(email: string): Promise<AuthError | null> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );
    
    return error;
  } catch (error) {
    console.error('Password reset error:', error);
    return error as AuthError;
  }
}
import { supabase } from './supabase';
import { Profile } from '../types/profile';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Failed to update profile')
    };
  }
}
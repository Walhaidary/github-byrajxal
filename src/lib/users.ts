import { supabase } from './supabase';

interface UserRoleUpdate {
  userId: string;
  role: string;
}

export async function updateUserRoles(updates: UserRoleUpdate[]): Promise<{ success: boolean; error?: Error }> {
  try {
    // Use Promise.all to handle multiple updates
    await Promise.all(
      updates.map(update => 
        supabase
          .from('profiles')
          .update({ 
            role: update.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.userId)
      )
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating user roles:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to update user roles') 
    };
  }
}
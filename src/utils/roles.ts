
/**
 * Utility functions for handling user roles
 */
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/contexts/auth/types';
import { toast } from 'sonner';

/**
 * Safe function to get a user's role from either profiles or assignments
 * This avoids the recursive RLS policy issue
 */
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    // First try to get role from profiles (fallback)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (!profileError && profileData?.role) {
      return profileData.role as UserRole;
    }
    
    // If that fails or no role, try to get from user_role_assignments
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_role_assignments')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleError) {
        if (roleError.code === '42P17') {
          console.log('Detected recursive policy issue in getUserRole');
          // If we hit recursion, use the profile role we already tried to fetch
          return profileData?.role as UserRole || null;
        }
        
        if (roleError.code !== 'PGRST116') { // No rows found error
          console.error('Error fetching role assignment:', roleError);
        }
        return null;
      }
      
      return roleData?.role as UserRole || null;
    } catch (err) {
      console.error('Exception in role assignments fetch:', err);
      return null;
    }
  } catch (err) {
    console.error('Exception in getUserRole:', err);
    return null;
  }
};

/**
 * Update a user's role safely
 */
export const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // Update user_role_assignments first
    const { error: roleError } = await supabase
      .from('user_role_assignments')
      .update({ 
        role, 
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId);
    
    if (roleError) {
      console.error("Error updating user role in assignments:", roleError);
      
      // Try to update profile as fallback
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (profileError) {
        console.error("Error updating user role in profile:", profileError);
        toast.error("Failed to update user role");
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Exception in updateUserRole:", error);
    return false;
  }
};

/**
 * Get all users with their roles
 * This avoids the recursive RLS policy issue by using a different approach
 */
export const getAllUsersWithRoles = async () => {
  try {
    console.log("Fetching all users with roles");
    
    // Get profiles data with roles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, email, name, role, created_at');
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }
    
    console.log("Profiles fetched:", profilesData?.length || 0, "records");
    
    // Format the data in the expected format for the UI
    const usersWithRoles = profilesData?.map(profile => {
      return {
        id: profile.user_id,
        user_id: profile.user_id,
        email: profile.email,
        full_name: profile.name,
        role: profile.role,
        created_at: profile.created_at
      };
    }) || [];
    
    return usersWithRoles;
  } catch (error) {
    console.error("Error in getAllUsersWithRoles:", error);
    return [];
  }
};

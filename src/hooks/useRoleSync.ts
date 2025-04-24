
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '@/contexts/auth/types';

// Define the payload type to properly handle the role property
interface RoleAssignmentPayload {
  new: {
    role: UserRole;
    user_id: string;
    [key: string]: any;
  };
  old: {
    role?: UserRole;
    user_id?: string;
    [key: string]: any;
  };
}

export const useRoleSync = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);

    // Initial fetch of user roles
    const fetchUserRoles = async () => {
      try {
        // Try getting role from profiles table instead (as fallback)
        if (user.role) {
          console.log("Using role from user profile:", user.role);
          setLoading(false);
          return;
        }
        
        // Try to get role from user_role_assignments table
        try {
          const { data, error } = await supabase
            .from('user_role_assignments')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (error) {
            if (error.code === '42P17') { // Infinite recursion error
              console.log("Detected recursive policy issue, using profile role instead");
              // Continue using the user.role from profiles
            } else if (error.code !== 'PGRST116') { // No rows found error
              console.error('Error fetching user roles from assignments:', error);
              toast.error('Failed to fetch user role');
            }
          } else if (data?.role && data.role !== user.role) {
            setUser({ ...user, role: data.role as UserRole });
            toast.info(`Your role is set to ${data.role}`);
          }
        } catch (err) {
          console.error('Exception in fetchRoleAssignments:', err);
        }
      } catch (err) {
        console.error('Exception in fetchUserRoles:', err);
      } finally {
        setLoading(false);
      }
    };

    // Subscribe to real-time role changes
    const channel = supabase
      .channel('role-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_role_assignments',
          filter: `user_id=eq.${user.id}`
        },
        async (payload: any) => {
          const typedPayload = payload as RoleAssignmentPayload;
          if (typedPayload.new?.role && typedPayload.new.role !== user.role) {
            setUser({ ...user, role: typedPayload.new.role });
            toast.info(`Your role has been updated to ${typedPayload.new.role}`);
          }
        }
      )
      .subscribe();

    fetchUserRoles();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, setUser, user]);

  return { loading };
};

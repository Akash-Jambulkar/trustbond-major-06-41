
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '@/contexts/auth/types';

export const useRoleSync = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);

    // Initial fetch of user roles
    const fetchUserRoles = async () => {
      const { data, error } = await supabase
        .from('user_role_assignments')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user roles:', error);
        toast.error('Failed to fetch user roles');
        return;
      }

      if (data?.role && data.role !== user.role) {
        setUser({ ...user, role: data.role as UserRole });
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
        async (payload) => {
          if (payload.new?.role && payload.new.role !== user.role) {
            setUser({ ...user, role: payload.new.role as UserRole });
            toast.info(`Your role has been updated to ${payload.new.role}`);
          }
        }
      )
      .subscribe();

    fetchUserRoles();
    setLoading(false);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { loading };
};

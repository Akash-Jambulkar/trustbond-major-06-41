
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserRole, User } from '../types';
import { fetchUserProfile, createUserWithProfile, mockWalletUser } from '../authUtils';

export const useAuthMethods = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void,
  setIsMFARequired: (value: boolean) => void,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error("Login failed: " + error.message);
        return false;
      }

      const profile = await fetchUserProfile(data.user.id);
      if (!profile) return false;

      let userRole: UserRole = 'user';
      
      try {
        const { data: roleData } = await supabase
          .from('user_role_assignments')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
          
        if (roleData?.role) {
          userRole = roleData.role as UserRole;
        } else if (profile.role) {
          userRole = profile.role as UserRole;
        }
      } catch (err) {
        console.warn("Error fetching role, using profile role instead:", err);
        userRole = profile.role as UserRole || 'user';
      }
      
      const userWithProfile = { ...profile, role: userRole };
      setUser(userWithProfile);
      setIsAuthenticated(true);

      if (userWithProfile.mfa_enabled) {
        setIsMFARequired(true);
        toast.info("Multi-factor authentication required");
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Login submission error:", error);
      toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole = 'user') => {
    setIsLoading(true);
    try {
      const success = await createUserWithProfile(email, password, name, role);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithWallet = async (address: string) => {
    toast.success(`Logged in with wallet address: ${address}`);
    const mockUser = mockWalletUser(address);
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed");
        return;
      }

      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout submission error:", error);
      toast.error("Logout failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    loginWithWallet,
    logout,
    isLoading
  };
};

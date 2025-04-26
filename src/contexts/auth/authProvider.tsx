import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthContextType, User, UserRole } from "./types";
import { fetchUserProfile, createUserWithProfile, mapUserWithProfile, mockWalletUser } from "./authUtils";
import { setupUserMFA, verifyUserMFA, disableUserMFA } from "./mfaUtils";
import { RoleSyncProvider } from "@/components/RoleSyncProvider";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMFARequired, setIsMFARequired] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const profile = await fetchUserProfile(session.user.id);
          if (!profile) return;

          const userWithProfile = mapUserWithProfile(session.user, profile);
          setUser(userWithProfile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Session loading error:", error);
        toast.error("Failed to load session");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error("Login failed: " + error.message);
        return false;
      }

      const profile = await fetchUserProfile(data.user.id);
      if (!profile) return false;

      const { data: roleData } = await supabase
        .from('user_role_assignments')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      const userWithProfile = mapUserWithProfile(data.user, {
        ...profile,
        role: roleData?.role || 'user'
      });
      
      setUser(userWithProfile);
      setIsAuthenticated(true);

      if (userWithProfile.mfa_enabled) {
        setIsMFARequired(true);
        toast.info("Multi-factor authentication required");
        navigate("/mfa-verify");
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
      
      if (success) {
        const { error: roleError } = await supabase
          .from('user_role_assignments')
          .insert([
            { 
              user_id: (await supabase.auth.getUser()).data.user?.id,
              role: role
            }
          ]);

        if (roleError) {
          console.error("Role assignment error:", roleError);
          toast.error("Failed to assign user role");
          return false;
        }
      }

      return success;
    } finally {
      setIsLoading(false);
    }
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
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout submission error:", error);
      toast.error("Logout failed: " + (error instanceof Error ? error.message : "Unknown error"));
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

  const setupMFA = async (phoneNumber: string, method: "sms" | "email") => {
    const success = await setupUserMFA(phoneNumber, method);
    if (success && user) {
      const updatedUser = { ...user, mfa_enabled: true };
      setUser(updatedUser);
    }
    return success;
  };

  const verifyMFA = async (code: string) => {
    const success = await verifyUserMFA(code);
    if (success) {
      setIsMFARequired(false);
      if (user) {
        navigate(`/dashboard/${user.role}`);
      } else {
        navigate("/login");
      }
    }
    return success;
  };

  const disableMFA = async (userId: string) => {
    if (!user) {
      toast.error("No user logged in");
      return false;
    }
    
    const success = await disableUserMFA(user.id);
    if (success) {
      setUser(prevUser => prevUser ? { ...prevUser, mfa_enabled: false } : null);
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // Add setUser to the context value
        isAuthenticated,
        isLoading,
        login,
        loginWithWallet,
        register,
        logout,
        setupMFA,
        verifyMFA,
        isMFARequired,
        disableMFA
      }}
    >
      <RoleSyncProvider>
        {children}
      </RoleSyncProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

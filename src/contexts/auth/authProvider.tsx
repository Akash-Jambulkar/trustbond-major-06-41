
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthContextType, User } from "./types";
import { fetchUserProfile, createUserWithProfile, mapUserWithProfile, mockWalletUser } from "./authUtils";
import { setupUserMFA, verifyUserMFA, disableUserMFA } from "./mfaUtils";

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
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

  // Implement the login function
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

      const userWithProfile = mapUserWithProfile(data.user, profile);
      setUser(userWithProfile);
      setIsAuthenticated(true);
      
      // Check if MFA is required
      if (userWithProfile.mfa_enabled) {
        setIsMFARequired(true);
        toast.info("Multi-factor authentication required");
        navigate("/mfa-verify");
      } else {
        navigate(`/dashboard/${userWithProfile.role}`);
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

  // Implement the register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const success = await createUserWithProfile(email, password, name);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  // Implement the logout function
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

  // Implement the loginWithWallet function
  const loginWithWallet = async (address: string) => {
    // Mock wallet-based authentication for now
    toast.success(`Logged in with wallet address: ${address}`);
    const mockUser = mockWalletUser(address);
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  // Implement setupMFA function
  const setupMFA = async (phoneNumber: string, method: "sms" | "email") => {
    const success = await setupUserMFA(phoneNumber, method);
    if (success && user) {
      // Update user with MFA enabled
      const updatedUser = { ...user, mfa_enabled: true };
      setUser(updatedUser);
    }
    return success;
  };

  // Implement verifyMFA function
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

  // Implement disableMFA method
  const disableMFA = async () => {
    if (!user) {
      toast.error("No user logged in");
      return false;
    }
    
    const success = await disableUserMFA(user.id);
    if (success) {
      // Update the local user state
      setUser(prevUser => prevUser ? { ...prevUser, mfa_enabled: false } : null);
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

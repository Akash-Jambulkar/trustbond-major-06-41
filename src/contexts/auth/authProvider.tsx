
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthContextType, User } from "./types";
import { fetchUserProfile, mapUserWithProfile } from "./authUtils";
import { RoleSyncProvider } from "@/components/RoleSyncProvider";
import { useAuthMethods } from "./hooks/useAuthMethods";
import { useMFAAuth } from "./hooks/useMFAAuth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const {
    isMFARequired,
    setIsMFARequired,
    setupMFA,
    verifyMFA,
    disableMFA
  } = useMFAAuth(user, setUser);

  const {
    login,
    register,
    loginWithWallet,
    logout,
  } = useAuthMethods(setUser, setIsAuthenticated, setIsMFARequired);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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


import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
import { AuthContextType, AuthUser } from "./auth/types";
import { demoAuthService } from "./auth/demoAuth";
import { productionAuthService } from "./auth/productionAuth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <AuthProviderWithRouter>{children}</AuthProviderWithRouter>;
};

const AuthProviderWithRouter = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDemoMode } = useMode();
  const navigate = useNavigate();

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("trustbond_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const authService = isDemoMode ? demoAuthService : productionAuthService;
        
        // Verify if the user exists in the current mode
        authService.login(parsedUser.email, "").then(
          () => setUser(parsedUser),
          () => localStorage.removeItem("trustbond_user")
        );
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("trustbond_user");
      }
    }
    setIsLoading(false);
  }, [isDemoMode]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authService = isDemoMode ? demoAuthService : productionAuthService;
      const userData = await authService.login(email, password);
      setUser(userData);
      localStorage.setItem("trustbond_user", JSON.stringify(userData));
      navigate(`/dashboard/${userData.role}`);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithWallet = async (walletAddress: string) => {
    setIsLoading(true);
    try {
      const authService = isDemoMode ? demoAuthService : productionAuthService;
      const userData = await authService.loginWithWallet(walletAddress);
      setUser(userData);
      localStorage.setItem("trustbond_user", JSON.stringify(userData));
      navigate(`/dashboard/${userData.role}`);
    } catch (error) {
      console.error("Wallet login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: AuthUser["role"]) => {
    setIsLoading(true);
    try {
      const authService = isDemoMode ? demoAuthService : productionAuthService;
      
      if (isDemoMode) {
        await authService.register(name, email, password, role);
        navigate("/login");
      } else {
        const newUser = await productionAuthService.register(name, email, password, role);
        setUser(newUser);
        localStorage.setItem("trustbond_user", JSON.stringify(newUser));
        navigate(`/dashboard/${role}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("trustbond_user");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithWallet,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";

type UserRole = "user" | "bank" | "admin" | null;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithWallet: (walletAddress: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts
const DEMO_ACCOUNTS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@trustbond.com",
    password: "admin123",
    role: "admin",
    walletAddress: "0x1234567890123456789012345678901234567890"
  },
  {
    id: "2",
    name: "Bank Manager",
    email: "bank@trustbond.com",
    password: "bank123",
    role: "bank",
    walletAddress: "0x2345678901234567890123456789012345678901"
  },
  {
    id: "3",
    name: "John Doe",
    email: "user@trustbond.com",
    password: "user123",
    role: "user",
    walletAddress: "0x3456789012345678901234567890123456789012"
  },
] as const;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
        // Verify if the user should be loaded based on the current mode
        const isDemoUser = DEMO_ACCOUNTS.some(acc => acc.email === parsedUser.email);
        
        if ((isDemoMode && isDemoUser) || (!isDemoMode && !isDemoUser)) {
          setUser(parsedUser);
        } else {
          // If mode doesn't match user type, log them out
          localStorage.removeItem("trustbond_user");
        }
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("trustbond_user");
      }
    }
    setIsLoading(false);
  }, [isDemoMode]);

  // Login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isDemoMode) {
        // Demo mode login with predefined accounts
        const account = DEMO_ACCOUNTS.find(
          (acc) => acc.email === email && acc.password === password
        );

        if (!account) {
          throw new Error("Invalid credentials");
        }

        const userData: AuthUser = {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role as UserRole,
          walletAddress: account.walletAddress,
        };

        setUser(userData);
        localStorage.setItem("trustbond_user", JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);
        
        // Navigate to the appropriate dashboard
        navigate(`/dashboard/${userData.role}`);
      } else {
        // Production mode would use a real API
        toast.error("Production mode authentication not implemented yet");
        // Here you would make a real API call to authenticate
        // const response = await fetch('/api/auth/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password })
        // });
        // const data = await response.json();
        // if (!data.success) throw new Error(data.message);
        // setUser(data.user);
        // localStorage.setItem("trustbond_user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Login with wallet address (MetaMask)
  const loginWithWallet = async (walletAddress: string) => {
    setIsLoading(true);
    try {
      if (isDemoMode) {
        // Demo mode wallet login
        const account = DEMO_ACCOUNTS.find(
          (acc) => acc.walletAddress.toLowerCase() === walletAddress.toLowerCase()
        );

        if (!account) {
          throw new Error("Wallet not registered");
        }

        const userData: AuthUser = {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role as UserRole,
          walletAddress: account.walletAddress,
        };

        setUser(userData);
        localStorage.setItem("trustbond_user", JSON.stringify(userData));
        toast.success(`Wallet connected for ${userData.name}!`);
        
        // Navigate to the appropriate dashboard
        navigate(`/dashboard/${userData.role}`);
      } else {
        // Production mode would use a real API
        toast.error("Production mode wallet authentication not implemented yet");
        // Here you would make a real API call to authenticate with wallet
      }
    } catch (error) {
      console.error("Wallet login error:", error);
      toast.error("Wallet login failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Register a new user
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      if (isDemoMode) {
        // In demo mode, just show a success message and redirect
        // Check if email already exists in demo accounts
        const emailExists = DEMO_ACCOUNTS.some(acc => acc.email === email);
        if (emailExists) {
          throw new Error("Email already registered");
        }

        toast.success("Registration successful! Please login with the demo accounts.");
        navigate("/login");
      } else {
        // Production mode would use a real API
        toast.error("Production mode registration not implemented yet");
        // Here you would make a real API call to register
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("trustbond_user");
    toast.info("You have been logged out");
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

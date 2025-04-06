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

// In-memory storage for production mode users
const PRODUCTION_USERS: AuthUser[] = [];

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
        // Production mode login
        // First check in-memory for simplicity
        const productionUser = PRODUCTION_USERS.find(
          (user) => user.email === email
        );

        if (!productionUser) {
          throw new Error("User not found. Please register first.");
        }

        // In a real production app, we would verify the password with proper hashing
        // For this demo of production mode, we'll just check if the user exists
        setUser(productionUser);
        localStorage.setItem("trustbond_user", JSON.stringify(productionUser));
        toast.success(`Welcome back, ${productionUser.name}!`);
        
        // Navigate to the appropriate dashboard
        navigate(`/dashboard/${productionUser.role}`);
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
        // Production mode wallet login
        const productionUser = PRODUCTION_USERS.find(
          (user) => user.walletAddress.toLowerCase() === walletAddress.toLowerCase()
        );

        if (!productionUser) {
          throw new Error("Wallet not registered. Please register first.");
        }

        setUser(productionUser);
        localStorage.setItem("trustbond_user", JSON.stringify(productionUser));
        toast.success(`Wallet connected for ${productionUser.name}!`);
        
        // Navigate to the appropriate dashboard
        navigate(`/dashboard/${productionUser.role}`);
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
        // Production mode registration
        // First, check if email already exists
        const emailExists = PRODUCTION_USERS.some(user => user.email === email);
        if (emailExists) {
          throw new Error("Email already registered");
        }

        // Generate a simple random wallet address for new users
        // In a real app, this would be handled differently
        const randomWalletAddress = "0x" + Array.from({length: 40}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('');

        // Create new user
        const newUser: AuthUser = {
          id: Date.now().toString(), // Simple ID generation
          name,
          email,
          role,
          walletAddress: randomWalletAddress,
        };

        // Add to in-memory storage
        PRODUCTION_USERS.push(newUser);

        toast.success("Registration successful! You can now login.");
        
        // Auto-login the user after successful registration
        setUser(newUser);
        localStorage.setItem("trustbond_user", JSON.stringify(newUser));
        
        // Navigate to the appropriate dashboard
        navigate(`/dashboard/${role}`);
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

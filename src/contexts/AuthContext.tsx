import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthUser, UserRole } from './types';
import { productionAuthService } from './auth/productionAuth';
import { toast } from 'sonner';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser | undefined>;
  loginWithWallet: (walletAddress: string) => Promise<AuthUser | undefined>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<AuthUser | undefined>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Only use the production authentication service
  const authService = productionAuthService;
  
  useEffect(() => {
    const storedUser = localStorage.getItem('trustbond_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      localStorage.setItem('trustbond_user', JSON.stringify(userData));
      
      // Navigate based on user role
      if (userData.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (userData.role === 'bank') {
        navigate('/dashboard/bank');
      } else {
        navigate('/dashboard/user');
      }
      
      return userData;
    } catch (error) {
      toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
      return undefined;
    }
  };

  const loginWithWallet = async (walletAddress: string) => {
    try {
      const userData = await authService.loginWithWallet(walletAddress);
      setUser(userData);
      localStorage.setItem('trustbond_user', JSON.stringify(userData));
      
      // Navigate based on user role
      if (userData.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (userData.role === 'bank') {
        navigate('/dashboard/bank');
      } else {
        navigate('/dashboard/user');
      }
      
      return userData;
    } catch (error) {
      toast.error("Wallet login failed: " + (error instanceof Error ? error.message : "Unknown error"));
      return undefined;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const userData = await authService.register(name, email, password, role);
      setUser(userData);
      localStorage.setItem('trustbond_user', JSON.stringify(userData));
      
      // Navigate based on user role
      if (userData.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (userData.role === 'bank') {
        navigate('/dashboard/bank');
      } else {
        navigate('/dashboard/user');
      }
      
      return userData;
    } catch (error) {
      toast.error("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
      return undefined;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trustbond_user');
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
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

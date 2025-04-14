
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthUser, UserRole, AuthContextType } from './auth/types';
import { productionAuthService } from './auth/productionAuth';
import { toast } from 'sonner';
import { generateMFACode, sendMFACodeViaEmail, storeMFACode, retrieveMFACode, clearMFACode, storeMFAPreferences } from '@/utils/mfaUtils';

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
  const [isMFARequired, setIsMFARequired] = useState(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
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
      
      // If MFA is enabled for the user, require verification
      if (userData.mfaEnabled) {
        setPendingUser(userData);
        setIsMFARequired(true);
        
        // Generate and send MFA code
        const code = generateMFACode();
        await sendMFACodeViaEmail(userData.email, code);
        storeMFACode(userData.id, code);
        
        // Navigate to MFA verification page
        navigate('/mfa-verify');
        return undefined;
      }
      
      // No MFA needed, complete login
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
      
      // If MFA is enabled for the user, require verification
      if (userData.mfaEnabled) {
        setPendingUser(userData);
        setIsMFARequired(true);
        
        // Generate and send MFA code
        const code = generateMFACode();
        await sendMFACodeViaEmail(userData.email, code);
        storeMFACode(userData.id, code);
        
        // Navigate to MFA verification page
        navigate('/mfa-verify');
        return undefined;
      }
      
      // No MFA needed, complete login
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
  
  const verifyMFA = async (code: string): Promise<boolean> => {
    if (!pendingUser) {
      toast.error("No pending authentication found");
      return false;
    }
    
    const storedCode = retrieveMFACode(pendingUser.id);
    
    if (!storedCode) {
      toast.error("Verification code expired. Please login again.");
      setIsMFARequired(false);
      setPendingUser(null);
      navigate('/login');
      return false;
    }
    
    if (code !== storedCode) {
      toast.error("Incorrect verification code");
      return false;
    }
    
    // Code is correct, clear it and complete login
    clearMFACode(pendingUser.id);
    
    // Mark user as verified and complete login
    const verifiedUser = { ...pendingUser, mfaVerified: true };
    setUser(verifiedUser);
    setPendingUser(null);
    setIsMFARequired(false);
    localStorage.setItem('trustbond_user', JSON.stringify(verifiedUser));
    
    // Navigate based on user role
    if (verifiedUser.role === 'admin') {
      navigate('/dashboard/admin');
    } else if (verifiedUser.role === 'bank') {
      navigate('/dashboard/bank');
    } else {
      navigate('/dashboard/user');
    }
    
    toast.success("Verification successful");
    return true;
  };
  
  const setupMFA = async (phoneNumber: string, method: 'sms' | 'email'): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to set up MFA");
      return false;
    }
    
    try {
      // Enable MFA for the user
      const updatedUser = { 
        ...user, 
        mfaEnabled: true,
        phone: method === 'sms' ? phoneNumber : user.phone
      };
      
      // Store MFA preferences
      storeMFAPreferences(user.id, {
        enabled: true,
        method,
        phoneNumber: method === 'sms' ? phoneNumber : undefined
      });
      
      // Update user in local storage
      setUser(updatedUser);
      localStorage.setItem('trustbond_user', JSON.stringify(updatedUser));
      
      toast.success("Two-factor authentication enabled successfully");
      return true;
    } catch (error) {
      toast.error("Failed to set up MFA: " + (error instanceof Error ? error.message : "Unknown error"));
      return false;
    }
  };
  
  const disableMFA = async (): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to disable MFA");
      return false;
    }
    
    try {
      // Disable MFA for the user
      const updatedUser = { ...user, mfaEnabled: false };
      
      // Store MFA preferences
      storeMFAPreferences(user.id, {
        enabled: false,
        method: 'email'
      });
      
      // Update user in local storage
      setUser(updatedUser);
      localStorage.setItem('trustbond_user', JSON.stringify(updatedUser));
      
      toast.success("Two-factor authentication disabled successfully");
      return true;
    } catch (error) {
      toast.error("Failed to disable MFA: " + (error instanceof Error ? error.message : "Unknown error"));
      return false;
    }
  };
  
  const isAuthenticated = !!user;
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isMFARequired,
        login,
        loginWithWallet,
        register,
        logout,
        verifyMFA,
        setupMFA,
        disableMFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

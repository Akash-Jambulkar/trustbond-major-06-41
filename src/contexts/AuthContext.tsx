
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
import { AuthContextType, AuthUser } from "./auth/types";
import { demoAuthService } from "./auth/demoAuth";
import { productionAuthService } from "./auth/productionAuth";
import { 
  generateMFACode, 
  sendMFACodeViaSMS, 
  sendMFACodeViaEmail, 
  storeMFACode, 
  retrieveMFACode,
  clearMFACode, 
  validateMFACode,
  storeMFAPreferences,
  retrieveMFAPreferences,
  MFAMethod
} from "@/utils/mfaUtils";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <AuthProviderWithRouter>{children}</AuthProviderWithRouter>;
};

const AuthProviderWithRouter = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMFARequired, setIsMFARequired] = useState(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
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
          () => {
            // Check if user has MFA enabled but not yet verified for this session
            const mfaPrefs = retrieveMFAPreferences(parsedUser.id);
            if (mfaPrefs && mfaPrefs.enabled && !parsedUser.mfaVerified) {
              setPendingUser(parsedUser);
              setIsMFARequired(true);
            } else {
              setUser(parsedUser);
            }
          },
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
      
      // Check if MFA is enabled for this user
      const mfaPrefs = retrieveMFAPreferences(userData.id);
      
      if (mfaPrefs && mfaPrefs.enabled) {
        // Generate and send MFA code
        const mfaCode = generateMFACode();
        storeMFACode(userData.id, mfaCode);
        
        if (mfaPrefs.method === 'sms' && mfaPrefs.phoneNumber) {
          await sendMFACodeViaSMS(mfaPrefs.phoneNumber, mfaCode);
        } else {
          await sendMFACodeViaEmail(userData.email, mfaCode);
        }
        
        // Store pending user and require MFA verification
        setPendingUser(userData);
        setIsMFARequired(true);
        
        // Navigate to MFA verification page
        navigate("/mfa-verify");
      } else {
        // No MFA required, proceed with login
        setUser(userData);
        localStorage.setItem("trustbond_user", JSON.stringify(userData));
        navigate(`/dashboard/${userData.role}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
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
      
      // Check if MFA is enabled for this user
      const mfaPrefs = retrieveMFAPreferences(userData.id);
      
      if (mfaPrefs && mfaPrefs.enabled) {
        // Generate and send MFA code
        const mfaCode = generateMFACode();
        storeMFACode(userData.id, mfaCode);
        
        if (mfaPrefs.method === 'sms' && mfaPrefs.phoneNumber) {
          await sendMFACodeViaSMS(mfaPrefs.phoneNumber, mfaCode);
        } else {
          await sendMFACodeViaEmail(userData.email, mfaCode);
        }
        
        // Store pending user and require MFA verification
        setPendingUser(userData);
        setIsMFARequired(true);
        
        // Navigate to MFA verification page
        navigate("/mfa-verify");
      } else {
        // No MFA required, proceed with login
        setUser(userData);
        localStorage.setItem("trustbond_user", JSON.stringify(userData));
        navigate(`/dashboard/${userData.role}`);
      }
    } catch (error) {
      console.error("Wallet login error:", error);
      toast.error("Wallet login failed. Please try again or register first.");
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
      toast.error("Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMFA = async (code: string): Promise<boolean> => {
    if (!pendingUser) {
      toast.error("No pending authentication");
      return false;
    }
    
    const storedCode = retrieveMFACode(pendingUser.id);
    if (!storedCode) {
      toast.error("Verification code expired. Please log in again.");
      return false;
    }
    
    if (validateMFACode(code, storedCode)) {
      // Clear the used MFA code
      clearMFACode(pendingUser.id);
      
      // Update user with MFA verified flag
      const verifiedUser = {
        ...pendingUser,
        mfaVerified: true
      };
      
      setUser(verifiedUser);
      setPendingUser(null);
      setIsMFARequired(false);
      
      // Save to localStorage
      localStorage.setItem("trustbond_user", JSON.stringify(verifiedUser));
      
      // Navigate to dashboard
      navigate(`/dashboard/${verifiedUser.role}`);
      
      return true;
    } else {
      toast.error("Invalid verification code. Please try again.");
      return false;
    }
  };

  const setupMFA = async (phoneNumber: string, method: MFAMethod): Promise<boolean> => {
    if (!user) {
      toast.error("You need to be logged in to set up MFA");
      return false;
    }
    
    try {
      // Store MFA preferences
      storeMFAPreferences(user.id, {
        enabled: true,
        method,
        phoneNumber: method === 'sms' ? phoneNumber : undefined
      });
      
      // Update user with MFA enabled flag
      const updatedUser = {
        ...user,
        mfaEnabled: true,
        phone: phoneNumber
      };
      
      setUser(updatedUser);
      localStorage.setItem("trustbond_user", JSON.stringify(updatedUser));
      
      toast.success("Multi-factor authentication enabled successfully");
      return true;
    } catch (error) {
      console.error("MFA setup error:", error);
      toast.error("Failed to set up multi-factor authentication");
      return false;
    }
  };

  const disableMFA = async (): Promise<boolean> => {
    if (!user) {
      toast.error("You need to be logged in to disable MFA");
      return false;
    }
    
    try {
      // Store MFA preferences (disabled)
      storeMFAPreferences(user.id, {
        enabled: false,
        method: 'email'
      });
      
      // Update user without MFA enabled flag
      const updatedUser = {
        ...user,
        mfaEnabled: false
      };
      
      setUser(updatedUser);
      localStorage.setItem("trustbond_user", JSON.stringify(updatedUser));
      
      toast.success("Multi-factor authentication disabled");
      return true;
    } catch (error) {
      console.error("MFA disable error:", error);
      toast.error("Failed to disable multi-factor authentication");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setPendingUser(null);
    setIsMFARequired(false);
    localStorage.removeItem("trustbond_user");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isMFARequired,
        login,
        loginWithWallet,
        register,
        logout,
        verifyMFA,
        setupMFA,
        disableMFA
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


export type UserRole = 'user' | 'bank' | 'admin';

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  role: UserRole;
  mfaEnabled?: boolean; 
  kyc_status?: string;
  walletAddress?: string;
  wallet_address?: string; // For backward compatibility
  trust_score?: number;
  // Adding missing properties that are referenced in the code
  user_id?: string; // Add this for backward compatibility
  phone?: string;
  address?: string;
  // Add app_metadata and user_metadata
  app_metadata?: any;
  user_metadata?: any;
  // Add other properties used in the codebase
  aud?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithWallet: (address: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  setupMFA: (phoneNumber: string, method: "sms" | "email") => Promise<boolean>;
  verifyMFA: (code: string) => Promise<boolean>;
  isMFARequired: boolean;
  disableMFA: (userId: string) => Promise<boolean>;
}

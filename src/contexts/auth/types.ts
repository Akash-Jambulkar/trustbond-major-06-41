
export type UserRole = "user" | "bank" | "admin";

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  walletAddress?: string;
  phone?: string;
  address?: string;
  mfa_enabled?: boolean;
  mfaEnabled?: boolean; // For compatibility with components expecting mfaEnabled
  mfaVerified?: boolean;
  created_at?: string;
  updated_at?: string;
  app_metadata?: any;
  user_metadata?: any;
  aud?: string;
  user_id?: string; // For compatibility with components expecting user_id
}

// Define the User type to match both Supabase User and our custom UserProfile
export type User = {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  role: UserRole;
  mfa_enabled: boolean;
  kyc_status?: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  app_metadata?: any;
  user_metadata?: any;
  aud?: string;
  phone?: string;
  address?: string;
  walletAddress?: string;
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMFARequired?: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithWallet?: (walletAddress: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyMFA?: (code: string) => Promise<boolean>;
  setupMFA?: (phoneNumber: string, method: 'sms' | 'email') => Promise<boolean>;
  disableMFA?: (userId: string) => Promise<boolean>;
}

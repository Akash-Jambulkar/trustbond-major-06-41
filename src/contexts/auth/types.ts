
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

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMFARequired?: boolean;
  login: (email: string, password: string) => Promise<AuthUser | undefined>;
  loginWithWallet?: (walletAddress: string) => Promise<AuthUser | undefined>;
  register: (name: string, email: string, password: string) => Promise<AuthUser | undefined>;
  logout: () => void;
  verifyMFA?: (code: string) => Promise<boolean>;
  setupMFA?: (phoneNumber: string, method: 'sms' | 'email') => Promise<boolean>;
  disableMFA?: () => Promise<boolean>;
}

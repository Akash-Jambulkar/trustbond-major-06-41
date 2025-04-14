
export type UserRole = "user" | "bank" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress: string;
  phone?: string;
  address?: string;
  mfaEnabled?: boolean;
  mfaVerified?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMFARequired: boolean;
  login: (email: string, password: string) => Promise<AuthUser | undefined>;
  loginWithWallet: (walletAddress: string) => Promise<AuthUser | undefined>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<AuthUser | undefined>;
  logout: () => void;
  verifyMFA: (code: string) => Promise<boolean>;
  setupMFA: (phoneNumber: string, method: 'sms' | 'email') => Promise<boolean>;
  disableMFA: () => Promise<boolean>;
}

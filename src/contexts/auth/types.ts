
export type UserRole = "user" | "bank" | "admin" | null;

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
  isAuthenticated: boolean;
  isLoading: boolean;
  isMFARequired: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithWallet: (walletAddress: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  verifyMFA: (code: string) => Promise<boolean>;
  setupMFA: (phoneNumber: string, method: 'sms' | 'email') => Promise<boolean>;
  disableMFA: () => Promise<boolean>;
}

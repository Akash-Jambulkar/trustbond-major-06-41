
export type UserRole = "user" | "bank" | "admin" | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithWallet: (walletAddress: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

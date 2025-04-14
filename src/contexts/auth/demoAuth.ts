
import { AuthUser, UserRole } from './types';
import { toast } from 'sonner';

export const DEMO_ACCOUNTS = [
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

export const demoAuthService = {
  login: async (email: string, password: string): Promise<AuthUser> => {
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

    toast.success(`Welcome back, ${userData.name}!`);
    return userData;
  },

  loginWithWallet: async (walletAddress: string): Promise<AuthUser> => {
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

    toast.success(`Wallet connected for ${userData.name}!`);
    return userData;
  },

  register: async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    const emailExists = DEMO_ACCOUNTS.some(acc => acc.email === email);
    if (emailExists) {
      throw new Error("Email already registered");
    }
    toast.success("Registration successful! Please login with the demo accounts.");
  }
};


import { AuthUser, UserRole } from './types';
import { toast } from 'sonner';

// In-memory storage for production users
const PRODUCTION_USERS: AuthUser[] = [];

export const productionAuthService = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    const user = PRODUCTION_USERS.find((user) => user.email === email);
    if (!user) {
      throw new Error("User not found. Please register first.");
    }
    toast.success(`Welcome back, ${user.name}!`);
    return user;
  },

  loginWithWallet: async (walletAddress: string): Promise<AuthUser> => {
    const user = PRODUCTION_USERS.find(
      (user) => user.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!user) {
      throw new Error("Wallet not registered. Please register first.");
    }

    toast.success(`Wallet connected for ${user.name}!`);
    return user;
  },

  register: async (name: string, email: string, password: string, role: UserRole): Promise<AuthUser> => {
    const emailExists = PRODUCTION_USERS.some(user => user.email === email);
    if (emailExists) {
      throw new Error("Email already registered");
    }

    // Generate a simple random wallet address for new users
    const randomWalletAddress = "0x" + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');

    const newUser: AuthUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      walletAddress: randomWalletAddress,
    };

    PRODUCTION_USERS.push(newUser);
    toast.success("Registration successful!");
    return newUser;
  }
};

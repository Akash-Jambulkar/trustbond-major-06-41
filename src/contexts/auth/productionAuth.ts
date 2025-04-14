
import { AuthUser, UserRole } from './types';
import { toast } from 'sonner';

// In-memory storage for production users
const PRODUCTION_USERS: AuthUser[] = [
  // Add a default admin user for testing
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@trustbond.com",
    role: "admin",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    mfaEnabled: true
  },
  // Add a default bank user
  {
    id: "bank-1",
    name: "Bank User",
    email: "bank@trustbond.com",
    role: "bank",
    walletAddress: "0x2234567890abcdef1234567890abcdef12345678",
    mfaEnabled: false
  },
  // Add a default regular user
  {
    id: "user-1",
    name: "Regular User",
    email: "user@trustbond.com",
    role: "user", 
    walletAddress: "0x3234567890abcdef1234567890abcdef12345678",
    mfaEnabled: false
  }
];

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
      mfaEnabled: false,
    };

    PRODUCTION_USERS.push(newUser);
    toast.success("Registration successful!");
    return newUser;
  },
  
  // Add these methods to support MFA
  enableMFA: async (userId: string): Promise<boolean> => {
    const userIndex = PRODUCTION_USERS.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    PRODUCTION_USERS[userIndex].mfaEnabled = true;
    return true;
  },
  
  disableMFA: async (userId: string): Promise<boolean> => {
    const userIndex = PRODUCTION_USERS.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    PRODUCTION_USERS[userIndex].mfaEnabled = false;
    return true;
  }
};

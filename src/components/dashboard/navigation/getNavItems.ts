
import { User } from "@supabase/supabase-js";
import {
  Home,
  User as UserIcon,
  FileText,
  CreditCard,
  PieChart,
  Settings,
  Building2,
  ShieldCheck,
  Shield,
  Users,
  Server,
  BarChart3,
  Lock,
  Wallet,
  LineChart,
  BookOpen
} from "lucide-react";

export const getNavItems = (user: User | null) => {
  // Common items for all user types
  const commonItems = [
    { label: "Dashboard", icon: <Home size={20} />, href: `/dashboard/${user?.role}` },
    { label: "Profile", icon: <UserIcon size={20} />, href: `/dashboard/${user?.role}/profile` },
  ];

  // User specific items
  const userItems = [
    { 
      label: "Identity", 
      icon: <FileText size={20} />, 
      href: "/dashboard/user/kyc",
      badge: "Verified" 
    },
    { 
      label: "Loans", 
      icon: <CreditCard size={20} />, 
      href: "/dashboard/user/loans" 
    },
    { 
      label: "Credit Score", 
      icon: <PieChart size={20} />, 
      href: "/dashboard/user/credit-score" 
    },
    { 
      label: "Trust Score", 
      icon: <LineChart size={20} />, 
      href: "/dashboard/user/trust-score" 
    },
    { 
      label: "Analytics", 
      icon: <BarChart3 size={20} />, 
      href: "/dashboard/user/analytics" 
    },
    { 
      label: "Compliance & Market", 
      icon: <BookOpen size={20} />, 
      href: "/dashboard/user/compliance-market" 
    },
    { 
      label: "Security", 
      icon: <Lock size={20} />, 
      href: "/dashboard/user/security" 
    },
    { 
      label: "Blockchain", 
      icon: <Wallet size={20} />, 
      href: "/dashboard/user/transactions" 
    },
  ];

  // Bank specific items
  const bankItems = [
    { 
      label: "KYC Verification", 
      icon: <ShieldCheck size={20} />, 
      href: "/dashboard/bank/verify-kyc",
      badge: "12" 
    },
    { 
      label: "Enhanced Verification", 
      icon: <Shield size={20} />, 
      href: "/dashboard/bank/verification" 
    },
    { 
      label: "Consensus Verification", 
      icon: <Users size={20} />, 
      href: "/dashboard/bank/consensus-verification" 
    },
    { 
      label: "Loans", 
      icon: <CreditCard size={20} />, 
      href: "/dashboard/bank/loans", 
      badge: "5" 
    },
    { 
      label: "Trust Scores", 
      icon: <PieChart size={20} />, 
      href: "/dashboard/bank/trust-scores" 
    },
    { 
      label: "Secure Sharing", 
      icon: <Lock size={20} />, 
      href: "/dashboard/bank/secure-sharing" 
    },
    { 
      label: "Blockchain", 
      icon: <Wallet size={20} />, 
      href: "/dashboard/bank/transactions" 
    },
  ];

  // Admin specific items
  const adminItems = [
    { 
      label: "Bank Approvals", 
      icon: <Building2 size={20} />, 
      href: "/dashboard/admin/bank-approvals",
      badge: "3" 
    },
    { 
      label: "User Management", 
      icon: <Users size={20} />, 
      href: "/dashboard/admin/users" 
    },
    { 
      label: "Blockchain Setup", 
      icon: <Server size={20} />, 
      href: "/dashboard/admin/blockchain-setup" 
    },
    { 
      label: "System Settings", 
      icon: <Settings size={20} />, 
      href: "/dashboard/admin/settings" 
    },
    { 
      label: "Transactions", 
      icon: <Wallet size={20} />, 
      href: "/dashboard/admin/transactions" 
    },
  ];

  // Return navigation items based on user role
  if (user?.role === "user") {
    return { main: commonItems, roleSpecific: userItems };
  } else if (user?.role === "bank") {
    return { main: commonItems, roleSpecific: bankItems };
  } else if (user?.role === "admin") {
    return { main: commonItems, roleSpecific: adminItems };
  }

  return { main: commonItems, roleSpecific: [] };
};

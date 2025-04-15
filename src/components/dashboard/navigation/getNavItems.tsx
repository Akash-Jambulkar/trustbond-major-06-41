
import { 
  Home, 
  FileText, 
  Lock, 
  CreditCard, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  UserCog,
  Wallet,
  Award,
  BookOpen,
  FileSpreadsheet,
  LucideIcon
} from "lucide-react";
import { UserRole } from "@/contexts/auth/types";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface NavItems {
  main: NavItem[];
  roleSpecific: NavItem[];
}

export const getNavItems = (role: UserRole): NavItems => {
  // Common navigation items for all users
  const commonItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: UserCog,
    },
    {
      title: "Blockchain",
      href: "/dashboard/blockchain",
      icon: Wallet,
    },
  ];

  // Role-specific navigation items
  let roleSpecificItems: NavItem[] = [];

  switch (role) {
    case "user":
      roleSpecificItems = [
        {
          title: "KYC Documents",
          href: "/dashboard/kyc",
          icon: FileText,
        },
        {
          title: "Trust Score",
          href: "/dashboard/trust-score",
          icon: Award,
        },
        {
          title: "Apply for Loan",
          href: "/dashboard/loan-application",
          icon: CreditCard,
        },
        {
          title: "My Loans",
          href: "/dashboard/loans",
          icon: FileSpreadsheet,
        },
      ];
      break;

    case "bank":
      roleSpecificItems = [
        {
          title: "Bank Home",
          href: "/dashboard/bank",
          icon: Briefcase,
        },
        {
          title: "Verify KYC",
          href: "/dashboard/bank/verify-kyc",
          icon: ShieldCheck,
        },
        {
          title: "Manage Loans",
          href: "/dashboard/bank/loans",
          icon: CreditCard,
        },
        {
          title: "Consensus Verification",
          href: "/dashboard/bank/consensus",
          icon: Users,
        },
      ];
      break;

    case "admin":
      roleSpecificItems = [
        {
          title: "Admin Panel",
          href: "/dashboard/admin",
          icon: Lock,
        },
        {
          title: "Manage Banks",
          href: "/dashboard/admin/banks",
          icon: Briefcase,
        },
        {
          title: "Manage Users",
          href: "/dashboard/admin/users",
          icon: Users,
        },
        {
          title: "Documentation",
          href: "/whitepaper",
          icon: BookOpen,
        },
      ];
      break;
  }

  return {
    main: commonItems,
    roleSpecific: roleSpecificItems
  };
};

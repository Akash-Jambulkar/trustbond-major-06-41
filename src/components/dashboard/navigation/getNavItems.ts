
import { Home, CreditCard, FileText, User, Users, Bank, Shield, Settings, FileCode, LineChart, FileSearch, Lock } from "lucide-react";
import { UserRole } from "@/contexts/auth/types";

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

interface NavItems {
  mainItems: NavItem[];
  roleSpecificItems: NavItem[];
}

export const getNavItems = (role: UserRole): NavItems => {
  // Common navigation items for all users
  const mainItems: NavItem[] = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Security",
      href: "/dashboard/security",
      icon: Lock,
    },
  ];

  // Role-specific navigation items
  let roleSpecificItems: NavItem[] = [];

  switch (role) {
    case "user":
      roleSpecificItems = [
        {
          title: "KYC Verification",
          href: "/dashboard/kyc",
          icon: FileSearch,
        },
        {
          title: "Loans",
          href: "/dashboard/loans",
          icon: CreditCard,
        },
        {
          title: "Trust Score",
          href: "/dashboard/trust-score",
          icon: Shield,
        },
        {
          title: "Analytics",
          href: "/dashboard/analytics",
          icon: LineChart,
        },
        {
          title: "Blockchain",
          href: "/dashboard/blockchain",
          icon: FileCode,
        },
      ];
      break;
    case "bank":
      roleSpecificItems = [
        {
          title: "Verify KYC",
          href: "/dashboard/bank/verify-kyc",
          icon: FileSearch,
        },
        {
          title: "Loans",
          href: "/dashboard/bank/loans",
          icon: CreditCard,
        },
        {
          title: "Consensus",
          href: "/dashboard/bank/consensus",
          icon: Users,
        },
        {
          title: "Trust Scores",
          href: "/dashboard/bank/trust-scores",
          icon: Shield,
        },
        {
          title: "Blockchain",
          href: "/dashboard/blockchain",
          icon: FileCode,
        },
      ];
      break;
    case "admin":
      roleSpecificItems = [
        {
          title: "Users",
          href: "/dashboard/admin/users",
          icon: Users,
        },
        {
          title: "Banks",
          href: "/dashboard/admin/banks",
          icon: Bank,
        },
        {
          title: "Bank Approvals",
          href: "/dashboard/admin/bank-approvals",
          icon: FileText,
        },
        {
          title: "Blockchain Setup",
          href: "/dashboard/admin/blockchain-setup",
          icon: FileCode,
        },
      ];
      break;
    default:
      roleSpecificItems = [];
  }

  return { mainItems, roleSpecificItems };
};

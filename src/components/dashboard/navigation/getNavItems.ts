
import { Home, CreditCard, FileText, User, Users, BuildingIcon, Shield, Settings, FileCode, LineChart, FileSearch, Lock, Wallet } from "lucide-react";
import { UserRole } from "@/contexts/auth/types";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  active?: boolean; // Make active optional to maintain compatibility
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
      href: `/dashboard/${role}`,
      icon: Home,
    },
    {
      title: "Profile",
      href: `/dashboard/${role}/profile`,
      icon: User,
    },
    {
      title: "Security",
      href: `/dashboard/${role}/security`,
      icon: Lock,
    },
    {
      title: "Transactions",
      href: `/dashboard/${role}/transactions`,
      icon: Wallet,
    }
  ];

  // Role-specific navigation items
  let roleSpecificItems: NavItem[] = [];

  switch (role) {
    case "user":
      roleSpecificItems = [
        {
          title: "KYC Verification",
          href: "/dashboard/user/kyc",
          icon: FileSearch,
        },
        {
          title: "Loans",
          href: "/dashboard/user/loans",
          icon: CreditCard,
        },
        {
          title: "Apply for Loan",
          href: "/dashboard/user/loan-application",
          icon: FileText,
        },
        {
          title: "Trust Score",
          href: "/dashboard/user/trust-score",
          icon: Shield,
        },
        {
          title: "Analytics",
          href: "/dashboard/user/analytics",
          icon: LineChart,
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
          title: "Manage Loans",
          href: "/dashboard/bank/loans",
          icon: CreditCard,
        },
        {
          title: "Consensus",
          href: "/dashboard/bank/consensus-verification",
          icon: Users,
        },
        {
          title: "Trust Scores",
          href: "/dashboard/bank/trust-scores",
          icon: Shield,
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
          icon: BuildingIcon,
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

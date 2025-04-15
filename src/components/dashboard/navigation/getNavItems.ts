
import {
  LayoutDashboard,
  CreditCard,
  ShieldCheck,
  UserCircle,
  ChartBar,
  Settings,
  FileCheck,
  HandCoins,
  Building,
  Shield,
  Factory,
  Users,
  Database,
  BarChart4,
  Share2,
  CheckCircle,
  Landmark,
  History
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
};

export const getUserNavItems = () => [
  {
    title: "Dashboard",
    href: "/dashboard/user",
    icon: LayoutDashboard,
  },
  {
    title: "KYC Verification",
    href: "/dashboard/user/kyc",
    icon: ShieldCheck,
  },
  {
    title: "Profile",
    href: "/dashboard/user/profile",
    icon: UserCircle,
  },
  {
    title: "Loans",
    href: "/dashboard/user/loans",
    icon: HandCoins,
  },
  {
    title: "Trust Score",
    href: "/dashboard/user/trust-score",
    icon: ChartBar,
  },
  {
    title: "Analytics",
    href: "/dashboard/user/analytics",
    icon: BarChart4,
  },
  {
    title: "Security",
    href: "/dashboard/user/security",
    icon: Shield,
  },
  {
    title: "Credit Score",
    href: "/dashboard/user/credit-score",
    icon: CreditCard,
  },
  {
    title: "Compliance & Market",
    href: "/dashboard/user/compliance-market",
    icon: FileCheck,
  },
  {
    title: "Blockchain Transactions",
    href: "/dashboard/user/transactions",
    icon: History,
  }
];

export const getBankNavItems = () => [
  {
    title: "Dashboard",
    href: "/dashboard/bank",
    icon: LayoutDashboard,
  },
  {
    title: "Loans",
    href: "/dashboard/bank/loans",
    icon: CreditCard,
  },
  {
    title: "Profile",
    href: "/dashboard/bank/profile",
    icon: Building,
  },
  {
    title: "Manage Loans",
    href: "/dashboard/bank/manage-loans",
    icon: HandCoins,
  },
  {
    title: "Secure Sharing",
    href: "/dashboard/bank/secure-sharing",
    icon: Share2,
  },
  {
    title: "Verify KYC",
    href: "/dashboard/bank/verify-kyc",
    icon: CheckCircle,
  },
  {
    title: "Bank Registration",
    href: "/dashboard/bank/bank-registration",
    icon: Landmark,
  },
  {
    title: "Bank Verification",
    href: "/dashboard/bank/bank-verification",
    icon: Shield,
  },
  {
    title: "Consensus Verification",
    href: "/dashboard/bank/consensus-verification",
    icon: Users,
  },
  {
    title: "Trust Scores",
    href: "/dashboard/bank/trust-scores",
    icon: ChartBar,
  },
  {
    title: "Blockchain Transactions",
    href: "/dashboard/bank/transactions",
    icon: History,
  }
];

export const getAdminNavItems = () => [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/dashboard/admin/profile",
    icon: UserCircle,
  },
  {
    title: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Bank Approvals",
    href: "/dashboard/admin/bank-approvals",
    icon: Building,
  },
  {
    title: "Bank Registration",
    href: "/dashboard/admin/bank-registration",
    icon: Landmark,
  },
  {
    title: "Blockchain Setup",
    href: "/dashboard/admin/blockchain-setup",
    icon: Database,
  },
  {
    title: "Blockchain Transactions",
    href: "/dashboard/admin/transactions",
    icon: History,
  }
];

export const getNavItems = (role: 'user' | 'bank' | 'admin') => {
  switch (role) {
    case 'user':
      return getUserNavItems();
    case 'bank':
      return getBankNavItems();
    case 'admin':
      return getAdminNavItems();
    default:
      return [];
  }
};

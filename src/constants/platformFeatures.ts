
import { Shield, TrendingUp, Database, Users, Lock, Activity } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface PlatformFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const platformFeatures: PlatformFeature[] = [
  {
    icon: Shield,
    title: "Secure KYC Verification",
    description: "Submit your KYC documents once and have them securely verified using blockchain technology, ensuring data privacy."
  },
  {
    icon: TrendingUp,
    title: "Trust Score Generation",
    description: "Get a portable trust score based on your verified credentials, improving your access to financial services."
  },
  {
    icon: Database,
    title: "Smart Contract Integration",
    description: "Transparent loan terms and automatic execution through smart contracts for faster processing and reduced fraud."
  },
  {
    icon: Users,
    title: "Cross-Bank Collaboration",
    description: "Verified credentials can be securely shared across financial institutions, eliminating redundant verifications."
  },
  {
    icon: Lock,
    title: "Enhanced Data Security",
    description: "Your documents are securely hashed and only the verification status is stored on the blockchain."
  },
  {
    icon: Activity,
    title: "Real-Time Risk Assessment",
    description: "Advanced algorithms provide real-time risk assessment for better loan decisions and interest rates."
  }
];

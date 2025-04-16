
import { ReactNode } from "react";

export interface DashboardMetric {
  title: string;
  value: string | number;
  change?: string;
  status?: "up" | "down" | "neutral";
  icon?: ReactNode;
}

export interface DashboardStatsProps {
  userRole: "user" | "bank" | "admin";
}


import React from "react";
import { Outlet } from "react-router-dom";
import { DashboardShell } from "@/components/bank/dashboard/DashboardShell";

const BankDashboard = () => {
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
};

export default BankDashboard;

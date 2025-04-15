
import React from "react";
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

// This component now simply renders the DashboardLayout with the Outlet for nested routes
const UserDashboard = () => {
  return <DashboardLayout />;
};

export default UserDashboard;

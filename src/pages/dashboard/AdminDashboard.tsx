
import React from "react";
import { Outlet } from "react-router-dom";

// This component should only contain the Outlet for nested routes
// since DashboardLayout is already wrapped around it in App.tsx
const AdminDashboard = () => {
  return <Outlet />;
};

export default AdminDashboard;

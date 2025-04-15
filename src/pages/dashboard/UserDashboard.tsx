
import React from "react";
import { Outlet } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";

// This component should only contain the Outlet for nested routes
// since DashboardLayout is already wrapped around it in App.tsx
const UserDashboard = () => {
  const { setProductionMode } = useMode();
  
  // Always set to production mode for user dashboard
  React.useEffect(() => {
    setProductionMode(true);
  }, [setProductionMode]);
  
  return <Outlet />;
};

export default UserDashboard;

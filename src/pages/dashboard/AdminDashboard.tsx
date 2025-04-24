
import { Outlet, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNavItems } from "@/components/dashboard/navigation/getNavItems";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is an admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      console.log(`User role is ${user.role}, redirecting from admin dashboard`);
      navigate(`/dashboard/${user.role}`);
    }
  }, [user, navigate]);

  // If user isn't available yet or isn't an admin, show nothing
  if (!user || user.role !== "admin") {
    return null;
  }

  // Get admin-specific navigation from the utility function
  const { mainItems, roleSpecificItems } = getNavItems("admin");
  const navItems = [...mainItems, ...roleSpecificItems].map(item => ({
    ...item,
    active: location.pathname === item.href
  }));

  return (
    <DashboardLayout sidebarNavItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;

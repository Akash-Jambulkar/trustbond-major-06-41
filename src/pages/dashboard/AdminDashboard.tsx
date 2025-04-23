
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Settings,
  Activity,
  UserCircle,
  Building,
  FileText,
  Database,
  Network
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState([
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: Activity,
      active: false,
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
      active: false,
    },
    {
      title: "Bank Approvals",
      href: "/dashboard/admin/bank-approvals",
      icon: Building,
      active: false,
    },
    {
      title: "Blockchain Setup",
      href: "/dashboard/admin/blockchain-setup",
      icon: Network,
      active: false,
    },
    {
      title: "Database Setup",
      href: "/dashboard/admin/database-setup",
      icon: Database,
      active: false,
    },
    {
      title: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: FileText,
      active: false,
    },
    {
      title: "Profile",
      href: "/dashboard/admin/profile",
      icon: UserCircle,
      active: false,
    },
    {
      title: "Settings",
      href: "/dashboard/admin/settings",
      icon: Settings,
      active: false,
    },
  ]);

  useEffect(() => {
    // Update active state based on current route
    const currentPath = window.location.pathname;
    const updatedNavItems = navItems.map((item) => ({
      ...item,
      active: item.href === currentPath,
    }));
    setNavItems(updatedNavItems);
  }, []);

  // Check if user is an admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate(`/dashboard/${user.role}`);
    }
  }, [user, navigate]);

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;

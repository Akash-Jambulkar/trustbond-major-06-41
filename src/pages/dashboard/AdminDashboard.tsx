
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <Outlet />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;


import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

const BankDashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <Outlet />
      </div>
    </DashboardLayout>
  );
};

export default BankDashboard;

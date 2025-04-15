
import React from "react";
import { Outlet } from "react-router-dom";

const BankDashboard = () => {
  return (
    <div className="flex-1 overflow-auto">
      <Outlet />
    </div>
  );
};

export default BankDashboard;

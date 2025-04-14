
import React from "react";
import { Outlet } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  );
};

export default UserDashboard;

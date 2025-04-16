
import React from "react";
import { LoanAnalyticsDashboard } from "@/components/analytics/LoanAnalyticsDashboard";

const AnalyticsPage = () => {
  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Loan Analytics</h1>
        <p className="text-muted-foreground">
          View personalized analytics about your loan activity and performance
        </p>
      </div>
      <LoanAnalyticsDashboard />
    </div>
  );
};

export default AnalyticsPage;

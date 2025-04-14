
import React from "react";
import { KYCTabs } from "@/components/kyc/KYCTabs";
import { NestedDashboardLayout } from "@/components/NestedDashboardLayout";

const KYCPage = () => {
  return (
    <NestedDashboardLayout activeTab="kyc">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">KYC Verification</h2>
          <p className="text-gray-500">
            Submit and manage your KYC documents for secure blockchain identity verification.
          </p>
        </div>
        
        <KYCTabs />
      </div>
    </NestedDashboardLayout>
  );
};

export default KYCPage;

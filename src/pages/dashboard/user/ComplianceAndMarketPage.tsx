
import React from "react";
import { ComplianceCheck } from "@/components/compliance/ComplianceCheck";
import { MarketDataDisplay } from "@/components/market/MarketDataDisplay";
import { BookOpen, ShieldCheck } from "lucide-react";

const ComplianceAndMarketPage = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Regulatory & Market</h1>
        <p className="text-muted-foreground mt-1">
          Compliance information and real-time market data feeds
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <ComplianceCheck />
          </div>

          <div className="col-span-1 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Why Compliance Matters</h3>
              </div>
              <p className="text-sm text-blue-700">
                Regulatory compliance ensures that all financial activities adhere to applicable 
                laws and regulations, protecting both lenders and borrowers from legal risks 
                while maintaining the integrity of the financial system.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <BookOpen className="h-5 w-5 text-amber-600 mr-2" />
                <h3 className="font-medium text-amber-800">About These Checks</h3>
              </div>
              <p className="text-sm text-amber-700">
                Our platform performs continuous regulatory compliance checks including 
                AML (Anti-Money Laundering), KYC (Know Your Customer), PEP screening, and 
                sanctions verification to ensure all transactions meet legal requirements.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <MarketDataDisplay />
        </div>
      </div>
    </div>
  );
};

export default ComplianceAndMarketPage;


import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const WhitepaperHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-trustbond-dark">
          Blockchain-Powered KYC Verification and Trust Score Creation
        </h1>
        <div className="hidden md:flex items-center text-sm text-gray-500">
          <FileText size={16} className="mr-2" />
          Version 1.0
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <Link 
          to="/download-whitepaper" 
          className="text-trustbond-primary hover:text-trustbond-primary/80"
        >
          Download PDF Version
        </Link>
        <span className="text-gray-300">|</span>
        <Link 
          to="/about" 
          className="text-trustbond-primary hover:text-trustbond-primary/80"
        >
          About TrustBond
        </Link>
      </div>
    </div>
  );
};

export default WhitepaperHeader;

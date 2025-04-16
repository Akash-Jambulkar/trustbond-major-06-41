
import React from 'react';
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import Navbar from "@/components/Navbar";

const WhitepaperHeader = () => {
  return (
    <header>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
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
              className="text-trustbond-primary hover:text-trustbond-primary/80 cursor-pointer"
            >
              Download PDF Version
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              to="/about" 
              className="text-trustbond-primary hover:text-trustbond-primary/80 cursor-pointer"
            >
              About TrustBond
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WhitepaperHeader;

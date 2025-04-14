
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

const WhitepaperHeader = () => {
  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              About
            </Link>
            <Link to="/whitepaper" className="text-trustbond-primary font-medium">
              Whitepaper
            </Link>
            <Link to="/contact" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Contact
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="text-trustbond-dark border-trustbond-primary hover:bg-trustbond-primary hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-trustbond-primary hover:bg-trustbond-primary/90 text-white">
                  Register
                </Button>
              </Link>
            </div>
          </div>
          
          <button className="md:hidden text-trustbond-dark">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="mb-6">
        <Link to="/" className="text-trustbond-primary hover:underline inline-flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-trustbond-dark">
          Blockchain-Powered KYC Verification and Trust Score Creation
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <FileText size={16} className="mr-2" />
          Version 1.0
        </div>
      </div>
    </>
  );
};

export default WhitepaperHeader;

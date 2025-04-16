
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TableOfContents from "@/components/whitepaper/TableOfContents";
import WhitepaperHeader from "@/components/whitepaper/WhitepaperHeader";
import WhitepaperContent from "@/components/whitepaper/WhitepaperContent";
import WhitepaperNavigation from "@/components/whitepaper/WhitepaperNavigation";
import AdditionalResources from "@/components/whitepaper/AdditionalResources";

const Whitepaper = () => {
  const [activeSection, setActiveSection] = useState("abstract");
  const [currentPage, setCurrentPage] = useState(1);
  
  const sections = [
    { id: "abstract", name: "Abstract" },
    { id: "introduction", name: "Introduction" },
    { id: "kyc-smart-contracts", name: "KYC and Smart Contracts" },
    { id: "literature-review", name: "Literature Review" },
    { id: "proposed-model", name: "Proposed Model" },
    { id: "implementation", name: "Implementation" },
    { id: "results", name: "Results and Discussion" },
    { id: "conclusion", name: "Conclusion" },
    { id: "team", name: "Our Team" }
  ];
  
  const handleSectionChange = (sectionId: string, pageNumber: number) => {
    setActiveSection(sectionId);
    setCurrentPage(pageNumber);
    
    // Scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      handleSectionChange(sections[newPage - 1].id, newPage);
    }
  };
  
  const handleNext = () => {
    if (currentPage < sections.length) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      handleSectionChange(sections[newPage - 1].id, newPage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <Badge variant="trustbond" className="mb-4 bg-white/20 backdrop-blur-sm">Technical Whitepaper</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                TRUSTBOND: Blockchain-Powered KYC Verification & Trust Score Creation
              </h1>
              <p className="text-xl mb-8 opacity-90">
                A comprehensive technical overview of our blockchain solution for secure, efficient, and transparent KYC verification and trust score generation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" className="bg-white text-trustbond-primary hover:bg-gray-100" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/about">Learn About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Table of Contents - Sidebar */}
              <div className="md:col-span-1">
                <TableOfContents 
                  activeSection={activeSection} 
                  sections={sections}
                  onSectionChange={handleSectionChange}
                />
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-3">
                <WhitepaperHeader />
                <WhitepaperContent />
                
                <WhitepaperNavigation 
                  currentPage={currentPage}
                  totalPages={sections.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onPageChange={handleSectionChange}
                  sections={sections}
                />
                
                <AdditionalResources />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-6 text-center">Ready to Transform Your KYC Process?</h2>
            <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
              Join the TrustBond ecosystem today and experience the power of blockchain-enabled KYC verification and trust score generation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="trustbond" size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Whitepaper;

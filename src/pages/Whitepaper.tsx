
import React, { useState, useEffect } from 'react';
import WhitepaperHeader from '@/components/whitepaper/WhitepaperHeader';
import TableOfContents from '@/components/whitepaper/TableOfContents';
import WhitepaperContent from '@/components/whitepaper/WhitepaperContent';
import WhitepaperNavigation from '@/components/whitepaper/WhitepaperNavigation';
import WhitepaperFooter from '@/components/whitepaper/WhitepaperFooter';
import AdditionalResources from '@/components/whitepaper/AdditionalResources';

const Whitepaper = () => {
  const [activeSection, setActiveSection] = useState("abstract");
  const [currentPage, setCurrentPage] = useState(1);
  
  const sections = [
    { id: "abstract", name: "Abstract" },
    { id: "introduction", name: "I. Introduction" },
    { id: "kyc-smart-contracts", name: "II. KYC and Smart Contracts" },
    { id: "literature-review", name: "III. Literature Review" },
    { id: "proposed-model", name: "IV. Proposed Model" },
    { id: "implementation", name: "V. Implementation" },
    { id: "results", name: "VI. Results and Discussion" },
    { id: "conclusion", name: "VII. Conclusion" },
    { id: "team", name: "Our Team" }
  ];
  
  const handleNext = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection);
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      setActiveSection(nextSection.id);
      setCurrentPage(currentIndex + 2);
      document.getElementById(nextSection.id)?.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const handlePrevious = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection);
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      setActiveSection(prevSection.id);
      setCurrentPage(currentIndex);
      document.getElementById(prevSection.id)?.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const handlePageChange = (sectionId: string, pageNumber: number) => {
    setActiveSection(sectionId);
    setCurrentPage(pageNumber);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          setCurrentPage(i + 1);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <WhitepaperHeader />

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <TableOfContents 
              activeSection={activeSection} 
              sections={sections} 
              onSectionChange={handlePageChange} 
            />
          </div>
          
          <div className="md:w-3/4">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <WhitepaperContent />
            </div>
            
            <AdditionalResources />
            
            <WhitepaperNavigation 
              currentPage={currentPage}
              totalPages={sections.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onPageChange={handlePageChange}
              sections={sections}
            />
          </div>
        </div>
      </div>
      
      <WhitepaperFooter />
    </div>
  );
};

export default Whitepaper;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface TableOfContentsProps {
  activeSection: string;
  sections: { id: string; name: string }[];
  onSectionChange: (sectionId: string, pageNumber: number) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  activeSection, 
  sections, 
  onSectionChange 
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
      <h3 className="text-lg font-semibold mb-4 text-trustbond-dark">Table of Contents</h3>
      <ul className="space-y-2">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a 
              href={`#${section.id}`} 
              className={`${activeSection === section.id 
                ? "text-trustbond-primary font-medium"
                : "text-trustbond-dark hover:text-trustbond-primary"}`}
              onClick={() => onSectionChange(section.id, index + 1)}
            >
              {section.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button variant="outline" className="w-full mb-2 flex items-center gap-2">
          <Download size={16} />
          Download PDF
        </Button>
        <Button variant="ghost" className="w-full text-trustbond-dark flex items-center gap-2">
          <Share2 size={16} />
          Share
        </Button>
      </div>
    </div>
  );
};

export default TableOfContents;

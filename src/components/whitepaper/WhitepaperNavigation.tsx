
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface WhitepaperNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageChange: (sectionId: string, pageNumber: number) => void;
  sections: { id: string; name: string }[];
}

const WhitepaperNavigation: React.FC<WhitepaperNavigationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onPageChange,
  sections
}) => {
  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={onPrevious}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>
        </PaginationItem>
        
        {sections.map((section, index) => (
          <PaginationItem key={section.id} className="hidden md:inline-block">
            <PaginationLink
              isActive={currentPage === index + 1}
              onClick={() => onPageChange(section.id, index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={onNext}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ArrowRight size={16} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default WhitepaperNavigation;


import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";

interface DocumentListProps {
  documents: KycDocumentSubmissionType[];
  loadingDocuments: boolean;
  onOpenDocument: (document: KycDocumentSubmissionType) => void;
}

export function DocumentList({ documents, loadingDocuments, onOpenDocument }: DocumentListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <>
      {loadingDocuments ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary"></div>
          <span className="ml-2">Loading documents...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No documents requiring verification at this time
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => onOpenDocument(doc)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-trustbond-primary" />
                    {doc.document_type.toUpperCase()} - {doc.document_number}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {formatDate(doc.submitted_at)}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  View & Vote
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

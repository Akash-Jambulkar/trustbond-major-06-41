
import React from 'react';
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";

interface DocumentInfoProps {
  document: KycDocumentSubmissionType;
}

export function DocumentInfo({ document }: DocumentInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Document Type</p>
        <p className="font-medium">{document.document_type.toUpperCase()}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Document Number</p>
        <p className="font-mono">{document.document_number}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Submitted At</p>
        <p>{formatDate(document.submitted_at)}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Document Hash</p>
        <p className="font-mono text-xs break-all">{document.document_hash}</p>
      </div>
    </div>
  );
}

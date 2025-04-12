
import React from "react";
import { Helmet } from "react-helmet";
import { SecureDocumentSharing } from "@/components/bank/SecureDocumentSharing";

export default function SecureSharing() {
  return (
    <>
      <Helmet>
        <title>Secure Document Sharing - TrustBond</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Secure Document Sharing</h1>
        <SecureDocumentSharing />
      </div>
    </>
  );
}

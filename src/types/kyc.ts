
export type KYCDocument = {
  id: number | string;
  userId: string;
  userName: string;
  documentType: string;
  documentId: string;
  status: "pending" | "verified" | "rejected";
  submissionDate: string;
  verificationDate?: string;
  documentHash?: string;
  documentFiles: string[];
  blockchain_tx_hash?: string;
};

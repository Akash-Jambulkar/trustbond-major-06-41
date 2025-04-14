
import { Transaction } from "@/utils/transactions";
import { TransactionItem } from "./TransactionItem";

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails: (tx: Transaction) => void;
  isLoading: boolean;
  isConnected: boolean;
}

export const TransactionList = ({
  transactions,
  onViewDetails,
  isLoading,
  isConnected,
}: TransactionListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {!isConnected ? "Connect your wallet to view transactions" : "No transactions found"}
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {transactions.map((tx) => (
        <TransactionItem key={tx.hash} transaction={tx} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
};

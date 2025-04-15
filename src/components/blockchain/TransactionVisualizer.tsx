
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealTimeUpdates, RealTimeEventType } from '@/contexts/RealTimeContext';
import { ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  type: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}

export const TransactionVisualizer = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Use the real-time updates hook to get new transactions
  useRealTimeUpdates(RealTimeEventType.TRANSACTION_UPDATED, (payload) => {
    // Create a new transaction object from the payload
    const newTransaction: Transaction = {
      id: payload.new.id,
      hash: payload.new.transaction_hash,
      from: payload.new.from_address || 'Unknown',
      to: payload.new.to_address || 'Network',
      type: payload.new.type,
      status: payload.new.status,
      timestamp: new Date(payload.new.created_at),
    };

    // Add the new transaction to the list
    setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
  });

  // For demo purposes, generate a random transaction every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['kyc', 'loan', 'verification', 'repayment'];
      const statuses = ['pending', 'confirmed', 'failed'] as const;
      
      const randomTransaction: Transaction = {
        id: Math.random().toString(36).substring(2, 15),
        hash: `0x${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...`,
        from: `0x${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...`,
        to: `0x${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...`,
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        timestamp: new Date(),
      };

      setTransactions(prev => [randomTransaction, ...prev.slice(0, 9)]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Get status icon based on transaction status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  // Get type badge class based on transaction type
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'kyc':
        return 'bg-blue-100 text-blue-800';
      case 'loan':
        return 'bg-purple-100 text-purple-800';
      case 'verification':
        return 'bg-green-100 text-green-800';
      case 'repayment':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Live Blockchain Transactions</h3>
        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live
        </span>
      </div>
      <div className="p-2 h-[400px] overflow-hidden">
        <AnimatePresence>
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`p-3 mb-2 rounded-lg ${index === 0 ? 'bg-blue-50' : 'bg-gray-50'} flex items-center`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeClass(transaction.type)} mr-2`}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {transaction.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="block truncate font-mono">{transaction.from}</span>
                  <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                  <span className="block truncate font-mono">{transaction.to}</span>
                </div>
                <div className="text-xs text-gray-500 truncate mt-1 font-mono">
                  TX: {transaction.hash}
                </div>
              </div>
              <div className="ml-3 flex-shrink-0">
                {getStatusIcon(transaction.status)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {transactions.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-500">
            No transactions yet. They will appear here in real-time.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionVisualizer;

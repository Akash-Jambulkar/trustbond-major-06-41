
// Utility functions for simulating blockchain interactions

// Generate a mock transaction hash
export const generateMockTransactionHash = (): string => {
  return `0x${Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
};

// Generate a mock wallet address
export const generateMockWalletAddress = (): string => {
  return `0x${Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
};

// Simulate blockchain transaction processing
export const simulateTransactionProcessing = (
  callback: (success: boolean, hash?: string) => void
): void => {
  const processingTime = 1000 + Math.random() * 2000; // 1-3 seconds
  const success = Math.random() > 0.1; // 90% success rate
  
  setTimeout(() => {
    if (success) {
      const hash = generateMockTransactionHash();
      callback(true, hash);
    } else {
      callback(false);
    }
  }, processingTime);
};

// Simulate KYC document hash creation
export const simulateKYCDocumentHash = (documentData: any): string => {
  // In a real implementation, this would use a proper hashing algorithm
  const randomData = Math.random().toString(36).substring(2, 15);
  return `0x${(documentData + randomData).split('').map(c => c.charCodeAt(0).toString(16)).join('')}`;
};

// Function to simulate a delayed network response
export const simulateNetworkDelay = async <T>(data: T): Promise<T> => {
  const delay = 500 + Math.random() * 1500; // 0.5-2 seconds
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Simulate gas price calculation
export const calculateGasPrice = (): number => {
  // Return gas price in Gwei (1-100)
  return Math.floor(1 + Math.random() * 99);
};

// Simulate gas limit calculation
export const calculateGasLimit = (operationType: 'kyc' | 'loan' | 'verification'): number => {
  switch (operationType) {
    case 'kyc':
      return 50000 + Math.floor(Math.random() * 10000);
    case 'loan':
      return 80000 + Math.floor(Math.random() * 20000);
    case 'verification':
      return 60000 + Math.floor(Math.random() * 15000);
    default:
      return 50000;
  }
};

// Simulate transaction cost calculation
export const calculateTransactionCost = (
  gasPrice: number,
  gasLimit: number
): string => {
  // Calculate cost in ETH
  const costInWei = gasPrice * 1e9 * gasLimit;
  const costInEth = costInWei / 1e18;
  return costInEth.toFixed(6);
};


/**
 * Generates a random mock transaction hash for simulating blockchain interactions
 * @returns A string representing a mock blockchain transaction hash
 */
export const generateMockTransactionHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  
  // Generate a 64 character hash (32 bytes) plus the 0x prefix
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return hash;
};

/**
 * Simulates blockchain transaction confirmation
 * @param callback Function to call when transaction is confirmed
 */
export const simulateTransactionConfirmation = (callback: () => void): void => {
  // Simulate a random confirmation time between 1-3 seconds
  const confirmationTime = 1000 + Math.random() * 2000;
  setTimeout(callback, confirmationTime);
};

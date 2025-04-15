
import { RealTimeEventType, simulateBlockchainEvent } from './realTimeData';

/**
 * Generate a random hash to simulate a blockchain transaction
 */
function randomHash() {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * Simulate a random blockchain event
 */
export function simulateRandomBlockchainEvent() {
  const eventTypes = [
    RealTimeEventType.KYC_UPDATED,
    RealTimeEventType.TRUST_SCORE_UPDATED,
    RealTimeEventType.LOAN_UPDATED,
    RealTimeEventType.TRANSACTION_UPDATED
  ];
  
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  let data: any = {};
  
  switch (eventType) {
    case RealTimeEventType.KYC_UPDATED:
      data = {
        user_id: '0x' + Math.random().toString(16).substring(2, 42),
        document_type: ['National ID', 'Passport', 'Driving License'][Math.floor(Math.random() * 3)],
        verification_status: ['pending', 'verified', 'rejected'][Math.floor(Math.random() * 3)],
        submitted_at: new Date().toISOString(),
        document_hash: randomHash()
      };
      break;
      
    case RealTimeEventType.TRUST_SCORE_UPDATED:
      data = {
        user_address: '0x' + Math.random().toString(16).substring(2, 42),
        score: Math.floor(Math.random() * 100),
        change: Math.floor(Math.random() * 10),
        previous_score: Math.floor(Math.random() * 100),
        timestamp: Date.now()
      };
      break;
      
    case RealTimeEventType.LOAN_UPDATED:
      data = {
        id: Math.floor(Math.random() * 1000).toString(),
        borrower_address: '0x' + Math.random().toString(16).substring(2, 42),
        amount: (Math.random() * 10).toFixed(2),
        status: ['pending', 'approved', 'active', 'repaid', 'defaulted'][Math.floor(Math.random() * 5)],
        term: 12,
        interest_rate: (Math.random() * 10).toFixed(2),
        timestamp: Date.now()
      };
      break;
      
    case RealTimeEventType.TRANSACTION_UPDATED:
      const txTypes = ['kyc', 'loan', 'verification', 'registration', 'other'];
      const txType = txTypes[Math.floor(Math.random() * txTypes.length)];
      
      data = {
        hash: randomHash(),
        from_address: '0x' + Math.random().toString(16).substring(2, 42),
        to_address: '0x' + Math.random().toString(16).substring(2, 42),
        type: txType,
        status: ['pending', 'confirmed', 'failed'][Math.floor(Math.random() * 3)],
        timestamp: Date.now(),
        description: `${txType.charAt(0).toUpperCase() + txType.slice(1)} Transaction`,
        network: '1'
      };
      break;
  }
  
  simulateBlockchainEvent(eventType, data);
  
  console.log(`Simulated ${eventType} event with data:`, data);
  
  return { eventType, data };
}

/**
 * Start simulating blockchain events at regular intervals
 */
export function startSimulation(intervalMs = 10000) {
  const interval = setInterval(() => {
    simulateRandomBlockchainEvent();
  }, intervalMs);
  
  console.log(`Started blockchain event simulation at ${intervalMs}ms intervals`);
  
  // Return function to stop simulation
  return () => {
    clearInterval(interval);
    console.log('Stopped blockchain event simulation');
  };
}

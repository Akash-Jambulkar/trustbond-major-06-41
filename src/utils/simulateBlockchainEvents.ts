
import { RealTimeEventType, simulateBlockchainEvent } from './realTimeData';

/**
 * Generate a mock transaction hash
 */
function randomHash() {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * Simulate a random blockchain event
 * Note: This is a development utility only and should not be used in production
 */
export function simulateRandomBlockchainEvent() {
  // In production, this should not generate events
  console.log('Blockchain event simulation disabled in production mode.');
  
  // Return a placeholder with no real data
  return { 
    eventType: RealTimeEventType.TRANSACTION_UPDATED, 
    data: {} 
  };
}

/**
 * Start simulating blockchain events at regular intervals
 * This function is for development purposes only
 */
export function startSimulation(intervalMs = 10000) {
  // In production, this should not generate events
  console.log('Blockchain event simulation disabled in production mode.');
  
  // Return function that does nothing since simulation is disabled
  return () => {
    console.log('No simulation running to stop.');
  };
}

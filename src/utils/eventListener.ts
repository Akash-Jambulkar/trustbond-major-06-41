
import { Contract } from "web3-eth-contract";
import { toast } from "sonner";

interface EventListener {
  contract: Contract;
  eventName: string;
  filter?: object;
  fromBlock: number | string;
  callback: (event: any) => void;
  subscription?: any;
}

// List of active event listeners
const activeListeners: EventListener[] = [];

// Start listening for an event
export const listenForEvent = (
  contract: Contract,
  eventName: string,
  callback: (event: any) => void,
  filter: object = {},
  fromBlock: number | string = 'latest'
): void => {
  try {
    // Create the event listener
    const subscription = contract.events[eventName]({
      filter,
      fromBlock
    })
    .on('data', (event: any) => {
      console.log(`Event received: ${eventName}`, event);
      callback(event);
    })
    .on('error', (error: any) => {
      console.error(`Error in ${eventName} event:`, error);
    });
    
    // Add to active listeners
    activeListeners.push({
      contract,
      eventName,
      filter,
      fromBlock,
      callback,
      subscription
    });
    
    console.log(`Started listening for ${eventName} events`);
  } catch (error) {
    console.error(`Failed to subscribe to ${eventName} events:`, error);
  }
};

// Stop listening for an event
export const stopListeningForEvent = (
  contract: Contract,
  eventName: string
): void => {
  const listenerIndex = activeListeners.findIndex(
    (listener) => listener.contract === contract && listener.eventName === eventName
  );
  
  if (listenerIndex !== -1) {
    const listener = activeListeners[listenerIndex];
    
    if (listener.subscription) {
      listener.subscription.unsubscribe();
    }
    
    activeListeners.splice(listenerIndex, 1);
    console.log(`Stopped listening for ${eventName} events`);
  }
};

// Stop all active listeners
export const stopAllEventListeners = (): void => {
  activeListeners.forEach((listener) => {
    if (listener.subscription) {
      listener.subscription.unsubscribe();
    }
  });
  
  activeListeners.length = 0;
  console.log('Stopped all event listeners');
};

// Example event handlers

// KYC Submitted event handler
export const handleKYCSubmittedEvent = (event: any) => {
  const { user, documentHash } = event.returnValues;
  
  toast.info('New KYC Document Submitted', {
    description: `User: ${user.substring(0, 6)}...${user.substring(user.length - 4)}`,
    duration: 5000
  });
  
  // In a real app, you might want to update your UI or refresh data
};

// KYC Verified event handler
export const handleKYCVerifiedEvent = (event: any) => {
  const { user, status } = event.returnValues;
  
  toast.success(`KYC ${status ? 'Approved' : 'Rejected'}`, {
    description: `User: ${user.substring(0, 6)}...${user.substring(user.length - 4)}`,
    duration: 5000
  });
  
  // In a real app, you might want to update your UI or refresh data
};

// Score Updated event handler
export const handleScoreUpdatedEvent = (event: any) => {
  const { user, newScore } = event.returnValues;
  
  toast.info('Trust Score Updated', {
    description: `User: ${user.substring(0, 6)}...${user.substring(user.length - 4)}, New Score: ${newScore}`,
    duration: 5000
  });
  
  // In a real app, you might want to update your UI or refresh data
};

// Loan Requested event handler
export const handleLoanRequestedEvent = (event: any) => {
  const { user, amount, duration } = event.returnValues;
  
  toast.info('New Loan Requested', {
    description: `User: ${user.substring(0, 6)}...${user.substring(user.length - 4)}, Amount: ${amount}`,
    duration: 5000
  });
  
  // In a real app, you might want to update your UI or refresh data
};

// Setup basic event listeners for the application
export const setupBasicEventListeners = (
  kycContract: Contract | null,
  trustScoreContract: Contract | null,
  loanContract: Contract | null
) => {
  // First, stop any existing listeners
  stopAllEventListeners();
  
  // Then set up new ones
  if (kycContract) {
    // Listen for KYC submissions
    listenForEvent(
      kycContract,
      'KYCSubmitted',
      handleKYCSubmittedEvent
    );
    
    // Listen for KYC verifications
    listenForEvent(
      kycContract,
      'KYCVerified',
      handleKYCVerifiedEvent
    );
  }
  
  if (trustScoreContract) {
    // Listen for score updates
    listenForEvent(
      trustScoreContract,
      'ScoreUpdated',
      handleScoreUpdatedEvent
    );
  }
  
  if (loanContract) {
    // Listen for loan requests
    listenForEvent(
      loanContract,
      'LoanRequested',
      handleLoanRequestedEvent
    );
  }
};

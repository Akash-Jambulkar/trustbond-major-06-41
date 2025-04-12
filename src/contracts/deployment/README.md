
# Contract Deployment Guide

This guide explains how to deploy the TrustBond contracts to Ganache and configure your environment.

## Prerequisites

1. Install Ganache:
   - Desktop app: https://trufflesuite.com/ganache/
   - Or via npm: `npm install -g ganache-cli`

2. Install required dependencies:
   ```
   npm install web3 solc @truffle/hdwallet-provider
   ```

## Deploying the Contracts

### Step 1: Start Ganache

Start Ganache with default settings:
- RPC Server: HTTP://127.0.0.1:7545
- Network ID: 1337

### Step 2: Run the Deployment Script

Run the deployment script:

```
node src/contracts/deployment/deploy.js
```

This will:
1. Deploy the contracts to Ganache
2. Output the contract addresses
3. Create a `.env` file with the addresses

### Step 3: Update Contract Addresses

The script creates a `.env` file with the contract addresses. If you need to manually update the addresses, you can:

1. Open `src/contexts/BlockchainContext.tsx`
2. Update the `CONTRACT_ADDRESSES` object with your new contract addresses:

```typescript
const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: process.env.REACT_APP_KYC_VERIFIER_ADDRESS || "0x...",
  TRUST_SCORE: process.env.REACT_APP_TRUST_SCORE_ADDRESS || "0x...",
  LOAN_MANAGER: process.env.REACT_APP_LOAN_MANAGER_ADDRESS || "0x...",
};
```

## Using a Different Network

To deploy to a different network (like a testnet):

1. Update the RPC URL in the deployment script
2. Add a network-specific wallet provider
3. Run the deployment script

## Verifying the Deployment

After deployment:

1. Connect your MetaMask to Ganache
2. Import a Ganache account to MetaMask
3. Open the app and connect your wallet
4. Test the blockchain features

## Troubleshooting

If you encounter issues:

1. Check if Ganache is running
2. Verify you are using the correct network in MetaMask
3. Make sure the contract addresses are correctly set
4. Check the console for any errors

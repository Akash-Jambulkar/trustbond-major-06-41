
# TrustBond Contract Deployment Guide

This guide explains how to deploy the TrustBond smart contracts to Ganache and configure your environment.

## Prerequisites

1. Install Ganache:
   - Desktop app: https://trufflesuite.com/ganache/
   - Or via npm: `npm install -g ganache-cli`

2. Install required dependencies:
   ```
   npm install web3 solc @truffle/hdwallet-provider
   ```

## Contract Overview

The TrustBond system consists of three core contracts:

1. **KYCVerifier**: Handles document submission and verification for identity verification.
2. **TrustScore**: Calculates and manages trust scores for users based on their financial behavior.
3. **LoanManager**: Handles loan applications, approvals, funding, and repayments.

## Deploying the Contracts

### Step 1: Start Ganache

Start Ganache with default settings:
- RPC Server: HTTP://127.0.0.1:7545
- Network ID: 1337

Make sure to keep Ganache running throughout the development and testing process.

### Step 2: Compile the Contracts (if needed)

If you've made changes to the contract source code, compile them first:

```
node src/contracts/deployment/compile.js
```

This will generate the contract ABI and bytecode in JSON files.

### Step 3: Run the Deployment Script

Run the deployment script:

```
node src/contracts/deployment/deploy.js
```

This will:
1. Deploy all three contracts (KYCVerifier, TrustScore, LoanManager) to Ganache
2. Set up proper contract connections (LoanManager references KYCVerifier and TrustScore)
3. Generate some test data (KYC approvals, trust scores, and loan applications)
4. Output the contract addresses
5. Create a `.env` file with the contract addresses

### Step 4: Connect MetaMask to Ganache

1. Install MetaMask browser extension if you haven't already
2. Click on the network dropdown and select "Add Network"
3. Add Ganache as a custom network:
   - Network Name: Ganache
   - New RPC URL: http://localhost:7545
   - Chain ID: 1337
   - Currency Symbol: ETH

### Step 5: Import Ganache Accounts to MetaMask

1. In Ganache, click on the key icon next to an account to reveal its private key
2. In MetaMask, click on your account icon > Import Account
3. Paste the private key and click "Import"
4. Repeat for any accounts you want to use (e.g., borrower, lender, admin)

## Using a Different Network

To deploy to a different network (like a testnet):

1. Update the RPC URL in the deployment script
2. Add a network-specific wallet provider
3. Run the deployment script with the appropriate configurations

For example, to deploy to Goerli testnet:

```javascript
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = 'your mnemonic phrase here';
const provider = new HDWalletProvider(mnemonic, 'https://goerli.infura.io/v3/YOUR_INFURA_KEY');
const web3 = new Web3(provider);
```

## Testing the Contracts

After deployment, you can interact with the contracts using the web interface or directly through Web3 in the browser console:

### KYC Verification

```javascript
// Get contract instances
const kyc = new web3.eth.Contract(kycAbi, kycAddress);

// Submit KYC document
await kyc.methods.submitKYC("0x12345...").send({ from: yourAddress });

// Verify KYC (admin only)
await kyc.methods.verifyKYC(userAddress, true).send({ from: adminAddress });

// Check KYC status
const status = await kyc.methods.getKYCStatus(userAddress).call();
```

### Trust Score

```javascript
// Get contract instance
const trust = new web3.eth.Contract(trustAbi, trustAddress);

// Check trust score
const score = await trust.methods.calculateScore(userAddress).call();

// Update trust score (admin only)
await trust.methods.updateScore(userAddress, 85).send({ from: adminAddress });
```

### Loan Manager

```javascript
// Get contract instance
const loans = new web3.eth.Contract(loanAbi, loanAddress);

// Apply for loan
const amount = web3.utils.toWei("1", "ether");
await loans.methods.applyForLoan(amount, 30, "Business loan").send({ from: borrowerAddress });

// Approve loan (admin only)
await loans.methods.reviewLoan(loanId, 2).send({ from: adminAddress });

// Fund loan
await loans.methods.fundLoan(loanId).send({ 
  from: lenderAddress,
  value: web3.utils.toWei("1", "ether") 
});

// Make repayment
await loans.methods.repayLoan(loanId).send({ 
  from: borrowerAddress,
  value: web3.utils.toWei("1.05", "ether") 
});
```

## Troubleshooting

If you encounter issues:

1. **Contract deployment failures:**
   - Check your Ganache is running and accessible
   - Ensure you have sufficient ETH in the deploying account
   - Check for compilation errors in the Solidity code

2. **MetaMask connection issues:**
   - Ensure Ganache is running
   - Confirm the RPC URL and Chain ID are correct
   - Reset your MetaMask account if transactions are stuck

3. **Contract interaction errors:**
   - Check that you're using the correct contract addresses
   - Ensure you're calling from an account with the right permissions
   - Verify that function parameters are in the correct format

4. **Environment configuration:**
   - Ensure the `.env` file is created with the correct contract addresses
   - Restart the development server after updating environment variables

Remember to reset your MetaMask account when you restart Ganache, as the blockchain state will be reset, but MetaMask will retain information about previous transactions.

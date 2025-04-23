
// Simple deployment script for Ganache
const fs = require('fs');
const path = require('path');
const Web3 = require('web3');

async function deployContracts() {
  // Connect to Ganache
  const web3 = new Web3('http://localhost:7545');
  
  // Get the first account to deploy contracts with
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0];
  
  console.log('Deploying contracts with account:', deployer);
  console.log('Account balance:', await web3.eth.getBalance(deployer));
  
  try {
    // Read contract JSON files
    const kycVerifierJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../KYCVerifier.json'), 'utf8'));
    const trustScoreJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../TrustScore.json'), 'utf8'));
    const loanManagerJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../LoanManager.json'), 'utf8'));
    
    // Deploy KYC Verifier
    console.log('Deploying KYC Verifier contract...');
    const KYCVerifierContract = new web3.eth.Contract(kycVerifierJson.abi);
    const kycVerifier = await KYCVerifierContract.deploy({
      data: kycVerifierJson.bytecode
    }).send({
      from: deployer,
      gas: 3000000
    });
    console.log('KYC Verifier deployed to:', kycVerifier.options.address);
    
    // Deploy Trust Score
    console.log('Deploying Trust Score contract...');
    const TrustScoreContract = new web3.eth.Contract(trustScoreJson.abi);
    const trustScore = await TrustScoreContract.deploy({
      data: trustScoreJson.bytecode
    }).send({
      from: deployer,
      gas: 3000000
    });
    console.log('Trust Score deployed to:', trustScore.options.address);
    
    // Deploy Loan Manager with references to other contracts
    console.log('Deploying Loan Manager contract...');
    const LoanManagerContract = new web3.eth.Contract(loanManagerJson.abi);
    const loanManager = await LoanManagerContract.deploy({
      data: loanManagerJson.bytecode,
      arguments: [trustScore.options.address, kycVerifier.options.address] // Pass the deployed contract addresses
    }).send({
      from: deployer,
      gas: 4000000
    });
    console.log('Loan Manager deployed to:', loanManager.options.address);
    
    // Update contract addresses in our configuration
    console.log('\nContract Addresses:');
    console.log('KYC_VERIFIER:', kycVerifier.options.address);
    console.log('TRUST_SCORE:', trustScore.options.address);
    console.log('LOAN_MANAGER:', loanManager.options.address);
    
    // Create a configuration file with the contract addresses
    const configContent = `
// Contract addresses - updated from deployment
export const CONTRACT_ADDRESSES = {
  KYCVerifier: "${kycVerifier.options.address}",
  TrustScore: "${trustScore.options.address}",
  LoanManager: "${loanManager.options.address}"
};

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 5777, // Ganache network
  name: "Ganache",
  rpcUrl: "http://localhost:7545"
};

// KYC submission fee in ETH
export const KYC_SUBMISSION_FEE = "0.01"; // 0.01 ETH fee for KYC submission

// Helper function to initialize contracts
export const initializeContracts = (web3) => {
  if (!web3) return { kycContract: null, trustScoreContract: null, loanContract: null };

  // Import ABIs
  const KYCVerifierABI = require('../../contracts/KYCVerifier.json').abi;
  const TrustScoreABI = require('../../contracts/TrustScore.json').abi;
  const LoanManagerABI = require('../../contracts/LoanManager.json').abi;

  // Create contract instances
  const kycContract = new web3.eth.Contract(
    KYCVerifierABI,
    CONTRACT_ADDRESSES.KYCVerifier
  );

  const trustScoreContract = new web3.eth.Contract(
    TrustScoreABI,
    CONTRACT_ADDRESSES.TrustScore
  );

  const loanContract = new web3.eth.Contract(
    LoanManagerABI,
    CONTRACT_ADDRESSES.LoanManager
  );

  return { kycContract, trustScoreContract, loanContract };
};
`;
    
    fs.writeFileSync(path.join(__dirname, '../../utils/contracts/contractConfig.js'), configContent);
    console.log('\nContract configuration file updated!');
    
    // Test the deployed contracts with some initial values
    console.log('\nSetting up test data...');
    
    // Create 2 test accounts with KYC and trust scores
    const testAccount1 = accounts[1];
    const testAccount2 = accounts[2];
    
    console.log('Setting up test KYC for:', testAccount1);
    await kycVerifier.methods.submitKYC("0x4578616d706c65446f63756d656e7448617368").send({ from: testAccount1 });
    await kycVerifier.methods.verifyKYC(testAccount1, true).send({ from: deployer });
    
    console.log('Setting up test KYC for:', testAccount2);
    await kycVerifier.methods.submitKYC("0x416e6f7468657244656d6f446f63756d656e7448617368").send({ from: testAccount2 });
    await kycVerifier.methods.verifyKYC(testAccount2, true).send({ from: deployer });
    
    console.log('Test data setup complete!');
    console.log('\nDeployment and setup successful!');
    console.log('-----------------------------------------------');
    console.log('Remember to:');
    console.log('1. Connect your MetaMask to Ganache (http://localhost:7545)');
    console.log('2. Import the Ganache accounts into MetaMask for testing');
    console.log('3. Use the application to interact with the contracts');
    
  } catch (error) {
    console.error('Error deploying contracts:', error);
  }
}

deployContracts();

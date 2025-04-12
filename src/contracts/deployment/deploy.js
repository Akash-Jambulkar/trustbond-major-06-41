
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
    
    // Create a .env file with the contract addresses
    const envContent = `
# Contract Addresses
REACT_APP_KYC_VERIFIER_ADDRESS=${kycVerifier.options.address}
REACT_APP_TRUST_SCORE_ADDRESS=${trustScore.options.address}
REACT_APP_LOAN_MANAGER_ADDRESS=${loanManager.options.address}
`;
    
    fs.writeFileSync(path.join(__dirname, '../../../.env'), envContent);
    console.log('\nEnvironment file (.env) created with contract addresses');
    
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
    
    console.log('Setting up test trust scores');
    await trustScore.methods.updateScore(testAccount1, 75).send({ from: deployer });
    await trustScore.methods.updateScore(testAccount2, 90).send({ from: deployer });
    
    console.log('Creating example loan applications');
    // Create test loan applications
    const loanAmount1 = web3.utils.toWei('1', 'ether');
    const loanAmount2 = web3.utils.toWei('2', 'ether');
    
    await loanManager.methods.applyForLoan(loanAmount1, 30, "Business expansion loan").send({ 
      from: testAccount1,
      gas: 3000000
    });
    
    await loanManager.methods.applyForLoan(loanAmount2, 60, "Home renovation project").send({ 
      from: testAccount2,
      gas: 3000000
    });
    
    console.log('Test data setup complete!');
    console.log('\nDeployment and setup successful!');
    console.log('-----------------------------------------------');
    console.log('Remember to:');
    console.log('1. Connect your MetaMask to Ganache (http://localhost:7545)');
    console.log('2. Import the Ganache accounts into MetaMask for testing');
    console.log('3. Use the transactions app to interact with the contracts');
    
  } catch (error) {
    console.error('Error deploying contracts:', error);
  }
}

deployContracts();

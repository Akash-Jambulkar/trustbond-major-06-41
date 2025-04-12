
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
  
  // Deploy KYC Verifier
  const KYCVerifierData = fs.readFileSync(path.join(__dirname, '../KYCVerifier.sol'), 'utf8');
  const KYCVerifierJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../KYCVerifier.json'), 'utf8'));
  
  // Deploy Trust Score
  const TrustScoreData = fs.readFileSync(path.join(__dirname, '../TrustScore.sol'), 'utf8');
  const TrustScoreJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../TrustScore.json'), 'utf8'));
  
  // Deploy Loan Manager
  const LoanManagerData = fs.readFileSync(path.join(__dirname, '../LoanManager.sol'), 'utf8');
  const LoanManagerJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../LoanManager.json'), 'utf8'));
  
  try {
    // Compile contracts using solc (would be implemented here)
    // For simplicity, we'll assume the contracts are already compiled
    // and we have the ABI and bytecode
    
    // Deploy KYC Verifier
    const KYCVerifierContract = new web3.eth.Contract(KYCVerifierJson.abi);
    const kycVerifier = await KYCVerifierContract.deploy({
      data: KYCVerifierJson.bytecode
    }).send({
      from: deployer,
      gas: 3000000
    });
    console.log('KYC Verifier deployed to:', kycVerifier.options.address);
    
    // Deploy Trust Score
    const TrustScoreContract = new web3.eth.Contract(TrustScoreJson.abi);
    const trustScore = await TrustScoreContract.deploy({
      data: TrustScoreJson.bytecode
    }).send({
      from: deployer,
      gas: 3000000
    });
    console.log('Trust Score deployed to:', trustScore.options.address);
    
    // Deploy Loan Manager
    const LoanManagerContract = new web3.eth.Contract(LoanManagerJson.abi);
    const loanManager = await LoanManagerContract.deploy({
      data: LoanManagerJson.bytecode
    }).send({
      from: deployer,
      gas: 3000000
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
    
  } catch (error) {
    console.error('Error deploying contracts:', error);
  }
}

deployContracts();

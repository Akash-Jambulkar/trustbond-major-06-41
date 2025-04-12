
// Script to compile the contracts
const fs = require('fs');
const path = require('path');
const solc = require('solc');

function compileContracts() {
  const contractPaths = [
    '../KYCVerifier.sol',
    '../TrustScore.sol',
    '../LoanManager.sol'
  ];
  
  const contractNames = [
    'KYCVerifier',
    'TrustScore',
    'LoanManager'
  ];
  
  // Read contract sources
  const sources = {};
  contractPaths.forEach(contractPath => {
    const contractFileName = path.basename(contractPath);
    const contractContent = fs.readFileSync(path.join(__dirname, contractPath), 'utf8');
    sources[contractFileName] = { content: contractContent };
  });

  // Compiler input
  const input = {
    language: 'Solidity',
    sources: sources,
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode']
        }
      }
    }
  };

  console.log('Compiling contracts...');
  
  // Compile the contracts
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  // Check for errors
  if (output.errors) {
    output.errors.forEach(error => {
      console.error(error.formattedMessage);
    });
    
    if (output.errors.some(error => error.severity === 'error')) {
      throw new Error('Compilation failed');
    }
  }
  
  console.log('Contracts compiled successfully');
  
  // Write output to JSON files
  contractNames.forEach(contractName => {
    const contract = output.contracts[`${contractName}.sol`][contractName];
    
    const contractOutput = {
      contractName: contractName,
      abi: contract.abi,
      bytecode: contract.evm.bytecode.object
    };
    
    // Add networks information (this would be updated by deployment script)
    contractOutput.networks = {};
    
    fs.writeFileSync(
      path.join(__dirname, `../${contractName}.json`),
      JSON.stringify(contractOutput, null, 2)
    );
    
    console.log(`${contractName}.json created`);
  });
}

try {
  compileContracts();
} catch (error) {
  console.error('Error compiling contracts:', error);
}

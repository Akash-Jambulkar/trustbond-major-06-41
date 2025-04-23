
// This file provides example code to deploy the TrustBond contracts
// Run this with a tool like Hardhat or Truffle

const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TrustBond contracts...");

  // Get contract factories
  const KYCVerifier = await ethers.getContractFactory("KYCVerifier");
  const TrustScore = await ethers.getContractFactory("TrustScore");
  const LoanManager = await ethers.getContractFactory("LoanManager");

  // Deploy KYCVerifier
  console.log("Deploying KYCVerifier...");
  const kycVerifier = await KYCVerifier.deploy();
  await kycVerifier.deployed();
  console.log("KYCVerifier deployed to:", kycVerifier.address);

  // Deploy TrustScore
  console.log("Deploying TrustScore...");
  const trustScore = await TrustScore.deploy();
  await trustScore.deployed();
  console.log("TrustScore deployed to:", trustScore.address);

  // Deploy LoanManager with addresses of other contracts
  console.log("Deploying LoanManager with addresses:");
  console.log("TrustScore:", trustScore.address);
  console.log("KYCVerifier:", kycVerifier.address);
  
  const loanManager = await LoanManager.deploy(
    trustScore.address,  // First parameter - trustScoreAddress
    kycVerifier.address  // Second parameter - kycVerifierAddress
  );
  
  await loanManager.deployed();
  console.log("LoanManager deployed to:", loanManager.address);

  console.log("All contracts deployed!");
  console.log({
    kycVerifier: kycVerifier.address,
    trustScore: trustScore.address,
    loanManager: loanManager.address
  });

  // For frontend configuration, save these addresses to your environment variables
  // or a configuration file that your frontend can access
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

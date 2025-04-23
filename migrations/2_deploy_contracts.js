
const KYCVerifier = artifacts.require("KYCVerifier");
const TrustScore = artifacts.require("TrustScore");
const LoanManager = artifacts.require("LoanManager");

module.exports = function(deployer) {
  // Deploy KYCVerifier
  deployer.deploy(KYCVerifier)
    .then(() => deployer.deploy(TrustScore))
    .then(() => {
      console.log("Deploying LoanManager with:");
      console.log("TrustScore address:", TrustScore.address);
      console.log("KYCVerifier address:", KYCVerifier.address);
      return deployer.deploy(LoanManager, TrustScore.address, KYCVerifier.address);
    });
};


# Smart Contracts for TrustBond

These smart contracts enable KYC verification, trust scoring, and loan management for the TrustBond platform.

## Contracts Overview

### KYCVerifier.sol
- Manages KYC document hashes and verification statuses
- Functions match frontend expectations including `submitKYC`, `verifyKYC`, and status checking

### TrustScore.sol
- Manages user trust scores based on financial activity
- Supports `calculateScore` as expected by frontend, plus transaction tracking

### LoanManager.sol
- Manages the entire loan lifecycle
- Includes `requestLoan`, `approveLoan`, `rejectLoan`, and `repayLoan` to directly match frontend function calls

## Deployment Instructions

1. Deploy in this order:
   - First: KYCVerifier
   - Second: TrustScore
   - Third: LoanManager (passing addresses of KYCVerifier and TrustScore as constructor arguments)

2. Record the deployed addresses and ABIs to configure your frontend

3. Update your frontend contract initialization code with the new addresses

## Security Notes

- These contracts include only basic access control
- For production use, consider adding more robust access controls such as:
  - OpenZeppelin's `Ownable` pattern
  - Role-based access control
  - Multi-signature management

## Integration with Frontend

The contracts are designed to match the function names and parameters expected by the existing frontend code in `loanOperations.ts`, `BlockchainContext.tsx`, and other frontend files.

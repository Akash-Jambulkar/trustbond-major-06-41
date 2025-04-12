
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TrustScore.sol";
import "./KYCVerifier.sol";

contract LoanManager {
    // Reference to other contracts
    TrustScore private trustScoreContract;
    KYCVerifier private kycVerifierContract;
    
    // Loan application status
    enum LoanStatus { Applied, Reviewing, Approved, Rejected, Funded, Repaying, Completed, Defaulted }
    
    // Loan application structure
    struct Loan {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 termDays;
        uint256 interestRate; // Represented as basis points (1% = 100)
        uint256 appliedDate;
        uint256 approvalDate;
        uint256 fundingDate;
        uint256 repaymentDeadline;
        LoanStatus status;
        string purpose;
        address lender;
        uint256 amountRepaid;
    }
    
    // Counter for loan IDs
    uint256 private loanIdCounter = 0;
    
    // Mapping from loan ID to loan data
    mapping(uint256 => Loan) private loans;
    
    // Mapping from user address to their loan IDs
    mapping(address => uint256[]) private userLoans;
    
    // Events
    event LoanApplied(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanStatusChanged(uint256 indexed loanId, LoanStatus status);
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanRepayment(uint256 indexed loanId, uint256 amount, uint256 remaining);
    
    /**
     * @dev Constructor to initialize contract with required dependencies
     * @param _trustScoreAddress Address of the TrustScore contract
     * @param _kycVerifierAddress Address of the KYCVerifier contract
     */
    constructor(address _trustScoreAddress, address _kycVerifierAddress) {
        trustScoreContract = TrustScore(_trustScoreAddress);
        kycVerifierContract = KYCVerifier(_kycVerifierAddress);
    }
    
    /**
     * @dev Apply for a loan
     * @param amount The amount of the loan requested
     * @param termDays The loan term in days
     * @param purpose Brief description of loan purpose
     */
    function applyForLoan(uint256 amount, uint256 termDays, string memory purpose) public {
        // Ensure borrower has completed KYC
        require(kycVerifierContract.getKYCStatus(msg.sender), "KYC verification required");
        
        // Get the user's trust score
        uint256 trustScore = trustScoreContract.calculateScore(msg.sender);
        
        // Minimum trust score required to apply for a loan
        require(trustScore >= 50, "Trust score too low for loan application");
        
        // Calculate interest rate based on trust score (simplified)
        uint256 interestRate = calculateInterestRate(trustScore);
        
        // Create new loan
        uint256 loanId = loanIdCounter++;
        Loan memory newLoan = Loan({
            id: loanId,
            borrower: msg.sender,
            amount: amount,
            termDays: termDays,
            interestRate: interestRate,
            appliedDate: block.timestamp,
            approvalDate: 0,
            fundingDate: 0,
            repaymentDeadline: 0,
            status: LoanStatus.Applied,
            purpose: purpose,
            lender: address(0),
            amountRepaid: 0
        });
        
        loans[loanId] = newLoan;
        userLoans[msg.sender].push(loanId);
        
        emit LoanApplied(loanId, msg.sender, amount);
    }
    
    /**
     * @dev Review and change the status of a loan application (only callable by admin)
     * @param loanId The ID of the loan
     * @param status The new status to set
     */
    function reviewLoan(uint256 loanId, LoanStatus status) public {
        // In a production environment, add access control here
        
        require(status == LoanStatus.Approved || status == LoanStatus.Rejected, "Invalid loan review status");
        require(loans[loanId].status == LoanStatus.Applied || loans[loanId].status == LoanStatus.Reviewing, "Loan not in reviewable state");
        
        loans[loanId].status = status;
        
        if (status == LoanStatus.Approved) {
            loans[loanId].approvalDate = block.timestamp;
        }
        
        emit LoanStatusChanged(loanId, status);
    }
    
    /**
     * @dev Fund an approved loan (can be called by any user with sufficient funds)
     * @param loanId The ID of the loan to fund
     */
    function fundLoan(uint256 loanId) public payable {
        require(loans[loanId].status == LoanStatus.Approved, "Loan not approved");
        require(msg.value >= loans[loanId].amount, "Insufficient funds sent");
        
        loans[loanId].status = LoanStatus.Funded;
        loans[loanId].lender = msg.sender;
        loans[loanId].fundingDate = block.timestamp;
        loans[loanId].repaymentDeadline = block.timestamp + (loans[loanId].termDays * 1 days);
        
        // Transfer funds to borrower
        payable(loans[loanId].borrower).transfer(loans[loanId].amount);
        
        // Return any excess funds
        if (msg.value > loans[loanId].amount) {
            payable(msg.sender).transfer(msg.value - loans[loanId].amount);
        }
        
        emit LoanFunded(loanId, msg.sender);
        emit LoanStatusChanged(loanId, LoanStatus.Funded);
    }
    
    /**
     * @dev Make a repayment towards a loan
     * @param loanId The ID of the loan
     */
    function repayLoan(uint256 loanId) public payable {
        require(loans[loanId].status == LoanStatus.Funded || loans[loanId].status == LoanStatus.Repaying, "Loan not in repayable state");
        require(loans[loanId].borrower == msg.sender, "Only borrower can repay loan");
        
        uint256 totalDue = calculateTotalDue(loanId);
        uint256 remaining = totalDue - loans[loanId].amountRepaid;
        
        require(msg.value > 0, "Must send some funds");
        uint256 paymentAmount = msg.value > remaining ? remaining : msg.value;
        
        loans[loanId].amountRepaid += paymentAmount;
        
        if (loans[loanId].status == LoanStatus.Funded) {
            loans[loanId].status = LoanStatus.Repaying;
            emit LoanStatusChanged(loanId, LoanStatus.Repaying);
        }
        
        // Check if loan is fully repaid
        if (loans[loanId].amountRepaid >= totalDue) {
            loans[loanId].status = LoanStatus.Completed;
            emit LoanStatusChanged(loanId, LoanStatus.Completed);
        }
        
        // Transfer payment to lender
        payable(loans[loanId].lender).transfer(paymentAmount);
        
        // Return excess payment if any
        if (msg.value > paymentAmount) {
            payable(msg.sender).transfer(msg.value - paymentAmount);
        }
        
        emit LoanRepayment(loanId, paymentAmount, totalDue - loans[loanId].amountRepaid);
    }
    
    /**
     * @dev Mark a loan as defaulted (only callable by admin)
     * @param loanId The ID of the loan
     */
    function markAsDefaulted(uint256 loanId) public {
        // In a production environment, add access control here
        
        require(loans[loanId].status == LoanStatus.Funded || loans[loanId].status == LoanStatus.Repaying, "Loan not in active state");
        require(block.timestamp > loans[loanId].repaymentDeadline, "Loan not yet overdue");
        
        loans[loanId].status = LoanStatus.Defaulted;
        
        // Update borrower's trust score negatively
        // This would ideally be implemented in the TrustScore contract
        
        emit LoanStatusChanged(loanId, LoanStatus.Defaulted);
    }
    
    /**
     * @dev Get the details of a specific loan
     * @param loanId The ID of the loan
     * @return Loan memory The loan details
     */
    function getLoan(uint256 loanId) public view returns (Loan memory) {
        return loans[loanId];
    }
    
    /**
     * @dev Get all loans associated with a user
     * @param user The address of the user
     * @return uint256[] memory Array of loan IDs
     */
    function getUserLoans(address user) public view returns (uint256[] memory) {
        return userLoans[user];
    }
    
    /**
     * @dev Calculate interest rate based on trust score (simplified)
     * @param trustScore The trust score of the borrower
     * @return uint256 The calculated interest rate in basis points
     */
    function calculateInterestRate(uint256 trustScore) internal pure returns (uint256) {
        // Example calculation:
        // Trust score 100 (max) = 500 basis points (5%)
        // Trust score 50 (min) = 2000 basis points (20%)
        if (trustScore >= 100) return 500;
        if (trustScore <= 50) return 2000;
        
        // Linear interpolation for scores in between
        return 2000 - ((trustScore - 50) * 1500 / 50);
    }
    
    /**
     * @dev Calculate the total amount due for a loan including interest
     * @param loanId The ID of the loan
     * @return uint256 The total amount due
     */
    function calculateTotalDue(uint256 loanId) public view returns (uint256) {
        Loan memory loan = loans[loanId];
        uint256 interest = (loan.amount * loan.interestRate * loan.termDays) / (10000 * 365);
        return loan.amount + interest;
    }
}

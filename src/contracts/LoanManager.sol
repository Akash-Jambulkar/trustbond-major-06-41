
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./KYCVerifier.sol";
import "./TrustScore.sol";

/**
 * @title LoanManager
 * @dev Manages loan applications, approvals, and repayments
 */
contract LoanManager {
    address public owner;
    KYCVerifier public kycVerifier;
    TrustScore public trustScore;
    
    enum LoanStatus { Pending, Approved, Rejected, Funded, Repaid, Defaulted }
    
    struct Loan {
        address borrower;
        address bank;
        uint256 amount;
        uint256 termMonths;
        uint256 interestRate;
        uint256 createdAt;
        uint256 fundedAt;
        uint256 repaidAmount;
        LoanStatus status;
    }
    
    // Counter for loan IDs
    uint256 public loanCounter;
    
    // Mapping from loan ID to loan details
    mapping(uint256 => Loan) public loans;
    
    // Mapping from user address to their loan IDs
    mapping(address => uint256[]) public userLoans;
    
    // Mapping from bank address to their loan IDs
    mapping(address => uint256[]) public bankLoans;
    
    // Events
    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanApproved(uint256 indexed loanId, address indexed bank);
    event LoanRejected(uint256 indexed loanId, address indexed bank);
    event LoanFunded(uint256 indexed loanId, address indexed bank, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    
    constructor(address _kycVerifierAddress, address _trustScoreAddress) {
        owner = msg.sender;
        kycVerifier = KYCVerifier(_kycVerifierAddress);
        trustScore = TrustScore(_trustScoreAddress);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyBorrower(uint256 loanId) {
        require(loans[loanId].borrower == msg.sender, "Only borrower can call this function");
        _;
    }
    
    modifier onlyBank(uint256 loanId) {
        require(loans[loanId].bank == msg.sender, "Only assigned bank can call this function");
        _;
    }
    
    /**
     * @dev Request a loan
     * @param amount The loan amount in wei
     * @param termMonths The loan term in months
     * @param bankId The address of the bank
     */
    function requestLoan(uint256 amount, uint256 termMonths, address bankId) public {
        require(amount > 0, "Loan amount must be greater than 0");
        require(termMonths > 0, "Loan term must be greater than 0");
        require(kycVerifier.isKYCVerified(msg.sender), "KYC verification required");
        
        uint256 loanId = loanCounter++;
        
        loans[loanId] = Loan({
            borrower: msg.sender,
            bank: bankId, // Fixed: removed payable conversion as it's unnecessary here
            amount: amount,
            termMonths: termMonths,
            interestRate: 5, // Default interest rate, can be adjusted later
            createdAt: block.timestamp,
            fundedAt: 0,
            repaidAmount: 0,
            status: LoanStatus.Pending
        });
        
        userLoans[msg.sender].push(loanId);
        bankLoans[bankId].push(loanId);
        
        // Record transaction for trust score
        trustScore.addTransaction(msg.sender);
        
        emit LoanRequested(loanId, msg.sender, amount);
    }
    
    /**
     * @dev Approve a loan request
     * @param borrowerAddress The address of the borrower
     * @param amount The loan amount in wei
     */
    function approveLoan(address borrowerAddress, uint256 amount) public {
        // Find the loan from the borrower that matches this bank and amount
        uint256 loanId = findLoan(borrowerAddress, msg.sender, amount);
        require(loanId != type(uint256).max, "No matching loan found");
        require(loans[loanId].status == LoanStatus.Pending, "Loan must be in pending status");
        
        loans[loanId].status = LoanStatus.Approved;
        loans[loanId].fundedAt = block.timestamp;
        
        emit LoanApproved(loanId, msg.sender);
    }
    
    /**
     * @dev Reject a loan request
     * @param borrowerAddress The address of the borrower
     */
    function rejectLoan(address borrowerAddress) public {
        // Find the loan from the borrower that matches this bank
        uint256 loanId = findLoanByBorrowerAndBank(borrowerAddress, msg.sender);
        require(loanId != type(uint256).max, "No matching loan found");
        require(loans[loanId].status == LoanStatus.Pending, "Loan must be in pending status");
        
        loans[loanId].status = LoanStatus.Rejected;
        
        emit LoanRejected(loanId, msg.sender);
    }
    
    /**
     * @dev Repay a loan
     * @param loanId The ID of the loan
     * @param amount The amount to repay in wei
     */
    function repayLoan(uint256 loanId, uint256 amount) public payable {
        require(loans[loanId].borrower == msg.sender, "Only borrower can repay loan");
        require(loans[loanId].status == LoanStatus.Approved || loans[loanId].status == LoanStatus.Funded, "Loan must be approved or funded");
        require(amount > 0, "Repayment amount must be greater than 0");
        require(msg.value == amount, "Sent ETH must match repayment amount");
        
        // Transfer payment to the bank
        payable(loans[loanId].bank).transfer(amount);
        
        loans[loanId].repaidAmount += amount;
        
        // Record repayment for trust score
        trustScore.addRepayment(msg.sender);
        
        // If fully repaid, update loan status
        if (loans[loanId].repaidAmount >= loans[loanId].amount) {
            loans[loanId].status = LoanStatus.Repaid;
        }
        
        emit LoanRepaid(loanId, msg.sender, amount);
    }
    
    /**
     * @dev Mark a loan as defaulted
     * @param loanId The ID of the loan
     */
    function markAsDefaulted(uint256 loanId) public onlyBank(loanId) {
        require(loans[loanId].status == LoanStatus.Approved || loans[loanId].status == LoanStatus.Funded, "Loan must be approved or funded");
        
        loans[loanId].status = LoanStatus.Defaulted;
        
        // Record default for trust score
        trustScore.addDefault(loans[loanId].borrower);
        
        emit LoanDefaulted(loanId, loans[loanId].borrower);
    }
    
    /**
     * @dev Get all loans for a user
     * @param user The address of the user
     * @return Array of loan IDs
     */
    function getUserLoans(address user) public view returns (uint256[] memory) {
        return userLoans[user];
    }
    
    /**
     * @dev Get all loans for a bank
     * @param bank The address of the bank
     * @return Array of loan IDs
     */
    function getBankLoans(address bank) public view returns (uint256[] memory) {
        return bankLoans[bank];
    }
    
    /**
     * @dev Get loan details
     * @param loanId The ID of the loan
     * @return Loan details
     */
    function getLoanDetails(uint256 loanId) public view returns (
        address borrower,
        address bank,
        uint256 amount,
        uint256 termMonths,
        uint256 interestRate,
        uint256 repaidAmount,
        LoanStatus status
    ) {
        Loan memory loan = loans[loanId];
        return (
            loan.borrower,
            loan.bank,
            loan.amount,
            loan.termMonths,
            loan.interestRate,
            loan.repaidAmount,
            loan.status
        );
    }
    
    /**
     * @dev Helper function to find a loan by borrower, bank, and amount
     */
    function findLoan(address borrower, address bank, uint256 amount) internal view returns (uint256) {
        uint256[] memory borrowerLoans = userLoans[borrower];
        for (uint256 i = 0; i < borrowerLoans.length; i++) {
            uint256 loanId = borrowerLoans[i];
            if (loans[loanId].bank == bank && loans[loanId].amount == amount && loans[loanId].status == LoanStatus.Pending) {
                return loanId;
            }
        }
        return type(uint256).max; // Not found
    }
    
    /**
     * @dev Helper function to find a loan by borrower and bank
     */
    function findLoanByBorrowerAndBank(address borrower, address bank) internal view returns (uint256) {
        uint256[] memory borrowerLoans = userLoans[borrower];
        for (uint256 i = 0; i < borrowerLoans.length; i++) {
            uint256 loanId = borrowerLoans[i];
            if (loans[loanId].bank == bank && loans[loanId].status == LoanStatus.Pending) {
                return loanId;
            }
        }
        return type(uint256).max; // Not found
    }
}

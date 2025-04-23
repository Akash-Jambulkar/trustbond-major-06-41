
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title LoanManager
 * @dev Manages loan applications and approvals
 */
contract LoanManager {
    address public owner;
    address public trustScoreAddress;
    address public kycVerifierAddress;
    
    // Loan status enum
    enum LoanStatus { Pending, Approved, Rejected, Repaid, Defaulted }
    
    // Loan structure
    struct Loan {
        uint256 id;
        address borrower;
        address lender;
        uint256 amount;
        uint256 duration; // in days
        uint256 interestRate;
        uint256 timestamp;
        LoanStatus status;
        string description;
    }
    
    // Mapping from loan ID to Loan
    mapping(uint256 => Loan) public loans;
    
    // Counter for loan IDs
    uint256 public loanCounter;
    
    // Mapping from user to their loans
    mapping(address => uint256[]) public userLoans;
    
    // Events
    event LoanRequested(address indexed borrower, uint256 indexed loanId, uint256 amount);
    event LoanProcessed(uint256 indexed loanId, LoanStatus status, address indexed processor);
    event LoanRepaid(uint256 indexed loanId, uint256 amount);
    
    constructor(address _trustScoreAddress, address _kycVerifierAddress) {
        owner = msg.sender;
        trustScoreAddress = _trustScoreAddress;
        kycVerifierAddress = _kycVerifierAddress;
        loanCounter = 0;
    }
    
    /**
     * @dev Requests a loan
     * @param amount The loan amount
     * @param duration The loan duration in days
     * @param description The purpose of the loan
     * @return The loan ID
     */
    function requestLoan(uint256 amount, uint256 duration, string memory description) public returns (uint256) {
        require(amount > 0, "Loan amount must be greater than 0");
        require(duration > 0, "Loan duration must be greater than 0");
        
        uint256 loanId = loanCounter++;
        
        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            lender: address(0),
            amount: amount,
            duration: duration,
            interestRate: 5, // Default interest rate, could be calculated based on trust score
            timestamp: block.timestamp,
            status: LoanStatus.Pending,
            description: description
        });
        
        userLoans[msg.sender].push(loanId);
        
        emit LoanRequested(msg.sender, loanId, amount);
        
        return loanId;
    }
    
    /**
     * @dev Approves a loan
     * @param loanId The ID of the loan
     */
    function approveLoan(uint256 loanId) public {
        require(loans[loanId].status == LoanStatus.Pending, "Loan is not pending");
        require(loans[loanId].borrower != msg.sender, "Cannot approve your own loan");
        
        loans[loanId].lender = msg.sender;
        loans[loanId].status = LoanStatus.Approved;
        
        emit LoanProcessed(loanId, LoanStatus.Approved, msg.sender);
    }
    
    /**
     * @dev Rejects a loan
     * @param loanId The ID of the loan
     */
    function rejectLoan(uint256 loanId) public {
        require(loans[loanId].status == LoanStatus.Pending, "Loan is not pending");
        
        loans[loanId].status = LoanStatus.Rejected;
        
        emit LoanProcessed(loanId, LoanStatus.Rejected, msg.sender);
    }
    
    /**
     * @dev Repays a loan
     * @param loanId The ID of the loan
     */
    function repayLoan(uint256 loanId) public payable {
        require(loans[loanId].status == LoanStatus.Approved, "Loan is not approved");
        require(loans[loanId].borrower == msg.sender, "Only borrower can repay loan");
        require(msg.value >= loans[loanId].amount, "Insufficient amount to repay loan");
        
        address payable lender = payable(loans[loanId].lender);
        lender.transfer(msg.value);
        
        loans[loanId].status = LoanStatus.Repaid;
        
        emit LoanRepaid(loanId, msg.value);
    }
    
    /**
     * @dev Gets all loans for a user
     * @param user The user address
     * @return An array of loan IDs
     */
    function getUserLoans(address user) public view returns (uint256[] memory) {
        return userLoans[user];
    }
    
    /**
     * @dev Gets a loan by ID
     * @param loanId The loan ID
     * @return The loan details
     */
    function getLoan(uint256 loanId) public view returns (Loan memory) {
        return loans[loanId];
    }
    
    /**
     * @dev Gets all loans
     * @return An array of all loans
     */
    function getAllLoans() public view returns (Loan[] memory) {
        Loan[] memory allLoans = new Loan[](loanCounter);
        
        for (uint256 i = 0; i < loanCounter; i++) {
            allLoans[i] = loans[i];
        }
        
        return allLoans;
    }
}

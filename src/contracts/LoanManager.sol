// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanManager {
    struct Loan {
        address borrower;
        uint256 amount;
        uint256 duration;
        uint256 startTime;
        bool approved;
        bool repaid;
    }
    
    // Mapping from loan ID to Loan struct
    mapping(uint256 => Loan) private loans;
    
    // Mapping from user address to array of their loan IDs
    mapping(address => uint256[]) private userLoans;
    
    // Counter for generating unique loan IDs
    uint256 private loanIdCounter;
    
    // Events
    event LoanRequested(address indexed user, uint256 amount, uint256 duration);
    event LoanApproved(address indexed user, uint256 loanId);
    event LoanRejected(address indexed user, uint256 loanId);
    event LoanRepaid(address indexed user, uint256 loanId, uint256 amount);
    
    /**
     * @dev Request a loan
     * @param amount The amount of the loan
     * @param duration The duration of the loan in days
     * @return The ID of the newly created loan
     */
    function requestLoan(uint256 amount, uint256 duration) public returns (uint256) {
        uint256 loanId = loanIdCounter++;
        
        loans[loanId] = Loan({
            borrower: msg.sender,
            amount: amount,
            duration: duration,
            startTime: 0, // Will be set when approved
            approved: false,
            repaid: false
        });
        
        userLoans[msg.sender].push(loanId);
        
        emit LoanRequested(msg.sender, amount, duration);
        
        return loanId;
    }
    
    /**
     * @dev Approve a loan (only callable by admin)
     * @param loanId The ID of the loan to approve
     */
    function approveLoan(uint256 loanId) public {
        // In a production environment, add access control here
        require(loans[loanId].borrower != address(0), "Loan does not exist");
        require(!loans[loanId].approved, "Loan already approved");
        
        loans[loanId].approved = true;
        loans[loanId].startTime = block.timestamp;
        
        emit LoanApproved(loans[loanId].borrower, loanId);
    }
    
    /**
     * @dev Reject a loan (only callable by admin)
     * @param loanId The ID of the loan to reject
     */
    function rejectLoan(uint256 loanId) public {
        // In a production environment, add access control here
        require(loans[loanId].borrower != address(0), "Loan does not exist");
        require(!loans[loanId].approved, "Loan already approved");
        
        // We could delete the loan here, but we'll keep it with approved=false
        
        emit LoanRejected(loans[loanId].borrower, loanId);
    }
    
    /**
     * @dev Repay a loan
     * @param loanId The ID of the loan to repay
     * @param amount The amount to repay
     */
    function repayLoan(uint256 loanId, uint256 amount) public {
        require(loans[loanId].borrower == msg.sender, "Not the borrower");
        require(loans[loanId].approved, "Loan not approved");
        require(!loans[loanId].repaid, "Loan already repaid");
        
        // In a real implementation, we would handle the actual transfer of funds
        
        loans[loanId].repaid = true;
        
        emit LoanRepaid(msg.sender, loanId, amount);
    }
    
    /**
     * @dev Get details about a specific loan
     * @param loanId The ID of the loan
     * @return borrower The address of the borrower
     * @return amount The loan amount
     * @return duration The loan duration
     * @return startTime The start time of the loan
     * @return approved Whether the loan is approved
     * @return repaid Whether the loan is repaid
     */
    function getLoan(uint256 loanId) public view returns (
        address, uint256, uint256, uint256, bool, bool
    ) {
        Loan storage loan = loans[loanId];
        return (
            loan.borrower,
            loan.amount,
            loan.duration,
            loan.startTime,
            loan.approved,
            loan.repaid
        );
    }
    
    /**
     * @dev Get all loan IDs for a specific user
     * @param user The address of the user
     * @return An array of loan IDs
     */
    function getUserLoans(address user) public view returns (uint256[] memory) {
        return userLoans[user];
    }
}

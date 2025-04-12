
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrustScore {
    // Mapping to store trust scores for each user
    mapping(address => uint256) private scores;
    
    // Mapping to store transaction counts
    mapping(address => uint256) private transactionCounts;
    
    // Mapping to store the number of successful loan repayments
    mapping(address => uint256) private successfulLoanRepayments;
    
    // Mapping to store loan defaults
    mapping(address => uint256) private loanDefaults;
    
    // Event emitted when a user's score is updated
    event ScoreUpdated(address indexed user, uint256 newScore);
    
    // Event emitted when a transaction is added
    event TransactionAdded(address indexed user, uint256 newTransactionCount);
    
    // Event emitted when a loan repayment is recorded
    event LoanRepaymentRecorded(address indexed user, uint256 newSuccessfulRepayments);
    
    // Event emitted when a loan default is recorded
    event LoanDefaultRecorded(address indexed user, uint256 newDefaults);
    
    /**
     * @dev Update the trust score for a user (only callable by admin)
     * @param user The address of the user whose score is being updated
     * @param score The new trust score
     */
    function updateScore(address user, uint256 score) public {
        // In a production environment, add access control here
        require(score <= 100, "Score must be between 0 and 100");
        scores[user] = score;
        emit ScoreUpdated(user, score);
    }
    
    /**
     * @dev Record a successful transaction for a user
     * @param user The address of the user
     */
    function addTransaction(address user) public {
        // In a production environment, add access control here
        transactionCounts[user]++;
        emit TransactionAdded(user, transactionCounts[user]);
        
        // Recalculate score
        calculateAndUpdateScore(user);
    }
    
    /**
     * @dev Record a successful loan repayment
     * @param user The address of the user
     */
    function addLoanRepayment(address user) public {
        // In a production environment, add access control here
        successfulLoanRepayments[user]++;
        emit LoanRepaymentRecorded(user, successfulLoanRepayments[user]);
        
        // Recalculate score
        calculateAndUpdateScore(user);
    }
    
    /**
     * @dev Record a loan default
     * @param user The address of the user
     */
    function addLoanDefault(address user) public {
        // In a production environment, add access control here
        loanDefaults[user]++;
        emit LoanDefaultRecorded(user, loanDefaults[user]);
        
        // Recalculate score
        calculateAndUpdateScore(user);
    }
    
    /**
     * @dev Calculate and update the trust score for a user based on their history
     * @param user The address of the user
     */
    function calculateAndUpdateScore(address user) internal {
        uint256 baseScore = scores[user];
        if (baseScore == 0) {
            baseScore = 50; // Default starting score
        }
        
        // Calculate transaction bonus (max +10 points)
        uint256 transactionBonus = 0;
        if (transactionCounts[user] > 0) {
            transactionBonus = transactionCounts[user] > 20 ? 10 : transactionCounts[user] / 2;
        }
        
        // Calculate loan repayment bonus (max +30 points)
        uint256 repaymentBonus = 0;
        if (successfulLoanRepayments[user] > 0) {
            repaymentBonus = successfulLoanRepayments[user] > 10 ? 30 : successfulLoanRepayments[user] * 3;
        }
        
        // Calculate loan default penalty (max -50 points)
        uint256 defaultPenalty = 0;
        if (loanDefaults[user] > 0) {
            defaultPenalty = loanDefaults[user] > 3 ? 50 : loanDefaults[user] * 15;
        }
        
        // Calculate final score
        int256 scoreChange = int256(transactionBonus) + int256(repaymentBonus) - int256(defaultPenalty);
        int256 newScore = int256(baseScore) + scoreChange;
        
        // Cap score between 0 and 100
        if (newScore < 0) newScore = 0;
        if (newScore > 100) newScore = 100;
        
        // Update score
        scores[user] = uint256(newScore);
        emit ScoreUpdated(user, uint256(newScore));
    }
    
    /**
     * @dev Get the transaction count for a user
     * @param user The address of the user
     * @return The transaction count
     */
    function getTransactionCount(address user) public view returns (uint256) {
        return transactionCounts[user];
    }
    
    /**
     * @dev Get the successful loan repayments for a user
     * @param user The address of the user
     * @return The number of successful loan repayments
     */
    function getSuccessfulLoanRepayments(address user) public view returns (uint256) {
        return successfulLoanRepayments[user];
    }
    
    /**
     * @dev Get the loan defaults for a user
     * @param user The address of the user
     * @return The number of loan defaults
     */
    function getLoanDefaults(address user) public view returns (uint256) {
        return loanDefaults[user];
    }
    
    /**
     * @dev Calculate the trust score for a user
     * @param user The address of the user
     * @return The calculated trust score
     */
    function calculateScore(address user) public view returns (uint256) {
        return scores[user];
    }
}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TrustScore
 * @dev Manages user trust scores based on their financial behavior
 */
contract TrustScore {
    address public owner;
    
    struct UserScore {
        uint256 score;
        uint256 transactionCount;
        uint256 repaymentCount;
        uint256 defaultCount;
        bool isInitialized;
    }
    
    // Base score for new users
    uint256 public constant BASE_SCORE = 650;
    
    // Mapping from user address to their trust score data
    mapping(address => UserScore) public userScores;
    
    // Events
    event ScoreUpdated(address indexed user, uint256 newScore);
    event TransactionAdded(address indexed user, uint256 transactionCount);
    event RepaymentAdded(address indexed user, uint256 repaymentCount);
    event DefaultAdded(address indexed user, uint256 defaultCount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Updates a user's trust score directly
     * @param user The address of the user
     * @param score The new score to set
     */
    function updateScore(address user, uint256 score) public {
        require(score > 0, "Score must be positive");
        
        if (!userScores[user].isInitialized) {
            userScores[user] = UserScore({
                score: score,
                transactionCount: 0,
                repaymentCount: 0,
                defaultCount: 0,
                isInitialized: true
            });
        } else {
            userScores[user].score = score;
        }
        
        emit ScoreUpdated(user, score);
    }
    
    /**
     * @dev Records a new transaction for a user
     * @param user The address of the user
     */
    function addTransaction(address user) public {
        if (!userScores[user].isInitialized) {
            userScores[user] = UserScore({
                score: BASE_SCORE,
                transactionCount: 1,
                repaymentCount: 0,
                defaultCount: 0,
                isInitialized: true
            });
        } else {
            userScores[user].transactionCount += 1;
        }
        
        emit TransactionAdded(user, userScores[user].transactionCount);
    }
    
    /**
     * @dev Records a loan repayment for a user
     * @param user The address of the user
     */
    function addRepayment(address user) public {
        require(userScores[user].isInitialized, "User not initialized");
        
        userScores[user].repaymentCount += 1;
        
        // Increase score on repayment (basic algorithm)
        if (userScores[user].score < 850) {
            userScores[user].score += 5;
            if (userScores[user].score > 850) {
                userScores[user].score = 850;
            }
        }
        
        emit RepaymentAdded(user, userScores[user].repaymentCount);
        emit ScoreUpdated(user, userScores[user].score);
    }
    
    /**
     * @dev Records a loan default for a user
     * @param user The address of the user
     */
    function addDefault(address user) public {
        require(userScores[user].isInitialized, "User not initialized");
        
        userScores[user].defaultCount += 1;
        
        // Decrease score on default (basic algorithm)
        if (userScores[user].score > 350) {
            userScores[user].score -= 50;
            if (userScores[user].score < 350) {
                userScores[user].score = 350;
            }
        }
        
        emit DefaultAdded(user, userScores[user].defaultCount);
        emit ScoreUpdated(user, userScores[user].score);
    }
    
    /**
     * @dev Calculates and returns a user's current trust score
     * @param user The address of the user
     * @return The calculated trust score
     */
    function calculateScore(address user) public view returns (uint256) {
        if (!userScores[user].isInitialized) {
            return BASE_SCORE;
        }
        
        return userScores[user].score;
    }
    
    /**
     * @dev Gets all details of a user's trust score profile
     * @param user The address of the user
     * @return score The current trust score
     * @return transactionCount Number of transactions
     * @return repaymentCount Number of successful repayments
     * @return defaultCount Number of defaults
     */
    function getUserScoreDetails(address user) public view returns (
        uint256 score,
        uint256 transactionCount,
        uint256 repaymentCount,
        uint256 defaultCount
    ) {
        if (!userScores[user].isInitialized) {
            return (BASE_SCORE, 0, 0, 0);
        }
        
        UserScore memory userScore = userScores[user];
        return (
            userScore.score,
            userScore.transactionCount,
            userScore.repaymentCount,
            userScore.defaultCount
        );
    }
}

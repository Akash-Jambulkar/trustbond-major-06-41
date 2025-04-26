
pragma solidity 0.5.16;

contract TrustScore {
    mapping(address => uint256) public scores;
    
    event ScoreUpdated(address indexed user, uint256 newScore);
    
    function updateScore(address user, uint256 score) public {
        require(score <= 100, "Score must be between 0 and 100");
        scores[user] = score;
        emit ScoreUpdated(user, score);
    }
    
    function getScore(address user) public view returns (uint256) {
        return scores[user];
    }
}

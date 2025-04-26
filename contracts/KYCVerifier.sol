
pragma solidity 0.5.16;

contract KYCVerifier {
    mapping(address => bool) public verifiedUsers;
    mapping(bytes32 => bool) public documentHashes;
    
    event KYCSubmitted(address indexed user, bytes32 documentHash);
    event KYCVerified(address indexed user, bool status);
    
    function submitKYC(bytes32 documentHash) public {
        require(!documentHashes[documentHash], "Document already submitted");
        documentHashes[documentHash] = true;
        verifiedUsers[msg.sender] = true;
        emit KYCSubmitted(msg.sender, documentHash);
    }
    
    function verifyKYC(address user, bool status) public {
        require(bytes32(0) != documentHashes[bytes32(0)], "No KYC document found for user");
        verifiedUsers[user] = status;
        emit KYCVerified(user, status);
    }
    
    function isVerified(address user) public view returns (bool) {
        return verifiedUsers[user];
    }
}

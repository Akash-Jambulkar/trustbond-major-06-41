
pragma solidity 0.5.16;

contract KYCVerifier {
    mapping(address => bool) public verifiedUsers;
    mapping(bytes32 => bool) public documentHashes;
    
    event KYCVerified(address indexed user, bytes32 documentHash);
    
    function submitKYC(bytes32 documentHash) public payable {
        require(!documentHashes[documentHash], "Document already submitted");
        documentHashes[documentHash] = true;
        verifiedUsers[msg.sender] = true;
        emit KYCVerified(msg.sender, documentHash);
    }
    
    function isVerified(address user) public view returns (bool) {
        return verifiedUsers[user];
    }
}

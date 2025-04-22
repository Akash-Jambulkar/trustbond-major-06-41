
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title KYCVerifier
 * @dev Manages KYC document submissions and verification
 */
contract KYCVerifier {
    address public owner;
    
    struct KYCDocument {
        string documentHash;
        string documentType;
        bool isVerified;
        uint256 timestamp;
    }
    
    // Mapping from user address to their KYC document
    mapping(address => KYCDocument) public kycDocuments;
    // Check if a document hash has been used before
    mapping(string => bool) public usedDocumentHashes;
    
    // Events
    event KYCSubmitted(address indexed user, string documentHash);
    event KYCVerified(address indexed user, bool status);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Submits a KYC document hash
     * @param documentHash The hash of the document
     */
    function submitKYC(string memory documentHash) public {
        submitKYC(documentHash, "generic");
    }
    
    /**
     * @dev Submits a KYC document hash with type
     * @param documentHash The hash of the document
     * @param documentType The type of document (e.g., "passport", "drivers_license")
     */
    function submitKYC(string memory documentHash, string memory documentType) public {
        require(bytes(documentHash).length > 0, "Document hash cannot be empty");
        require(!usedDocumentHashes[documentHash], "Document hash already used");
        
        kycDocuments[msg.sender] = KYCDocument({
            documentHash: documentHash,
            documentType: documentType,
            isVerified: false,
            timestamp: block.timestamp
        });
        
        usedDocumentHashes[documentHash] = true;
        
        emit KYCSubmitted(msg.sender, documentHash);
    }
    
    /**
     * @dev Verifies a user's KYC document
     * @param user The address of the user
     * @param status The verification status (true = verified, false = rejected)
     */
    function verifyKYC(address user, bool status) public {
        require(bytes(kycDocuments[user].documentHash).length > 0, "No KYC document found for user");
        
        kycDocuments[user].isVerified = status;
        
        emit KYCVerified(user, status);
    }
    
    /**
     * @dev Checks if a user's KYC is verified
     * @param user The address of the user
     * @return The verification status
     */
    function getKYCStatus(address user) public view returns (bool) {
        return kycDocuments[user].isVerified;
    }
    
    /**
     * @dev Gets the document hash for a user
     * @param user The address of the user
     * @return The document hash
     */
    function getDocumentHash(address user) public view returns (string memory) {
        return kycDocuments[user].documentHash;
    }
    
    /**
     * @dev Checks if a document hash has been used
     * @param documentHash The hash to check
     * @return Whether the hash is already used
     */
    function isDocumentHashUsed(string memory documentHash) public view returns (bool) {
        return usedDocumentHashes[documentHash];
    }
    
    /**
     * @dev Checks if a user has submitted KYC documents
     * @param user The address of the user
     * @return Whether the user has submitted documents
     */
    function isKYCSubmitted(address user) public view returns (bool) {
        return bytes(kycDocuments[user].documentHash).length > 0;
    }
    
    /**
     * @dev For compatibility with your frontend - same as getKYCStatus
     */
    function isKYCVerified(address user) public view returns (bool) {
        return getKYCStatus(user);
    }
}

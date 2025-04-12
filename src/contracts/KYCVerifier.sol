
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYCVerifier {
    // Mapping to store KYC status for each user
    mapping(address => bool) private kycStatus;
    
    // Mapping to store document hashes for each user
    mapping(address => string) private documentHashes;
    
    // Mapping to store verifier addresses for each user
    mapping(address => address) private verifiers;
    
    // Mapping to store verification timestamps
    mapping(address => uint256) private verificationTimestamps;
    
    // Mapping to track document hash uniqueness
    mapping(string => bool) private usedDocumentHashes;
    
    // Struct to store document details
    struct DocumentInfo {
        string documentHash;
        string documentType;
        uint256 submittedAt;
        bool verified;
    }
    
    // Mapping to store document details for each user
    mapping(address => DocumentInfo[]) private userDocuments;
    
    // Event emitted when a user submits KYC documents
    event KYCSubmitted(address indexed user, string documentHash, string documentType);
    
    // Event emitted when a user's KYC status is verified
    event KYCVerified(address indexed user, bool status, address verifier);
    
    // Event emitted when a document is rejected
    event DocumentRejected(address indexed user, string documentHash, address verifier, string reason);
    
    /**
     * @dev Submit KYC documents by providing a document hash
     * @param documentHash The hash of the KYC document
     * @param documentType The type of the document (e.g., "passport", "id_card")
     */
    function submitKYC(string memory documentHash, string memory documentType) public {
        require(bytes(documentHash).length > 0, "Document hash cannot be empty");
        require(!usedDocumentHashes[documentHash], "This document hash has already been used");
        
        documentHashes[msg.sender] = documentHash;
        usedDocumentHashes[documentHash] = true;
        
        // Add to user's documents array
        userDocuments[msg.sender].push(
            DocumentInfo({
                documentHash: documentHash,
                documentType: documentType,
                submittedAt: block.timestamp,
                verified: false
            })
        );
        
        emit KYCSubmitted(msg.sender, documentHash, documentType);
    }
    
    /**
     * @dev Submit KYC documents by providing only a document hash (for backward compatibility)
     * @param documentHash The hash of the KYC document
     */
    function submitKYC(string memory documentHash) public {
        submitKYC(documentHash, "unspecified");
    }
    
    /**
     * @dev Verify KYC status for a user (only callable by admin)
     * @param user The address of the user to verify
     * @param status The verification status (true for approved, false for rejected)
     */
    function verifyKYC(address user, bool status) public {
        // In a production environment, add access control here
        kycStatus[user] = status;
        verifiers[user] = msg.sender;
        verificationTimestamps[user] = block.timestamp;
        
        // Update the most recent document's verification status
        if (userDocuments[user].length > 0) {
            uint256 lastIndex = userDocuments[user].length - 1;
            DocumentInfo storage lastDoc = userDocuments[user][lastIndex];
            lastDoc.verified = status;
        }
        
        emit KYCVerified(user, status, msg.sender);
    }
    
    /**
     * @dev Reject a user's document with a reason
     * @param user The address of the user
     * @param documentHash The hash of the document being rejected
     * @param reason The reason for rejection
     */
    function rejectDocument(address user, string memory documentHash, string memory reason) public {
        // In a production environment, add access control here
        kycStatus[user] = false;
        verifiers[user] = msg.sender;
        verificationTimestamps[user] = block.timestamp;
        
        // Find and update the document's verification status
        for (uint i = 0; i < userDocuments[user].length; i++) {
            if (keccak256(bytes(userDocuments[user][i].documentHash)) == keccak256(bytes(documentHash))) {
                userDocuments[user][i].verified = false;
                break;
            }
        }
        
        emit DocumentRejected(user, documentHash, msg.sender, reason);
        emit KYCVerified(user, false, msg.sender);
    }
    
    /**
     * @dev Get the KYC status for a specified user
     * @param user The address of the user to check
     * @return The KYC status of the user
     */
    function getKYCStatus(address user) public view returns (bool) {
        return kycStatus[user];
    }
    
    /**
     * @dev Get the document hash for a specified user
     * @param user The address of the user
     * @return The document hash of the user
     */
    function getDocumentHash(address user) public view returns (string memory) {
        return documentHashes[user];
    }
    
    /**
     * @dev Get the address of the verifier for a user
     * @param user The address of the user
     * @return The address of the verifier
     */
    function getVerifier(address user) public view returns (address) {
        return verifiers[user];
    }
    
    /**
     * @dev Get the verification timestamp for a user
     * @param user The address of the user
     * @return The timestamp when the user was verified
     */
    function getVerificationTimestamp(address user) public view returns (uint256) {
        return verificationTimestamps[user];
    }
    
    /**
     * @dev Check if a document hash has already been used
     * @param documentHash The document hash to check
     * @return True if the hash is already in use, false otherwise
     */
    function isDocumentHashUsed(string memory documentHash) public view returns (bool) {
        return usedDocumentHashes[documentHash];
    }
    
    /**
     * @dev Get the number of documents submitted by a user
     * @param user The address of the user
     * @return The number of documents submitted
     */
    function getUserDocumentCount(address user) public view returns (uint256) {
        return userDocuments[user].length;
    }
    
    /**
     * @dev Get details of a specific document submitted by a user
     * @param user The address of the user
     * @param index The index of the document to retrieve
     * @return documentHash The hash of the document
     * @return documentType The type of the document
     * @return submittedAt The timestamp when the document was submitted
     * @return verified Whether the document has been verified
     */
    function getUserDocument(address user, uint256 index) public view returns (
        string memory documentHash,
        string memory documentType,
        uint256 submittedAt,
        bool verified
    ) {
        require(index < userDocuments[user].length, "Document index out of bounds");
        DocumentInfo memory doc = userDocuments[user][index];
        return (doc.documentHash, doc.documentType, doc.submittedAt, doc.verified);
    }
}

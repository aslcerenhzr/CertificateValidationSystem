// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DigitalSignatureContract
 * @dev Manages simple digital signature storage/verification for certificates
 */
contract DigitalSignatureContract {
    
    // Mapping from doc/certificate hash to signer address
    mapping(bytes32 => address) public signatures;

    /**
     * @dev Stores a signature on-chain
     * @param documentHash The hash of the original document/certificate
     */
    function storeSignature(bytes32 documentHash) external {
        require(signatures[documentHash] == address(0), "Signature already stored");
        signatures[documentHash] = msg.sender;
    }

    /**
     * @dev Verifies if a document was signed by a specific address
     * @param documentHash The hash of the original document/certificate
     * @param signer The address that should have signed this document
     */
    function verifySignature(bytes32 documentHash, address signer) external view returns (bool) {
        return signatures[documentHash] == signer;
    }
}

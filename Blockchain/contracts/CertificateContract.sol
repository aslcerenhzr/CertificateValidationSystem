// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControlContract.sol";
import "./DigitalSignatureContract.sol";

/**
 * @title CertificateContract
 * @dev Manages the issuance and validation of certificates
 */
contract CertificateContract {
    struct Certificate {
        uint256 id;
        address student;
        string ipfsHash;    // If you're storing actual certificate file on IPFS
        address issuer;     // The address that issued this certificate
        uint256 issuedAt;
    }

    // Certificate storage
    uint256 private certificateCounter;
    mapping(uint256 => Certificate) public certificates;

    // Reference to other contracts
    AccessControlContract public accessControl;
    DigitalSignatureContract public digitalSignature;

    // Events
    event CertificateIssued(uint256 indexed certId, address indexed student, address indexed issuer);

    // Constructor
    constructor(address _accessControlAddress, address _digitalSignatureAddress) {
        accessControl = AccessControlContract(_accessControlAddress);
        digitalSignature = DigitalSignatureContract(_digitalSignatureAddress);
    }

    /**
     * @notice Issues a certificate to a student
     * @param student The student's address
     * @param ipfsHash The IPFS hash of the certificate file
     * @param docHash The hash of the underlying document (to store signature)
     */
    function issueCertificate(
        address student,
        string memory ipfsHash,
        bytes32 docHash
    ) external {
        // Check that caller has ISSUER_ROLE in the AccessControlContract
        require(accessControl.isIssuer(msg.sender), "Caller is not an issuer");

        // Increment the certificate counter
        certificateCounter++;

        // Store certificate details
        certificates[certificateCounter] = Certificate({
            id: certificateCounter,
            student: student,
            ipfsHash: ipfsHash,
            issuer: msg.sender,
            issuedAt: block.timestamp
        });

        // Optionally store digital signature on the docHash
        digitalSignature.storeSignature(docHash);

        // Emit event
        emit CertificateIssued(certificateCounter, student, msg.sender);
    }

    /**
     * @notice Verifies the certificate's digital signature
     * @param certId The certificate ID
     * @param docHash The hash of the underlying document
     * @return bool - true if the stored signature matches the certificate issuer
     */
    function verifyCertificateSignature(uint256 certId, bytes32 docHash) external view returns (bool) {
        Certificate storage cert = certificates[certId];
        return digitalSignature.verifySignature(docHash, cert.issuer);
    }

    // ERC165: supportsInterface implementation
    function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
        // This contract does not implement any ERC standards; return false
        return false;
    }

    // Dummy implementation for symbol()
    function symbol() external pure returns (string memory) {
        return "CERT";
    }

    // Dummy implementation for decimals()
    function decimals() external pure returns (uint8) {
        return 0;
    }

    // Fallback function to handle unrecognized calls
    fallback() external payable {
        // Log unrecognized calls for debugging (comment out for production)
        // console.log("Fallback called. msg.sig = %s", msg.sig);
    }

    // Receive function to accept Ether
    receive() external payable {}
}

// src/services/Web3Service.ts
import { ethers } from "ethers";
import AccessControlArtifact from "../../../Blockchain/artifacts/contracts/AccessControlContract.sol/AccessControlContract.json";
import CertificateArtifact from "../../../Blockchain/artifacts/contracts/CertificateContract.sol/CertificateContract.json";
import DigitalSignatureArtifact from "../../../Blockchain/artifacts/contracts/DigitalSignatureContract.sol/DigitalSignatureContract.json";

export class Web3Service {
  private provider: ethers.BrowserProvider | ethers.JsonRpcProvider;
  private signer: ethers.Signer;
  private accessControlAddress: string;
  private certificateAddress: string;
  private digitalSigAddress: string;
  private ISSUER_ROLE: string;

  constructor(
    provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
    signer: ethers.Signer
  ) {
    this.provider = provider;
    this.signer = signer;

    // Initialize contract addresses from environment variables
    this.accessControlAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    this.certificateAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    this.digitalSigAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // Compute the ISSUER_ROLE hash
    this.ISSUER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ISSUER_ROLE"));
  }

  // Initialize Contracts
  private getAccessControlContract() {
    return new ethers.Contract(
      this.accessControlAddress,
      AccessControlArtifact.abi,
      this.signer
    );
  }

  private getCertificateContract() {
    return new ethers.Contract(
      this.certificateAddress,
      CertificateArtifact.abi,
      this.signer
    );
  }

  private getDigitalSignatureContract() {
    return new ethers.Contract(
      this.digitalSigAddress,
      DigitalSignatureArtifact.abi,
      this.signer
    );
  }

  // Check if the current user is an issuer
  // Check if user is an issuer
  async isIssuer(address: string): Promise<boolean> {
    const accessControl = this.getAccessControlContract();
    if (!ethers.isAddress(address)) {
      throw new Error("Invalid address provided");
    }
    return accessControl.isIssuer(this.ISSUER_ROLE, address);
  }

  // Issue a certificate
  async issueCertificate(
    student: string,
    ipfsHash: string,
    docHash: string
  ): Promise<ethers.TransactionReceipt> {
    const certificate = this.getCertificateContract();
    const nonce = await this.signer.getNonce();
    const tx = await certificate.issueCertificate(student, ipfsHash, docHash, {
      nonce: 0, // Explicitly set the nonce
    });
    return tx.wait(); // Wait for transaction confirmation
  }

  // Verify a certificate's signature
  async verifyCertificateSignature(
    certId: number,
    docHash: string
  ): Promise<ethers.TransactionReceipt> {
    const certificate = this.getCertificateContract();
    const tx = await certificate.verifyCertificateSignature(certId, docHash);
    return tx.wait();
  }

  // Verify a signature by a specific address
  async verifySignature(
    docHash: string,
    address: string
  ): Promise<ethers.TransactionReceipt> {
    const digitalSig = this.getDigitalSignatureContract();
    const tx = await digitalSig.verifySignature(docHash, address);
    return tx.wait();
  }
}

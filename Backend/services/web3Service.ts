// src/services/web3Service.ts
import { ethers } from "ethers";
import AccessControlArtifact from "../../Blockchain/artifacts/contracts/AccessControlContract.sol/AccessControlContract.json";
import CertificateArtifact from "../../Blockchain/artifacts/contracts/CertificateContract.sol/CertificateContract.json";
import DigitalSignatureArtifact from "../../Blockchain/artifacts/contracts/DigitalSignatureContract.sol/DigitalSignatureContract.json";

export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private admin: ethers.Wallet;
  private ISSUER_ROLE: string;
  // Read addresses from env or fallback to placeholders
  private accessControlAddress =
    process.env.ACCESS_CONTROL_ADDRESS ||
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  private certificateAddress =
    process.env.CERTIFICATE_CONTRACT_ADDRESS ||
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  private digitalSigAddress =
    process.env.DIGITAL_SIGNATURE_ADDRESS ||
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  constructor() {
    // Connect to local or testnet
    const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Read private key from .env
    const privateKey =
      process.env.PRIVATE_KEY ||
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    this.admin = new ethers.Wallet(privateKey, this.provider);

    this.ISSUER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ISSUER_ROLE"));
  }

  getAccessControlContract() {
    return new ethers.Contract(
      this.accessControlAddress,
      AccessControlArtifact.abi,
      this.admin
    );
  }

  getCertificateContract() {
    return new ethers.Contract(
      this.certificateAddress,
      CertificateArtifact.abi,
      this.admin
    );
  }

  getDigitalSignatureContract() {
    return new ethers.Contract(
      this.digitalSigAddress,
      DigitalSignatureArtifact.abi,
      this.admin
    );
  }

  // Check if user is an issuer
  async isIssuer(address: string): Promise<boolean> {
    const accessControl = this.getAccessControlContract();
    if (!ethers.isAddress(address)) {
      throw new Error("Invalid address provided");
    }
    const tx = await accessControl.grantRole(this.ISSUER_ROLE, address);

    return tx.wait();

  }

  // // Call issueCertificate on the contract
  //   async issueCertificate(student: string, ipfsHash: string, docHash: string) {
  //     const certificate = this.getCertificateContract();
  //     const tx = await certificate.issueCertificate(student, ipfsHash, docHash);
  //     return tx.wait(); // wait for confirmation
  //   }

  // Grant issuer role on the blockchain
  async grantIssuerRole(account: string): Promise<ethers.ContractTransaction> {
    const accessControl = this.getAccessControlContract();
    if (!ethers.isAddress(account)) {
      throw new Error("Invalid address provided");
    }

    // Call grantRole with both the role identifier and the account address
    const tx = await accessControl.grantRole(this.ISSUER_ROLE, account);
    return tx.wait();
  }

  // Revoke issuer role on the blockchain
  async revokeIssuerRole(account: string): Promise<ethers.TransactionReceipt> {
    const accessControl = this.getAccessControlContract();
    if (!ethers.isAddress(account)) {
      throw new Error("Invalid address provided");
    }
    const tx = await accessControl.revokeRole(this.ISSUER_ROLE, account);
    return tx.wait();
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

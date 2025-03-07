"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Service = void 0;
// src/services/web3Service.ts
const ethers_1 = require("ethers");
const AccessControlContract_json_1 = __importDefault(require("../../Blockchain/artifacts/contracts/AccessControlContract.sol/AccessControlContract.json"));
const CertificateContract_json_1 = __importDefault(require("../../Blockchain/artifacts/contracts/CertificateContract.sol/CertificateContract.json"));
const DigitalSignatureContract_json_1 = __importDefault(require("../../Blockchain/artifacts/contracts/DigitalSignatureContract.sol/DigitalSignatureContract.json"));
class Web3Service {
    constructor() {
        // Read addresses from env or fallback to placeholders
        this.accessControlAddress = process.env.ACCESS_CONTROL_ADDRESS ||
            "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        this.certificateAddress = process.env.CERTIFICATE_CONTRACT_ADDRESS ||
            "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
        this.digitalSigAddress = process.env.DIGITAL_SIGNATURE_ADDRESS ||
            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
        // Connect to local or testnet
        const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
        this.provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
        // Read private key from .env
        const privateKey = process.env.PRIVATE_KEY ||
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        this.admin = new ethers_1.ethers.Wallet(privateKey, this.provider);
        this.ISSUER_ROLE = ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes("ISSUER_ROLE"));
    }
    getAccessControlContract() {
        return new ethers_1.ethers.Contract(this.accessControlAddress, AccessControlContract_json_1.default.abi, this.admin);
    }
    getCertificateContract() {
        return new ethers_1.ethers.Contract(this.certificateAddress, CertificateContract_json_1.default.abi, this.admin);
    }
    getDigitalSignatureContract() {
        return new ethers_1.ethers.Contract(this.digitalSigAddress, DigitalSignatureContract_json_1.default.abi, this.admin);
    }
    // Check if user is an issuer
    isIssuer(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessControl = this.getAccessControlContract();
            if (!ethers_1.ethers.isAddress(address)) {
                throw new Error("Invalid address provided");
            }
            const tx = yield accessControl.grantRole(this.ISSUER_ROLE, address);
            return tx.wait();
        });
    }
    // // Call issueCertificate on the contract
    //   async issueCertificate(student: string, ipfsHash: string, docHash: string) {
    //     const certificate = this.getCertificateContract();
    //     const tx = await certificate.issueCertificate(student, ipfsHash, docHash);
    //     return tx.wait(); // wait for confirmation
    //   }
    // Grant issuer role on the blockchain
    grantIssuerRole(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessControl = this.getAccessControlContract();
            if (!ethers_1.ethers.isAddress(account)) {
                throw new Error("Invalid address provided");
            }
            // Call grantRole with both the role identifier and the account address
            const tx = yield accessControl.grantRole(this.ISSUER_ROLE, account);
            return tx.wait();
        });
    }
    // Revoke issuer role on the blockchain
    revokeIssuerRole(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessControl = this.getAccessControlContract();
            if (!ethers_1.ethers.isAddress(account)) {
                throw new Error("Invalid address provided");
            }
            const tx = yield accessControl.revokeRole(this.ISSUER_ROLE, account);
            return tx.wait();
        });
    }
    // Verify a certificate's signature
    verifyCertificateSignature(certId, docHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificate = this.getCertificateContract();
            const tx = yield certificate.verifyCertificateSignature(certId, docHash);
            return tx.wait();
        });
    }
    // Verify a signature by a specific address
    verifySignature(docHash, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const digitalSig = this.getDigitalSignatureContract();
            const tx = yield digitalSig.verifySignature(docHash, address);
            return tx.wait();
        });
    }
}
exports.Web3Service = Web3Service;

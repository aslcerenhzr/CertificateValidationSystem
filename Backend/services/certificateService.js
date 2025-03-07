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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
// src/services/certificateService.ts
const database_1 = require("../config/database");
const Certificate_1 = require("../entities/Certificate");
const User_1 = require("../entities/User");
// Remove: import { IPFSService } from "./ipfsService";
const pinataService_1 = require("./pinataService");
const web3Service_1 = require("./web3Service");
class CertificateService {
    constructor() {
        this.certificateRepo = database_1.AppDataSource.getRepository(Certificate_1.Certificate);
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
        // Remove: private ipfsService = new IPFSService();
        this.web3Service = new web3Service_1.Web3Service();
    }
    uploadCertificate(studentAddress, issuerAddress, fileBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this.userRepository.findOne({ where: { publicAddress: studentAddress } });
            const issuer = yield this.userRepository.findOne({ where: { publicAddress: issuerAddress } });
            if (!student) {
                throw new Error("Student not found");
            }
            if (!issuer || issuer.role !== "issuer") {
                throw new Error("Issuer not found or does not have issuer role");
            }
            // 1) Upload file to Pinata
            const ipfsHash = yield pinataService_1.PinataService.pinFileBuffer(fileBuffer, "certificate.pdf");
            // 2) Create docHash (keccak256 of the file)
            const { keccak256 } = require("ethers");
            const docHash = keccak256(fileBuffer);
            // 3) Interact with the blockchain contract
            // 4) Save certificate metadata in DB
            const cert = this.certificateRepo.create({
                studentAddress,
                issuerAddress,
                ipfsHash, // from Pinata
                docHash,
                issuedAt: Date.now(),
            });
            return this.certificateRepo.save(cert);
        });
    }
    getCertificate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.certificateRepo.findOne({ where: { id } });
        });
    }
    verifyCertificateSignature(certId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cert = yield this.getCertificate(certId);
            if (!cert)
                throw new Error("Certificate not found");
            // call verifyCertificateSignature on chain
            const certificateContract = this.web3Service.getCertificateContract();
            const result = yield certificateContract.verifyCertificateSignature(certId, cert.docHash);
            return result;
        });
    }
    getCertificatesByStudent(studentAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.certificateRepo.find({ where: { studentAddress } });
        });
    }
}
exports.CertificateService = CertificateService;

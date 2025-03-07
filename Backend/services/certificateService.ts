// src/services/certificateService.ts
import { AppDataSource } from "../config/database";
import { Certificate } from "../entities/Certificate";
import { User } from "../entities/User";

// Remove: import { IPFSService } from "./ipfsService";
import { PinataService } from "./pinataService";
import { Web3Service } from "./web3Service";

export class CertificateService {

  private certificateRepo = AppDataSource.getRepository(Certificate);
  private userRepository = AppDataSource.getRepository(User);

  // Remove: private ipfsService = new IPFSService();
  private web3Service = new Web3Service();
  

  async uploadCertificate(
    studentAddress: string,
    issuerAddress: string,
    fileBuffer: Buffer
  ): Promise<Certificate> {

    const student = await this.userRepository.findOne({ where: { publicAddress: studentAddress } });
    const issuer = await this.userRepository.findOne({ where: { publicAddress: issuerAddress } });


    if (!student) {
      throw new Error("Student not found");
    }

    if (!issuer || issuer.role !== "issuer") {
      throw new Error("Issuer not found or does not have issuer role");
    }

    // 1) Upload file to Pinata
    const ipfsHash = await PinataService.pinFileBuffer(fileBuffer, "certificate.pdf");

    // 2) Create docHash (keccak256 of the file)
    const { keccak256 } = require("ethers");
    const docHash = keccak256(fileBuffer);

    // 3) Interact with the blockchain contract

    // 4) Save certificate metadata in DB
    const cert = this.certificateRepo.create({
      studentAddress,
      issuerAddress,
      ipfsHash,  // from Pinata
      docHash,
      issuedAt: Date.now(),
    });
    return this.certificateRepo.save(cert);
  }

  async getCertificate(id: number): Promise<Certificate | null> {
    return this.certificateRepo.findOne({ where: { id } });
  }

  async verifyCertificateSignature(certId: number): Promise<boolean> {
    const cert = await this.getCertificate(certId);
    if (!cert) throw new Error("Certificate not found");

    // call verifyCertificateSignature on chain
    const certificateContract = this.web3Service.getCertificateContract();
    const result = await certificateContract.verifyCertificateSignature(certId, cert.docHash);
    return result;
  }

  async getCertificatesByStudent(studentAddress: string): Promise<Certificate[]> {
    return this.certificateRepo.find({ where: { studentAddress } });
  }

}



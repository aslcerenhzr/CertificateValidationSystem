// src/controllers/certificateController.ts
import { Request, Response } from "express";
import { CertificateService } from "../services/certificateService";

const certificateService = new CertificateService();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadCertificate = async (req: MulterRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
       res.status(400).json({ error: "No certificate file uploaded" });
       return
    }

    const { studentAddress, issuerAddress } = req.body;
    if (!studentAddress || !issuerAddress) {
       res.status(400).json({ error: "studentAddress and issuerAddress are required" });
       return
    }

    const certificate = await certificateService.uploadCertificate(
      studentAddress,
      issuerAddress,
      file.buffer
    );
    res.status(201).json(certificate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCertificate = async (req: Request, res: Response) => {
  try {
    const certId = parseInt(req.params.id, 10);
    if (isNaN(certId)) {
       res.status(400).json({ error: "Invalid certificate ID" });
       return
    }

    const cert = await certificateService.getCertificate(certId);

    if (!cert) {
       res.status(404).json({ error: "Certificate not found" });
       return
    }

    res.json(cert);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifySignature = async (req: Request, res: Response) => {
  try {
    const certId = parseInt(req.params.id, 10);
    if (isNaN(certId)) {
       res.status(400).json({ error: "Invalid certificate ID" });
       return
    }

    const verified = await certificateService.verifyCertificateSignature(certId);
    res.json({ verified });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCertificatesByStudent = async (req: Request, res: Response) => {
  try {
    const studentAddress = req.params.studentAddress;
    if (!studentAddress) {
       res.status(400).json({ error: "studentAddress is required" });
       return
    }
    // if (requester.role === "student" && requester.email !== studentAddress) {
    //    res.status(403).json({ error: "Forbidden: Cannot access other students' certificates" });
    //    return
    // }

    const certificates = await certificateService.getCertificatesByStudent(studentAddress);
    res.json(certificates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

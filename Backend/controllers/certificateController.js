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
exports.getCertificatesByStudent = exports.verifySignature = exports.getCertificate = exports.uploadCertificate = void 0;
const certificateService_1 = require("../services/certificateService");
const certificateService = new certificateService_1.CertificateService();
const uploadCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: "No certificate file uploaded" });
            return;
        }
        const { studentAddress, issuerAddress } = req.body;
        if (!studentAddress || !issuerAddress) {
            res.status(400).json({ error: "studentAddress and issuerAddress are required" });
            return;
        }
        const certificate = yield certificateService.uploadCertificate(studentAddress, issuerAddress, file.buffer);
        res.status(201).json(certificate);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.uploadCertificate = uploadCertificate;
const getCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certId = parseInt(req.params.id, 10);
        if (isNaN(certId)) {
            res.status(400).json({ error: "Invalid certificate ID" });
            return;
        }
        const cert = yield certificateService.getCertificate(certId);
        if (!cert) {
            res.status(404).json({ error: "Certificate not found" });
            return;
        }
        res.json(cert);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCertificate = getCertificate;
const verifySignature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certId = parseInt(req.params.id, 10);
        if (isNaN(certId)) {
            res.status(400).json({ error: "Invalid certificate ID" });
            return;
        }
        const verified = yield certificateService.verifyCertificateSignature(certId);
        res.json({ verified });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.verifySignature = verifySignature;
const getCertificatesByStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentAddress = req.params.studentAddress;
        if (!studentAddress) {
            res.status(400).json({ error: "studentAddress is required" });
            return;
        }
        // if (requester.role === "student" && requester.email !== studentAddress) {
        //    res.status(403).json({ error: "Forbidden: Cannot access other students' certificates" });
        //    return
        // }
        const certificates = yield certificateService.getCertificatesByStudent(studentAddress);
        res.json(certificates);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCertificatesByStudent = getCertificatesByStudent;

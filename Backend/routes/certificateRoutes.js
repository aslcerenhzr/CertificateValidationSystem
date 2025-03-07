"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/certificateRoutes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const certificateController_1 = require("../controllers/certificateController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
// Issue a certificate - accessible by 'issuer' and 'admin'
router.post("/upload", authenticate_1.authenticate, (0, authorize_1.authorize)(["issuer", "admin"]), upload.single("certificateFile"), certificateController_1.uploadCertificate);
// Get a certificate by ID - accessible by 'issuer', 'admin', and 'student'
router.get("/:id", authenticate_1.authenticate, (0, authorize_1.authorize)(["issuer", "admin", "student"]), certificateController_1.getCertificate);
// Verify a certificate's signature - accessible by 'issuer', 'admin', and 'student'
router.get("/:id/verify", authenticate_1.authenticate, (0, authorize_1.authorize)(["issuer", "admin", "student"]), certificateController_1.verifySignature);
// Get all certificates for a student - accessible by 'student' and 'admin'
router.get("/student/:studentAddress", authenticate_1.authenticate, (0, authorize_1.authorize)(["student", "admin"]), certificateController_1.getCertificatesByStudent);
exports.default = router;

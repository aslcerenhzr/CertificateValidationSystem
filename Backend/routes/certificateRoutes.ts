// src/routes/certificateRoutes.ts
import { Router } from "express";
import multer from "multer";
import { getCertificate, verifySignature, getCertificatesByStudent, uploadCertificate } from "../controllers/certificateController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const router = Router();
const upload = multer();

// Issue a certificate - accessible by 'issuer' and 'admin'
router.post(
  "/upload",
  authenticate,
  authorize(["issuer", "admin"]),
  upload.single("certificateFile"),
  uploadCertificate
);

// Get a certificate by ID - accessible by 'issuer', 'admin', and 'student'
router.get(
  "/:id",
  authenticate,
  authorize(["issuer", "admin", "student"]),
  getCertificate
);

// Verify a certificate's signature - accessible by 'issuer', 'admin', and 'student'
router.get(
  "/:id/verify",
  authenticate,
  authorize(["issuer", "admin", "student"]),
  verifySignature
);

// Get all certificates for a student - accessible by 'student' and 'admin'
router.get(
  "/student/:studentAddress",
  authenticate,
  authorize(["student", "admin"]),
  getCertificatesByStudent
);

export default router;

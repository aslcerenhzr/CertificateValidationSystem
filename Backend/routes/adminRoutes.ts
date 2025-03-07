// src/routes/adminRoutes.ts
import { Router } from "express";
import { grantIssuerRole, revokeIssuerRole, checkIfIssuer } from "../controllers/adminController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const router = Router();

// All admin routes require authentication and admin role
router.post("/grant-issuer", authenticate, authorize(["admin"]), grantIssuerRole);
router.post("/revoke-issuer", authenticate, authorize(["admin"]), revokeIssuerRole);
router.get("/is-issuer/:account", authenticate, authorize(["admin"]), checkIfIssuer);

export default router;

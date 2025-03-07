// src/routes/userRoutes.ts
import { Router } from "express";
import { getUserProfile, makeUserIssuer } from "../controllers/userController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const router = Router();

// Get user profile - accessible by the user themselves and admins
router.get(
  "/:id",
  authenticate,
  authorize(["admin", "student", "issuer"]),
  getUserProfile
);

// Promote user to issuer - accessible by admin only
router.post(
  "/:id/make-issuer",
  authenticate,
  authorize(["admin"]),
  makeUserIssuer
);

export default router;

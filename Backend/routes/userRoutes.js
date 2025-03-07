"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
// Get user profile - accessible by the user themselves and admins
router.get("/:id", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin", "student", "issuer"]), userController_1.getUserProfile);
// Promote user to issuer - accessible by admin only
router.post("/:id/make-issuer", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), userController_1.makeUserIssuer);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/adminRoutes.ts
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
// All admin routes require authentication and admin role
router.post("/grant-issuer", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), adminController_1.grantIssuerRole);
router.post("/revoke-issuer", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), adminController_1.revokeIssuerRole);
router.get("/is-issuer/:account", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), adminController_1.checkIfIssuer);
exports.default = router;

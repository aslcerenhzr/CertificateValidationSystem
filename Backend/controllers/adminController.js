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
exports.checkIfIssuer = exports.revokeIssuerRole = exports.grantIssuerRole = void 0;
const adminService_1 = require("../services/adminService");
const adminService = new adminService_1.AdminService();
const grantIssuerRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account } = req.body;
        if (!account) {
            res.status(400).json({ error: "Account address is required" });
            return;
        }
        const updatedUser = yield adminService.grantIssuerRole(account);
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({ message: "Issuer role granted successfully", user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.grantIssuerRole = grantIssuerRole;
const revokeIssuerRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account } = req.body;
        if (!account) {
            res.status(400).json({ error: "Account address is required" });
            return;
        }
        const updatedUser = yield adminService.revokeIssuerRole(account);
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({ message: "Issuer role revoked successfully", user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.revokeIssuerRole = revokeIssuerRole;
const checkIfIssuer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account } = req.params;
        if (!account) {
            res.status(400).json({ error: "Account address is required" });
            return;
        }
        const isIssuer = yield adminService.isIssuer(account);
        res.json({ issuer: isIssuer });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.checkIfIssuer = checkIfIssuer;

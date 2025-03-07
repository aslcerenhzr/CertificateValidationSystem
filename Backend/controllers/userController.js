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
exports.getUserProfile = getUserProfile;
exports.makeUserIssuer = makeUserIssuer;
const userService_1 = require("../services/userService");
const userService = new userService_1.UserService();
function getUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                res.status(400).json({ error: "Invalid user ID" });
                return;
            }
            const user = yield userService.getUserById(userId);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.json({ id: user.id, email: user.email, role: user.role, publicAddress: user.publicAddress });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
function makeUserIssuer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                res.status(400).json({ error: "Invalid user ID" });
                return;
            }
            const updated = yield userService.setIssuerRole(userId);
            if (!updated) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.json({ message: "User role updated to issuer", user: updated });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}

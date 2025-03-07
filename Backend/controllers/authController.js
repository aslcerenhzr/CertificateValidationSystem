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
exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const jwtUtil_1 = require("../utils/jwtUtil");
const authService = new authService_1.AuthService();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, repeatedPassword, publicAddress } = req.body;
        if (password !== repeatedPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        const user = yield authService.register(email, password, publicAddress);
        const token = (0, jwtUtil_1.generateToken)({ id: user.id, email: user.email, role: user.role });
        return res.json({ user, token });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, publicAddress } = req.body;
        const { user, token } = yield authService.login(email, password, publicAddress);
        return res.json({ user, token });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.login = login;

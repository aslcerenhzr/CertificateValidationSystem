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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// src/services/authService.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const jwtUtil_1 = require("../utils/jwtUtil");
class AuthService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
    }
    register(email, password, publicAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user exists
            const existing = yield this.userRepository.findOne({ where: { email } });
            if (existing) {
                throw new Error("User already exists");
            }
            const exitsingAddress = yield this.userRepository.findOne({ where: { publicAddress } });
            if (exitsingAddress) {
                throw new Error("Public address already exists");
            }
            // Hash password
            const passwordHash = yield bcrypt_1.default.hash(password, 10);
            const newUser = this.userRepository.create({ email, passwordHash, publicAddress });
            yield this.userRepository.save(newUser);
            return newUser;
        });
    }
    login(email, password, publicAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new Error("Invalid email or password");
            }
            const match = yield bcrypt_1.default.compare(password, user.passwordHash);
            if (!match) {
                throw new Error("Invalid email or password");
            }
            const userPublicAddress = user.publicAddress;
            if (userPublicAddress !== publicAddress) {
                throw new Error("Invalid metamask account, use your metamask account please.");
            }
            // Generate JWT
            const token = (0, jwtUtil_1.generateToken)({ id: user.id, email: user.email, role: user.role });
            return { user, token };
        });
    }
}
exports.AuthService = AuthService;

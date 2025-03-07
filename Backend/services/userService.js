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
exports.UserService = void 0;
// src/services/userService.ts
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
class UserService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
    }
    /**
     * Retrieves a user by their ID.
     * @param id - The user's ID.
     * @returns The user or null if not found.
     */
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ where: { id } });
        });
    }
    /**
     * Sets a user's role to 'issuer'.
     * @param id - The user's ID.
     * @returns The updated user or null if not found.
     */
    setIssuerRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { id } });
            if (!user)
                return null;
            user.role = "issuer";
            return this.userRepository.save(user);
        });
    }
    /**
     * Sets a user's role to 'student'.
     * @param id - The user's ID.
     * @returns The updated user or null if not found.
     */
    setStudentRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { id } });
            if (!user)
                return null;
            user.role = "student";
            return this.userRepository.save(user);
        });
    }
}
exports.UserService = UserService;

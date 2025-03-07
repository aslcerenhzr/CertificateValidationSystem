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
exports.AdminService = void 0;
// src/services/adminService.ts
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const web3Service_1 = require("./web3Service");
class AdminService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
        this.web3Service = new web3Service_1.Web3Service();
    }
    /**
     * Grants the issuer role to a user based on their public address.
     * @param account - The user's public address.
     * @returns The updated user or null if not found.
     */
    grantIssuerRole(account) {
        return __awaiter(this, void 0, void 0, function* () {
            // Interact with blockchain to grant role
            try {
                const receipt = yield this.web3Service.grantIssuerRole(account);
                console.log("Issuer role granted on blockchain:", receipt.data);
            }
            catch (error) {
                throw new Error(`Blockchain Error: ${error.message}`);
            }
            // Update role in the database if necessary
            const user = yield this.userRepository.findOne({ where: { publicAddress: account } });
            if (!user)
                return null;
            user.role = "issuer";
            return this.userRepository.save(user);
        });
    }
    /**
     * Revokes the issuer role from a user based on their public address.
     * @param account - The user's public address.
     * @returns The updated user or null if not found.
     */
    revokeIssuerRole(account) {
        return __awaiter(this, void 0, void 0, function* () {
            // Interact with blockchain to revoke role
            try {
                const receipt = yield this.web3Service.revokeIssuerRole(account);
                console.log("Issuer role revoked on blockchain:", receipt.hash);
            }
            catch (error) {
                throw new Error(`Blockchain Error: ${error.message}`);
            }
            // Update role in the database if necessary
            const user = yield this.userRepository.findOne({ where: { publicAddress: account } });
            if (!user)
                return null;
            user.role = "student"; // Revert back to student role or another default role
            return this.userRepository.save(user);
        });
    }
    /**
     * Checks if a user has the issuer role based on their public address.
     * @param account - The user's public address.
     * @returns True if the user is an issuer, else false.
     */
    isIssuer(account) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check on the blockchain
            try {
                const issuer = yield this.web3Service.isIssuer(account);
                return issuer;
            }
            catch (error) {
                throw new Error(`Blockchain Error: ${error.message}`);
            }
        });
    }
}
exports.AdminService = AdminService;
// // src/services/adminService.ts
// import { AppDataSource } from "../config/database";
// import { User } from "../entities/User";
// export class AdminService {
//   private userRepository = AppDataSource.getRepository(User);
//   /**
//    * Grants the issuer role to a user based on their public address.
//    * @param account - The user's public address.
//    * @returns The updated user or null if not found.
//    */
//   async grantIssuerRole(account: string): Promise<User | null> {
//     const user = await this.userRepository.findOne({ where: { publicAddress: account } });
//     if (!user) return null;
//     user.role = "issuer";
//     return this.userRepository.save(user);
//   }
//   /**
//    * Revokes the issuer role from a user based on their public address.
//    * @param account - The user's public address.
//    * @returns The updated user or null if not found.
//    */
//   async revokeIssuerRole(account: string): Promise<User | null> {
//     const user = await this.userRepository.findOne({ where: { publicAddress: account } });
//     if (!user) return null;
//     user.role = "student"; // Revert back to student role or another default role
//     return this.userRepository.save(user);
//   }
//   /**
//    * Checks if a user has the issuer role based on their public address.
//    * @param account - The user's public address.
//    * @returns True if the user is an issuer, else false.
//    */
//   async isIssuer(account: string): Promise<boolean> {
//     const user = await this.userRepository.findOne({ where: { publicAddress: account } });
//     if (!user) return false;
//     return user.role === "issuer";
//   }
// }

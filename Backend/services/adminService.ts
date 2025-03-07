// src/services/adminService.ts
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Web3Service } from "./web3Service";

export class AdminService {
  private userRepository = AppDataSource.getRepository(User);
  private web3Service: Web3Service;

  constructor() {
    this.web3Service = new Web3Service();
  }

  /**
   * Grants the issuer role to a user based on their public address.
   * @param account - The user's public address.
   * @returns The updated user or null if not found.
   */
  async grantIssuerRole(account: string): Promise<User | null> {
    // Interact with blockchain to grant role
    try {
      const receipt = await this.web3Service.grantIssuerRole(account);
      console.log("Issuer role granted on blockchain:", receipt.data);
    } catch (error: any) {
      throw new Error(`Blockchain Error: ${error.message}`);
    }

    // Update role in the database if necessary
    const user = await this.userRepository.findOne({ where: { publicAddress: account } });
    if (!user) return null;

    user.role = "issuer";
    return this.userRepository.save(user);
  }

  /**
   * Revokes the issuer role from a user based on their public address.
   * @param account - The user's public address.
   * @returns The updated user or null if not found.
   */
  async revokeIssuerRole(account: string): Promise<User | null> {
    // Interact with blockchain to revoke role
    try {
      const receipt = await this.web3Service.revokeIssuerRole(account);
      console.log("Issuer role revoked on blockchain:", receipt.hash);
    } catch (error: any) {
      throw new Error(`Blockchain Error: ${error.message}`);
    }

    // Update role in the database if necessary
    const user = await this.userRepository.findOne({ where: { publicAddress: account } });
    if (!user) return null;

    user.role = "student"; // Revert back to student role or another default role
    return this.userRepository.save(user);
  }

  /**
   * Checks if a user has the issuer role based on their public address.
   * @param account - The user's public address.
   * @returns True if the user is an issuer, else false.
   */
  async isIssuer(account: string): Promise<boolean> {
    // Check on the blockchain
    try {
      const issuer = await this.web3Service.isIssuer(account);
      return issuer;
    } catch (error: any) {
      throw new Error(`Blockchain Error: ${error.message}`);
    }
  }
}



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

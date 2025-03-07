// src/services/authService.ts
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { generateToken } from "../utils/jwtUtil";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(email: string, password: string, publicAddress: string) {
    // Check if user exists
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new Error("User already exists");
    }

    const exitsingAddress = await this.userRepository.findOne({ where: { publicAddress } });
    if (exitsingAddress) {
      throw new Error("Public address already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ email, passwordHash, publicAddress });
    await this.userRepository.save(newUser);

    return newUser;
  }

  async login(email: string, password: string, publicAddress: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new Error("Invalid email or password");
    }

    const userPublicAddress = user.publicAddress;
    if (userPublicAddress !== publicAddress) {
      throw new Error("Invalid metamask account, use your metamask account please.");
    }

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user, token };
  }
}

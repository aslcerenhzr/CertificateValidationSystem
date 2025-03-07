// src/services/userService.ts
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

export class UserService {
  private readonly userRepository = AppDataSource.getRepository(User);

  /**
   * Retrieves a user by their ID.
   * @param id - The user's ID.
   * @returns The user or null if not found.
   */
  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Sets a user's role to 'issuer'.
   * @param id - The user's ID.
   * @returns The updated user or null if not found.
   */
  async setIssuerRole(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    user.role = "issuer";
    return this.userRepository.save(user);
  }

  /**
   * Sets a user's role to 'student'.
   * @param id - The user's ID.
   * @returns The updated user or null if not found.
   */
  async setStudentRole(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    user.role = "student";
    return this.userRepository.save(user);
  }
}

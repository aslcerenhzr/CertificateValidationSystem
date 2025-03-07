// src/controllers/authController.ts
import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { generateToken } from "../utils/jwtUtil";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, repeatedPassword, publicAddress } = req.body;
    if (password !== repeatedPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const user = await authService.register(email, password, publicAddress);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return res.json({ user, token });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, publicAddress } = req.body;
    const {user, token} = await authService.login(email, password, publicAddress);
    return res.json({ user, token });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

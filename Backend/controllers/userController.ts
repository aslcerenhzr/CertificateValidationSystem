// src/controllers/userController.ts
import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export async function getUserProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await userService.getUserById(userId);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ id: user.id, email: user.email, role: user.role, publicAddress: user.publicAddress });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function makeUserIssuer(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const updated = await userService.setIssuerRole(userId);
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ message: "User role updated to issuer", user: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

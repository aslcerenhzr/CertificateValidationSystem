// src/controllers/adminController.ts
import { Request, Response } from "express";
import { AdminService } from "../services/adminService";

const adminService = new AdminService();

export const grantIssuerRole = async (req: Request, res: Response) => {
  try {
    const { account } = req.body;
    if (!account) {
       res.status(400).json({ error: "Account address is required" });
       return
    }

    const updatedUser = await adminService.grantIssuerRole(account);
    if (!updatedUser) {
       res.status(404).json({ error: "User not found" });
       return
    }

    res.json({ message: "Issuer role granted successfully", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const revokeIssuerRole = async (req: Request, res: Response) => {
  try {
    const { account } = req.body;
    if (!account) {
       res.status(400).json({ error: "Account address is required" });
       return
    }

    const updatedUser = await adminService.revokeIssuerRole(account);
    if (!updatedUser) {
       res.status(404).json({ error: "User not found" });
       return
    }

    res.json({ message: "Issuer role revoked successfully", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const checkIfIssuer = async (req: Request, res: Response) => {
  try {
    const { account } = req.params;
    if (!account) {
       res.status(400).json({ error: "Account address is required" });
       return
    }

    const isIssuer = await adminService.isIssuer(account);
    res.json({ issuer: isIssuer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

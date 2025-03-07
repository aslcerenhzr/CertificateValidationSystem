// src/middleware/authorize.ts
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    if (!roles.includes(req.user.role)) {
        res.status(403).json({ error: "Forbidden: Insufficient rights" });
        return; 
    }

    next();
  };
}

// src/middleware/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
     res.status(401).json({ error: "No token provided" });
     return
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, 'asdsaddada213124') as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
     res.status(401).json({ error: "Invalid token" });
     return
  }
};

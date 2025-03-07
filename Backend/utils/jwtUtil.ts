// src/utils/jwtUtil.ts
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
}

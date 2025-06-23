import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_fallback"; 

interface DecodedToken {
  _id: string;
  role: "owner" | "user" | "admin";
  email: string;
  name?: string;
}

/**
 * Sign a new JWT token
 */
export function generateToken(payload: DecodedToken): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", 
  });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): DecodedToken {
  return jwt.verify(token, JWT_SECRET) as DecodedToken;
}

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (process.env.NODE_ENV === "production" && !JWT_SECRET) {
  throw new Error("❌ JWT_SECRET must be set in production environment");
}

interface DecodedToken {
  _id: string;
  role: "owner" | "user" | "admin";
  email: string;
  name?: string;
}

/**
 * Generate a JWT token for a given user payload
 */
export function generateToken(payload: DecodedToken): string {
  if (!JWT_SECRET) throw new Error("Missing JWT secret key");
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // 7 days token expiry
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): DecodedToken {
  if (!JWT_SECRET) throw new Error("Missing JWT secret key");

  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch  {
    throw new Error("Invalid or expired token");
  }
}

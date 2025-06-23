import { verify } from "jsonwebtoken";
import { parse } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || "");
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.split(" ")[1];
  const cookieToken = cookies.token;

  const token = headerToken || cookieToken;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    return res.status(200).json({ user: decoded });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

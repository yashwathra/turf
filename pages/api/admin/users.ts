import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  let decoded;
  try {
    decoded = verifyToken(token);
    if (decoded.role !== "admin") throw new Error();
  } catch {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "GET") {
    const users = await User.find({}, "-password");
    return res.status(200).json(users);
  }

  if (req.method === "PUT") {
    const { userId, active } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const user = await User.findByIdAndUpdate(userId, { active }, { new: true });
    return res.status(200).json(user);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

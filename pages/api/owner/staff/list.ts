import { connectDB } from "@/lib/db";
import Staff from "@/models/Staff";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface DecodedToken {
  _id: string;
  role: "owner" | "admin" | "user";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== "owner") {
      return res.status(403).json({ error: "Only owners can view staff" });
    }

    const staffs = await Staff.find({ ownerId: decoded._id }).select("-password");

    return res.status(200).json({ staffs });
  } catch (err) {
    console.error("❌ Staff List API Error:", err);
    return res.status(500).json({ error: "Failed to fetch staff" });
  }
}

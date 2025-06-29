import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (decoded.role !== "owner") {
      return res.status(403).json({ error: "Access denied. Only owners allowed." });
    }

    const turfs = await Turf.find({ ownerId: new mongoose.Types.ObjectId(decoded._id) });

    return res.status(200).json(turfs);
  } catch (error) {
    console.error("❌ Error fetching owner turfs:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

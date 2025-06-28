import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Turf from "@/models/Turf";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (decoded.role !== "owner") {
      return res.status(403).json({ error: "Access denied" });
    }

    const ownerId = new mongoose.Types.ObjectId(decoded._id);
    const turfs = await Turf.find({ ownerId });

    const activeTurfs = turfs.filter(t => t.isActive).length;

    const uniqueSports = new Set<string>();
    turfs.forEach(turf => {
      if (Array.isArray(turf.sports)) {
        turf.sports.forEach((sport: string) => uniqueSports.add(sport));
      }
    });

    return res.status(200).json({
      activeTurfs,
      totalTurfs: turfs.length,
      sports: uniqueSports.size,
    });
  } catch (error) {
    console.error("❌ Turf status API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

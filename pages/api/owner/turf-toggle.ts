import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface DecodedToken {
  _id: string;
  role: "owner" | "admin" | "user";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded || decoded.role !== "owner") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { turfId, isActive } = req.body;
    if (!turfId || typeof isActive !== "boolean") {
      return res.status(400).json({ error: "Missing turfId or isActive" });
    }

    const turf = await Turf.findOne({ _id: turfId, ownerId: decoded._id });
    if (!turf) return res.status(404).json({ error: "Turf not found" });

    turf.isActive = isActive;
    await turf.save();

    return res.status(200).json({
      message: `Turf successfully ${isActive ? "activated" : "deactivated"}`,
    });
  } catch (err) {
    console.error("Turf Status API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

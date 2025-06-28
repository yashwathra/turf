// File: pages/api/owner/sport-toggle.ts

import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Turf from "@/models/Turf";

// Define the type for a sport inside the Turf schema
type SportType = {
  name: string;
  ratePerHour: number;
  available: boolean;
};

// Request body type
interface SportToggleBody {
  turfId: string;
  sportName: string;
  available: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await connectDB();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const { turfId, sportName, available }: SportToggleBody = req.body;

  if (!turfId || !sportName || typeof available !== "boolean") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const turf = await Turf.findById(turfId);
  if (!turf) return res.status(404).json({ error: "Turf not found" });

  if (turf.ownerId.toString() !== decoded._id) {
    return res.status(403).json({ error: "Not your turf" });
  }

  // ✅ Use typed sport
  const sport = turf.sports.find(
    (s: SportType) => s.name === sportName
  );

  if (!sport) return res.status(404).json({ error: "Sport not found" });

  sport.available = available;
  await turf.save();

  return res.status(200).json({ message: "✅ Sport availability updated", sport });
}

// pages/api/owner/sport-toggle.ts

import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Turf from "@/models/Turf";

type SportType = {
  name: string;
  ratePerHour: number;
  available: boolean;
  startTime?: string;
  endTime?: string;
};

interface SportToggleBody {
  turfId: string;
  sportName: string;
  available: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch  {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const { turfId, sportName, available }: SportToggleBody = req.body;
  if (!turfId || !sportName || typeof available !== "boolean") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updatedTurf = await Turf.findOneAndUpdate(
      { _id: turfId, ownerId: decoded._id, "sports.name": sportName },
      {
        $set: {
          "sports.$.available": available,
        },
      },
      { new: true }
    );

    if (!updatedTurf) {
      return res.status(404).json({ error: "Turf or sport not found" });
    }

    return res.status(200).json({
      message: "Sport availability updated",
      sport: updatedTurf.sports.find((s: SportType) => s.name === sportName),
    });
  } catch (err) {
    console.error("Sport toggle error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

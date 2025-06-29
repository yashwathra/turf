// pages/api/owner/sport-time.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import { verifyToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verifyToken(token);
    if (decoded.role !== "owner") return res.status(403).json({ error: "Forbidden" });

    const { turfId, sportName, startTime, endTime } = req.body;
    if (!turfId || !sportName || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const updatedTurf = await Turf.findOneAndUpdate(
      { _id: turfId, "sports.name": sportName },
      {
        $set: {
          "sports.$.startTime": startTime,
          "sports.$.endTime": endTime,
        },
      },
      { new: true } // Return the updated doc
    );

    if (!updatedTurf) {
      return res.status(404).json({ error: "Turf or sport not found" });
    }

    res.status(200).json({ message: "Sport time updated successfully" });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

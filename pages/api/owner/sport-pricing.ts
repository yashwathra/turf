import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import { verifyToken } from "@/lib/auth";

interface PricingSlot {
  startTime: string;
  endTime: string;
  rate: number;
}

interface Sport {
  name: string;
  pricing: PricingSlot[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "owner") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { turfId, sportName, pricing } = req.body;

    if (!turfId || !sportName || !Array.isArray(pricing)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const turf = await Turf.findOne({ _id: turfId, ownerId: decoded._id });
    if (!turf) {
      return res.status(404).json({ error: "Turf not found" });
    }

    const slotDuration = 60;

    // ✅ Validate pricing with proper typing
    const isValid = pricing.every((p: PricingSlot) => {
      if (!p.startTime || !p.endTime || typeof p.rate !== "number") return false;

      const [sh, sm] = p.startTime.split(":").map(Number);
      const [eh, em] = p.endTime.split(":").map(Number);
      const diff = eh * 60 + em - (sh * 60 + sm);

      return diff === slotDuration;
    });

    if (!isValid) {
      return res.status(400).json({
        error: `Each pricing slot must be exactly ${slotDuration} minutes long.`,
      });
    }

    // ✅ Cast turf.sports so we can use typed access
    const sports = turf.sports as Sport[];
    const sport = sports.find((s) => s.name === sportName);

    if (!sport) {
      return res.status(404).json({ error: "Sport not found in turf" });
    }

    sport.pricing = pricing;
    await turf.save();

    return res.status(200).json({ message: "Pricing updated successfully" });
  } catch (err) {
    console.error("Sport pricing update error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

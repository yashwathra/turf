import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import { verifyToken } from "@/lib/auth";

interface SportInput {
  name: string;
  available?: boolean;
  startTime?: string;
  endTime?: string;
  pricing: { startTime: string; endTime: string; rate: number }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const id = req.query.id as string;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid turf ID" });
  }

  if (req.method === "GET") {
    try {
      const turf = await Turf.findById(id);
      if (!turf) return res.status(404).json({ error: "Turf not found" });

      // ✅ Use correct type for filtering sports
      const availableSports = turf.sports.filter(
        (s: { available?: boolean }) => s.available
      );

      return res.status(200).json({ ...turf.toObject(), sports: availableSports });
    } catch (err) {
      console.error("❌ Error fetching turf:", err);
      return res.status(500).json({ error: "Error fetching turf" });
    }
  }

  if (req.method === "PUT") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    let decoded: { _id: string };
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const turf = await Turf.findById(id);
    if (!turf) return res.status(404).json({ error: "Turf not found" });

    if (turf.ownerId.toString() !== decoded._id) {
      return res.status(403).json({ error: "Forbidden: You are not the owner of this turf" });
    }

    const {
      name,
      city,
      address,
      imageUrl,
      description,
      sports,
      amenities,
      slotDuration,
      isActive,
      openingTime,
      closingTime,
    } = req.body;

    const allowedSports = [
      "Football", "Cricket", "Tennis", "Badminton", "Volleyball", "Basketball",
      "Hockey", "Rugby", "Table Tennis", "Squash", "Baseball", "Golf",
      "Swimming", "Athletics", "Gymnastics", "Boxing", "Martial Arts",
      "Cycling", "Rowing", "Sailing"
    ];

    const validatedSports = (Array.isArray(sports) ? sports : [])
      .filter((sport: SportInput) =>
        allowedSports.includes(sport.name) &&
        Array.isArray(sport.pricing) &&
        sport.pricing.length > 0 &&
        sport.pricing.every(
          (p) =>
            typeof p.startTime === "string" &&
            typeof p.endTime === "string" &&
            typeof p.rate === "number" &&
            p.rate > 0
        )
      )
      .map((sport: SportInput) => ({
        name: sport.name,
        available: sport.available ?? true,
        startTime: sport.startTime || "06:00",
        endTime: sport.endTime || "22:00",
        pricing: sport.pricing,
      }));

    if (!name || !city || !address || !slotDuration || validatedSports.length === 0) {
      return res.status(400).json({
        error: "Missing required fields or no valid pricing slots",
      });
    }

    // ✅ Update turf fields safely
    turf.name = name;
    turf.city = city;
    turf.address = address;
    turf.imageUrl = imageUrl || turf.imageUrl;
    turf.description = description || turf.description;
    turf.sports = validatedSports;
    turf.amenities = Array.isArray(amenities) ? amenities : [];
    turf.slotDuration = slotDuration;
    turf.isActive = isActive !== false;
    turf.openingTime = openingTime || "06:00";
    turf.closingTime = closingTime || "22:00";

    await turf.save();
    return res.status(200).json({ message: "✅ Turf updated successfully", turf });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}

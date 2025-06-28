// File: pages/api/turf/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

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
      return res.status(200).json(turf);
    } catch {
      return res.status(500).json({ error: "Error fetching turf" });
    }
  }

  if (req.method === "PUT") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const turf = await Turf.findById(id);
    if (!turf) return res.status(404).json({ error: "Turf not found" });

    if (turf.ownerId.toString() !== decoded._id) {
      return res.status(403).json({ error: "Forbidden: You are not the owner" });
    }

    const {
      name,
      city,
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

    const validatedSports = (sports as { name: string; ratePerHour: number }[]).filter(
      (sport) =>
        allowedSports.includes(sport.name) &&
        typeof sport.ratePerHour === "number" &&
        sport.ratePerHour > 0
    );

    if (!name || !city || !slotDuration || validatedSports.length === 0) {
      return res.status(400).json({
        error: "Missing required fields or invalid sports format",
      });
    }

    turf.name = name;
    turf.city = city;
    turf.imageUrl = imageUrl;
    turf.description = description;
    turf.sports = validatedSports; // ✅ updated to object format
    turf.amenities = amenities;
    turf.slotDuration = slotDuration;
    turf.isActive = isActive !== false;
    turf.openingTime = openingTime || "06:00";
    turf.closingTime = closingTime || "22:00";

    await turf.save();
    return res.status(200).json({ message: "Turf updated successfully", turf });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}

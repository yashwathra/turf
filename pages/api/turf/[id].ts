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

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (req.method === "GET") {
    const turf = await Turf.findById(id);
    if (!turf) return res.status(404).json({ error: "Turf not found" });
    return res.status(200).json(turf);
  }

  if (req.method === "PUT") {
    const turf = await Turf.findById(id);
    if (!turf) return res.status(404).json({ error: "Turf not found" });

    if (turf.ownerId.toString() !== decoded._id) {
      return res.status(403).json({ error: "Forbidden: You are not the owner" });
    }

    const { name, location, imageUrl, description, sports, amenities, slotDuration } = req.body;

    turf.name = name;
    turf.location = location;
    turf.imageUrl = imageUrl;
    turf.description = description;
    turf.sports = sports;
    turf.amenities = amenities;
    turf.slotDuration = slotDuration;

    await turf.save();
    return res.status(200).json({ message: "Turf updated" });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}

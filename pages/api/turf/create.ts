import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import jwt from "jsonwebtoken";

interface DecodedToken {
  _id: string;
  role: "owner" | "user" | "admin";
  iat: number;
  exp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    if (!decoded || decoded.role !== "owner") {
      return res.status(403).json({ error: "Access denied: Not an owner" });
    }

    const {
      name,
      city,
      amenities = [],
      slotDuration,
      imageUrl,
      description,
      sports,
      isActive,
      openingTime,
      closingTime,
    } = req.body;

    const allowedSports = [
      "Football", "Cricket", "Tennis", "Badminton", "Volleyball", "Basketball", "Hockey",
      "Rugby", "Table Tennis", "Squash", "Baseball", "Golf", "Swimming", "Athletics",
      "Gymnastics", "Boxing", "Martial Arts", "Cycling", "Rowing", "Sailing"
    ];

    const filteredSports = (sports as string[]).filter((s) => allowedSports.includes(s));

    // Validate required fields
    if (!name || !city || !slotDuration || filteredSports.length === 0) {
      return res.status(400).json({
        error: "Please provide name, city, slotDuration and at least one valid sport",
      });
    }

    // ✅ Create new Turf with opening and closing time
    const turf = await Turf.create({
      name,
      city,
      sports: filteredSports,
      amenities,
      slotDuration,
      imageUrl: imageUrl || "/turf-image.jpg",
      description: description || "A premium turf for all your sports needs.",
      ownerId: decoded._id,
      isActive: isActive !== false,
      openingTime: openingTime || "06:00",
      closingTime: closingTime || "22:00",
    });

    return res.status(201).json({ message: "✅ Turf created successfully", turf });
  } catch (err) {
    console.error("Turf Creation Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

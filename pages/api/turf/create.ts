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
      city, // ✅ changed from location
      amenities = [],
      slotDuration,
      imageUrl,
      description,
      sports,
    } = req.body;

    if (!name || !city || !slotDuration || !Array.isArray(sports) || sports.length === 0) {
      return res.status(400).json({ error: "Please provide name, city, slotDuration and at least one sport" });
    }

    const turf = await Turf.create({
      name,
      city,
      sports,
      amenities,
      slotDuration,
      imageUrl: imageUrl || "/turf-image.jpg",
      description: description || "A premium turf for all your sports needs.",
      ownerId: decoded._id,
    });

    return res.status(201).json({ message: "✅ Turf created successfully", turf });
  } catch (err) {
    console.error("Turf Creation Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: "owner" | "user" | "admin";
  iat: number;
  exp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await connectDB();

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    if (!decoded || decoded.role !== "owner") {
      return res.status(403).json({ error: "Access denied: Not an owner" });
    }

    const { name, location, amenities, slotDuration, imageUrl, description, sports } = req.body;

    if (!name || !location || !slotDuration || !Array.isArray(sports)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const turf = await Turf.create({
      name,
      location,
      sports,
      amenities,
      slotDuration,
      imageUrl,
      description,
      ownerId: decoded.id,
    });

    return res.status(201).json({ message: "✅ Turf created successfully", turf });
  } catch (err) {
    console.error("Turf Creation Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

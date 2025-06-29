// File: pages/api/turf/byCity.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    // Check if method is GET
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Get and validate city from query
    const cityRaw = req.query.city;
    const city = typeof cityRaw === "string" ? cityRaw.trim() : "";

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    // Query turfs with case-insensitive match
    const turfs = await Turf.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
      isActive: true,
      sports: { $elemMatch: { available: true } },
    });

    return res.status(200).json({ turfs });
  } catch (err) {
    console.error("❌ Error fetching turfs by city:", err);
    return res.status(500).json({ error: "Failed to fetch turfs" });
  }
}

// File: pages/api/turf/byCity.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const city = req.query.city as string;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const turfs = await Turf.find({ city: city });
    res.status(200).json({ turfs });
  } catch (err) {
    console.error("Error fetching turfs by city:", err);
    res.status(500).json({ error: "Failed to fetch turfs" });
  }
}

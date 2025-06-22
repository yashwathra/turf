// pages/api/turf/public-list.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    const turfs = await Turf.find(); // top 6 for homepage
    res.status(200).json(turfs);
  } catch (err) {
    console.error("Error fetching public turfs:", err);
    res.status(500).json({ error: "Failed to fetch turfs" });
  }
}

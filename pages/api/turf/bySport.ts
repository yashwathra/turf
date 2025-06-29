import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { sport } = req.query;
  if (!sport || typeof sport !== "string") {
    return res.status(400).json({ error: "Sport is required" });
  }

  try {
    const turfs = await Turf.find({ "sports.name": sport });
    res.status(200).json({ turfs });
  } catch (err) {
    console.error("Error fetching turfs:", err);
    res.status(500).json({ error: "Failed to fetch turfs" });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from "@/lib/db";
import Turf from '@/models/Turf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== 'GET') return res.status(405).end("Method Not Allowed");

  try {
    const cities = await Turf.distinct("city");
    res.status(200).json({ cities });
  } catch {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
}

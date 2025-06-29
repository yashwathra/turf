// File: pages/api/turf/cities.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from "@/lib/db";
import Turf from '@/models/Turf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== 'GET') return res.status(405).end("Method Not Allowed");

  try {
    const cities = await Turf.aggregate([
      {
        $match: {
          isActive: true,
          sports: { $elemMatch: { available: true } },
        },
      },
      {
        $group: {
          _id: "$city",
        },
      },
      {
        $project: {
          _id: 0,
          city: "$_id",
        },
      },
    ]);

    const cityList = cities.map((c) => c.city);
    res.status(200).json({ cities: cityList });
  } catch (err) {
    console.error("City fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
}

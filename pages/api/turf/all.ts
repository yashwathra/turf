// File: pages/api/turf/all.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import jwt from "jsonwebtoken";

interface DecodedToken {
  _id: string;
  role: "user" | "owner" | "admin";
  iat: number;
  exp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    let role: "user" | "owner" | "admin" = "user"; // default to user

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        role = decoded.role;
      } catch  {
        console.warn("Token invalid or expired, treating as user");
      }
    }

    const turfs = role === "admin"
      ? await Turf.find() // Admin sees all
      : await Turf.find({ isActive: true }); // Others see only active

    res.status(200).json(turfs);
  } catch (err) {
    console.error("Error fetching turfs:", err);
    res.status(500).json({ error: "Failed to fetch turfs" });
  }
}

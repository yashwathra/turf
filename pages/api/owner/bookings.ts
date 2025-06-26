// pages/api/owner/bookings.ts
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import Booking from "@/models/Booking";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface DecodedToken {
  _id: string;
  role: "owner" | "user" | "admin";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await connectDB();

    // 🔐 Auth check
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded || decoded.role !== "owner") {
      return res.status(403).json({ error: "Access denied: Not an owner" });
    }

    // 📥 Get all turf IDs owned by this owner
    const turfs = await Turf.find({ ownerId: decoded._id });
    const turfIds = turfs.map((t) => t._id);

    // 📦 Fetch all bookings for these turfs
    const bookings = await Booking.find({ turfId: { $in: turfIds } })
      .populate("userId", "name email") // show user info
      .populate("turfId", "name city"); // show turf info

    res.status(200).json({ bookings });
  } catch (err) {
    console.error("❌ Owner Booking API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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

    // 📥 Get owner's turf IDs
    const turfs = await Turf.find({ ownerId: decoded._id });
    const turfIds = turfs.map((t) => t._id);

    // 📦 Get bookings for those turfs
    const bookings = await Booking.find({ turf: { $in: turfIds } });

    const total = bookings.length;

    // 🕒 Compare dates for status
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const completed = bookings.filter(b => b.date < today).length;
    const pending = bookings.filter(b => b.date >= today).length;

    const revenue = bookings
      .filter(b => b.date < today)
      .reduce((sum, b) => sum + b.price, 0);

    const profit = revenue * 0.6;
    const loss = revenue * 0.1;

    return res.status(200).json({
      total,
      completed,
      pending,
      cancelled: 0, // no cancellation logic yet
      revenue,
      profit,
      loss,
    });

  } catch (err) {
    console.error("❌ Owner Booking API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

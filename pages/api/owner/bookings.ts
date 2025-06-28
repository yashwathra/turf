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
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    // 🔐 Auth Check
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded || decoded.role !== "owner") {
      return res.status(403).json({ error: "Access denied: Not an owner" });
    }

    // 🏟️ Get All Turfs for Owner
    const turfs = await Turf.find({ ownerId: decoded._id });
    if (!turfs.length) {
      return res.status(200).json({
        total: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
        revenue: 0,
        profit: 0,
        loss: 0,
        bookings: [],
      });
    }

    const turfIds = turfs.map((t) => t._id);

    // 📅 Get All Bookings for These Turfs
    const bookings = await Booking.find({ turf: { $in: turfIds } })
      .populate("turf", "name")
      .populate("user", "name email");

    const today = new Date().toISOString().split("T")[0];

    const total = bookings.length;
    let completed = 0;
    let pending = 0;
    let cancelled = 0;
    let revenue = 0;

    bookings.forEach((b) => {
      const isPast = b.date < today;
      const isFuture = b.date >= today;

      if (b.status === "cancelled") {
        cancelled++;
      } else if (isPast && b.status === "completed") {
        completed++;
        revenue += b.price || 0;
      } else if (isFuture && b.status !== "cancelled") {
        pending++;
      }
    });

    const profit = revenue * 0.6;
    const loss = revenue * 0.1;

    return res.status(200).json({
      total,
      completed,
      pending,
      cancelled,
      revenue,
      profit,
      loss,
      bookings,
    });
  } catch (err) {
    console.error("❌ Owner Booking API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

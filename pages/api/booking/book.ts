// pages/api/booking/book.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  const { turfId, date, slot, price } = req.body;

  if (!turfId || !date || !slot || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // 🛑 Prevent double booking
  const alreadyBooked = await Booking.findOne({ turf: turfId, date, slot });
  if (alreadyBooked) {
    return res.status(409).json({ message: "Slot already booked" });
  }

  // ✅ Save booking
  const booking = await Booking.create({
    user: user._id,
    turf: turfId,
    date,
    slot,
    price,
  });

  return res.status(201).json({ message: "Booking confirmed", booking });
}

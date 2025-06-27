import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User"; // ✅ Add this
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

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { turfId, date, slot, price, sport } = req.body;

  if (!turfId || !date || !slot || !price || !sport) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const alreadyBooked = await Booking.findOne({ turf: turfId, date, slot });
  if (alreadyBooked) {
    return res.status(409).json({ message: "Slot already booked" });
  }

  const booking = await Booking.create({
    user: user._id,
    userName: user.name, // ✅ Now this works
    turf: turfId,
    date,
    slot,
    price,
    sport,
  });

  return res.status(201).json({ message: "Booking confirmed", booking });
}

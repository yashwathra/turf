import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Turf from "@/models/Turf";
import { verifyToken } from "@/lib/auth";

// ⏱️ Generate slot strings like "10:00 - 11:00"
function generateTimeSlots(start: string, end: string, duration: number): string[] {
  const slots: string[] = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startTime = new Date();
  startTime.setHours(startH, startM, 0, 0);
  const endTime = new Date();
  endTime.setHours(endH, endM, 0, 0);

  while (startTime < endTime) {
    const slotStart = startTime.toTimeString().slice(0, 5);
    startTime.setMinutes(startTime.getMinutes() + duration);
    const slotEnd = startTime.toTimeString().slice(0, 5);

    if (startTime <= endTime) {
      slots.push(`${slotStart} - ${slotEnd}`);
    }
  }

  return slots;
}

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

  // ✅ Get turf and validate the slot
  const turf = await Turf.findById(turfId);
  if (!turf) {
    return res.status(404).json({ message: "Turf not found" });
  }

  const availableSlots = generateTimeSlots(turf.openingTime, turf.closingTime, turf.slotDuration);
  if (!availableSlots.includes(slot)) {
    return res.status(400).json({ message: "Invalid slot for this turf's timing" });
  }

  // ✅ Check if slot is already booked
  const alreadyBooked = await Booking.findOne({ turf: turfId, date, slot, sport });

  if (alreadyBooked) {
    return res.status(409).json({ message: "Slot already booked" });
  }

  // ✅ Create booking
  const booking = await Booking.create({
    user: user._id,
    userName: user.name,
    turf: turfId,
    date,
    slot,
    price,
    sport,
  });

  return res.status(201).json({ message: "Booking confirmed", booking });
}

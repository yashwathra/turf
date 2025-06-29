import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Turf from "@/models/Turf";
import { verifyToken } from "@/lib/auth";

// 🧠 Helper: Make "HH:mm - HH:mm" time slots
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

  let decoded: { _id: string };
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  const user = await User.findById(decoded._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { turfId, date, slot, price, sport } = req.body;

  if (!turfId || !date || !slot || !price || !sport) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const turf = await Turf.findById(turfId);
  if (!turf) return res.status(404).json({ message: "Turf not found" });

  const validSlots = generateTimeSlots(
    turf.openingTime || "06:00",
    turf.closingTime || "22:00",
    turf.slotDuration || 60
  );

  if (!validSlots.includes(slot)) {
    return res.status(400).json({ message: "Invalid slot for this turf's timing" });
  }

  const alreadyBooked = await Booking.findOne({ turf: turfId, date, slot, sport });
  if (alreadyBooked) {
    return res.status(409).json({ message: "Slot already booked" });
  }

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

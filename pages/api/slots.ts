// File: pages/api/slots.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Turf from "@/models/Turf";

const formatTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

function generateTimeSlots(start: string, end: string, duration: number): string[] {
  const slots: string[] = [];

  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startTime = new Date();
  startTime.setHours(startH, startM, 0, 0);

  const endTime = new Date();
  endTime.setHours(endH, endM, 0, 0);

  while (startTime < endTime) {
    const slotStart = formatTime(startTime);
    startTime.setMinutes(startTime.getMinutes() + duration);
    const slotEnd = formatTime(startTime);

    if (startTime <= endTime) {
      slots.push(`${slotStart} - ${slotEnd}`);
    }
  }

  return slots;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  const { turfId, date, sport } = req.query;

  if (!turfId || !date || !sport) {
    return res.status(400).json({ error: "Missing turfId, date or sport" });
  }

  try {
    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ error: "Turf not found" });

    const allSlots = generateTimeSlots(
      turf.openingTime || "06:00",
      turf.closingTime || "22:00",
      turf.slotDuration || 60
    );

    const bookings = await Booking.find({ turf: turfId, date, sport });

    const bookedSlots = bookings.map((b) => b.slot.trim());

    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot.trim())
    );

    return res.status(200).json({ availableSlots, bookedSlots });
  } catch (err) {
    console.error("❌ Slot API Error:", err);
    return res.status(500).json({ error: "Failed to fetch slots" });
  }
}

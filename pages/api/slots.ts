// File: pages/api/slots.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Turf from "@/models/Turf";

// Define Sport type
interface Sport {
  name: string;
  available: boolean;
  startTime?: string;
  endTime?: string;
  pricing: { startTime: string; endTime: string; rate: number }[];
}

// Format time to "HH:mm"
function formatTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

// Generate time slots between start and end using given duration
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

  const turfId = Array.isArray(req.query.turfId) ? req.query.turfId[0] : req.query.turfId;
  const date = Array.isArray(req.query.date) ? req.query.date[0] : req.query.date;
  const sportName = Array.isArray(req.query.sport) ? req.query.sport[0] : req.query.sport;

  if (!turfId || !date || !sportName) {
    return res.status(400).json({ error: "Missing turfId, date or sport in query" });
  }

  try {
    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ error: "Turf not found" });

    const selectedSport = (turf.sports as Sport[]).find((s: Sport) => s.name === sportName);
    if (!selectedSport || !selectedSport.available) {
      return res.status(400).json({ error: "Sport not available for this turf" });
    }

    const openingTime = selectedSport.startTime || turf.openingTime || "06:00";
    const closingTime = selectedSport.endTime || turf.closingTime || "22:00";
    const slotDuration = turf.slotDuration || 60;

    const allSlots = generateTimeSlots(openingTime, closingTime, slotDuration);
    const bookings = await Booking.find({ turf: turfId, date, sport: sportName });
    const bookedSlots = bookings.map((b) => b.slot.trim());

    const availableSlots = allSlots
      .filter((slot) => !bookedSlots.includes(slot.trim()))
      .map((slot) => {
        const slotStart = slot.split(" - ")[0];
        const matchedPrice = selectedSport.pricing.find(
          (p) => slotStart >= p.startTime && slotStart < p.endTime
        );
        return {
          time: slot,
          price: matchedPrice?.rate ?? null,
        };
      });

    return res.status(200).json({ availableSlots, bookedSlots });
  } catch (err) {
    console.error("❌ Slot API Error:", err);
    return res.status(500).json({ error: "Failed to fetch slots" });
  }
}

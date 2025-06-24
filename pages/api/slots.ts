import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from "@/lib/db";
import Booking from '@/models/Booking';
import Turf from '@/models/Turf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== 'GET') return res.status(405).end("Method Not Allowed");

  const { turfId, date } = req.query;
  if (!turfId || !date) return res.status(400).json({ error: "Missing turfId or date" });

  try {
    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ error: "Turf not found" });

    const allSlots = [
      "6AM - 7AM", "7AM - 8AM", "8AM - 9AM", "9AM - 10AM",
      "10AM - 11AM", "11AM - 12PM", "4PM - 5PM", "5PM - 6PM",
      "6PM - 7PM", "7PM - 8PM"
    ];

    const bookings = await Booking.find({ turf: turfId, date });
    const bookedSlots = bookings.map(b => b.slot);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({ availableSlots, bookedSlots });
  } catch {
    res.status(500).json({ error: "Failed to fetch slots" });
  }
}

// pages/api/booking/slots.ts
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectDB();
    const { turfId, date } = req.query;

    if (!turfId || !date) return res.status(400).json({ message: "Missing turfId or date" });

    const bookings = await Booking.find({ turf: turfId, date });
    const bookedSlots = bookings.map((b) => b.slot);

    res.status(200).json({ bookedSlots });
  } catch (err) {
    console.error("Slots API Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

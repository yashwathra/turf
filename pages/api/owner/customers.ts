// File: ./pages/api/owner/customers.ts
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import Booking from "@/models/Booking";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface DecodedToken {
  _id: string;
  role: "owner" | "user" | "admin";
}

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded || decoded.role !== "owner") {
      return res.status(403).json({ error: "Access denied: Not an owner" });
    }

    // Get turfs owned by this owner
    const turfs = await Turf.find({ ownerId: decoded._id });
    const turfIds = turfs.map((t) => t._id);

    // Get bookings for these turfs
    const bookings = await Booking.find({ turf: { $in: turfIds } })
      .populate("user", "name email");

    // Extract unique customers
    const customersMap = new Map<string, { _id: string; name: string; email: string; bookingCount: number }>();

    bookings.forEach((b) => {
      const user = b.user as PopulatedUser;
      if (!customersMap.has(user._id.toString())) {
        customersMap.set(user._id.toString(), {
          _id: user._id,
          name: user.name,
          email: user.email,
          bookingCount: 1,
        });
      } else {
        const existing = customersMap.get(user._id.toString())!;
        existing.bookingCount += 1;
      }
    });

    const customers = Array.from(customersMap.values());

    return res.status(200).json({ customers });
  } catch (err) {
    console.error("❌ Customer API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

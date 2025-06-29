import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Turf from "@/models/Turf";
import jwt from "jsonwebtoken";

interface DecodedToken {
  _id: string;
  role: "owner" | "user" | "admin";
  iat: number;
  exp: number;
}

// 💡 Helper: Break pricing into 1-hour slots
function splitIntoOneHourSlots(
  start: string,
  end: string,
  rate: number
): { startTime: string; endTime: string; rate: number }[] {
  const result = [];

  // ✅ Changed from `let` to `const` as per linter suggestion
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const current = new Date();
  current.setHours(sh, sm, 0, 0);
  const endTime = new Date();
  endTime.setHours(eh, em, 0, 0);

  while (current < endTime) {
    const slotStart = current.toTimeString().slice(0, 5);
    current.setMinutes(current.getMinutes() + 60);
    const slotEnd = current.toTimeString().slice(0, 5);
    result.push({ startTime: slotStart, endTime: slotEnd, rate });
  }

  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    if (!decoded || decoded.role !== "owner") {
      return res.status(403).json({ error: "Access denied: Not an owner" });
    }

    const {
      name,
      city,
      address,
      amenities = [],
      slotDuration,
      imageUrl,
      description,
      sports,
      isActive,
      openingTime,
      closingTime,
    } = req.body;

    const allowedSports = [
      "Football", "Cricket", "Tennis", "Badminton", "Volleyball", "Basketball", "Hockey",
      "Rugby", "Table Tennis", "Squash", "Baseball", "Golf", "Swimming", "Athletics",
      "Gymnastics", "Boxing", "Martial Arts", "Cycling", "Rowing", "Sailing"
    ];

    // ✅ Validate and map each sport
    const validatedSports = (sports as {
      name: string;
      available?: boolean;
      startTime: string;
      endTime: string;
      pricing: { startTime: string; endTime: string; rate: number }[];
    }[])
      .filter((sport) =>
        allowedSports.includes(sport.name) &&
        typeof sport.startTime === "string" &&
        typeof sport.endTime === "string" &&
        Array.isArray(sport.pricing) &&
        sport.pricing.length > 0 &&
        sport.pricing.every(
          (slot) =>
            typeof slot.startTime === "string" &&
            typeof slot.endTime === "string" &&
            typeof slot.rate === "number" &&
            slot.rate > 0
        )
      )
      .map((sport) => ({
        name: sport.name,
        available: sport.available ?? true,
        startTime: sport.startTime,
        endTime: sport.endTime,
        pricing: sport.pricing.flatMap((slot) =>
          splitIntoOneHourSlots(slot.startTime, slot.endTime, slot.rate)
        ),
      }));

    if (!name || !city || !address || !slotDuration || validatedSports.length === 0) {
      return res.status(400).json({
        error: "Please provide name, city, address, slotDuration and at least one valid sport with pricing",
      });
    }

    const turf = await Turf.create({
      name,
      city,
      address,
      amenities,
      slotDuration,
      imageUrl: imageUrl || "/turf-image.jpg",
      description: description || "A premium turf for all your sports needs.",
      sports: validatedSports,
      ownerId: decoded._id,
      isActive: isActive !== false,
      openingTime: openingTime || "06:00",
      closingTime: closingTime || "22:00",
    });

    return res.status(201).json({ message: "✅ Turf created successfully", turf });
  } catch (err) {
    console.error("Turf Creation Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

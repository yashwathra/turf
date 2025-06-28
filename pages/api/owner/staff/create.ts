import Staff from "@/models/Staff";
import { connectDB } from "@/lib/db";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

interface DecodedToken {
  _id: string;
  role: "owner" | "user" | "admin";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== "owner") {
      return res.status(403).json({ error: "Only owners can add staff" });
    }

    const {
      name,
      email,
      phone,
      address = "",
      salary,
      role,
      shiftStart,
      shiftEnd,
      password,
      canAccessDashboard,
      permissions = [],
    } = req.body;

    const existing = await Staff.findOne({ email });
    if (existing) return res.status(400).json({ error: "Staff email already exists" });

    const hashedPassword = await hash(password, 10);

    const staff = await Staff.create({
      name,
      email,
      phone,
      address,
      salary,
      role,
      shiftStart,
      shiftEnd,
      canAccessDashboard,
      permissions,
      password: hashedPassword,
      ownerId: decoded._id,
    });

    return res.status(201).json({ staff });
  } catch (err) {
    console.error("❌ Staff creation error:", err);
    return res.status(500).json({ error: "Failed to create staff" });
  }
}

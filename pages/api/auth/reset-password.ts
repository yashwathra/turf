// /pages/api/auth/reset-password.ts

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { otpStore } from "./forgot-password"; // Import OTP memory

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { email, otp, password } = req.body;

  try {
    await connectDB();

    if (otpStore[email] !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    delete otpStore[email]; // clear OTP after success

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
}

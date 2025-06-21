
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

const otpStore: Record<string, string> = {}; // For demo only — use DB or Redis in real app

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { email } = req.body;

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    otpStore[email] = otp; // Store OTP temporarily

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,     // set in .env.local
        pass: process.env.EMAIL_PASS,     // set in .env.local (App Password)
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "GameZone Password Reset OTP",
      html: `<h3>Your OTP is:</h3><p style="font-size:20px;"><b>${otp}</b></p>`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

export { otpStore }; // Export it so reset-password can access

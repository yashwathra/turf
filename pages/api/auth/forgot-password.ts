
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
  from: `"GameZone ⚽" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "🔐 Reset Your GameZone Password",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 0; margin: 0; background: #f3f4f6;">
      <table style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <tr>
          <td style="background-color: #dc2626; color: white; text-align: center; padding: 20px 40px;">
            <h1 style="margin: 0; font-size: 24px;">🏟️ GameZone - Password Reset</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px 40px; color: #111827;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">
              You (or someone else) requested to reset your GameZone account password. Please use the OTP below to complete the process:
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background: #fef3c7; color: #b45309; padding: 10px 20px; border-radius: 8px; display: inline-block;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 15px; color: #374151;">
              This OTP is valid for a limited time. If you did not request a password reset, you can safely ignore this email.
            </p>
            <p style="margin-top: 30px;">Stay sporty,<br><b>GameZone Team</b></p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f9fafb; color: #6b7280; text-align: center; padding: 16px; font-size: 12px;">
            &copy; ${new Date().getFullYear()} GameZone. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
  `,
});


    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

export { otpStore }; // Export it so reset-password can access

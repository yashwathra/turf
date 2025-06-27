"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ OTP sent to your email! Please check your inbox.");
        toast.success("OTP sent! Please check your email.");
        setStep("reset");
      } else {
        setMessage("❌ " + data.error);
      }
    } 
    finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password: newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password reset successfully! Redirecting to login...");
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000); // 2 second delay
      } else {
        setMessage("❌ " + data.error);
        toast.error(data.error || "Failed to reset password.");
      }
    }  finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/bg-image.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl text-white">
        <h2 className="text-3xl font-bold text-center mb-4">
          {step === "email" ? "Forgot Password" : "Reset Password"}
        </h2>

        <form
          className="space-y-4"
          onSubmit={step === "email" ? handleSendOTP : handleResetPassword}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white/90 text-black"
            required
          />

          {step === "reset" && (
            <>
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/90 text-black"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/90 text-black"
                required
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-bold transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? step === "email"
                ? "Sending OTP..."
                : "Resetting..."
              : step === "email"
              ? "Send OTP"
              : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-yellow-200">{message}</p>
        )}
      </div>
    </section>
  );
}

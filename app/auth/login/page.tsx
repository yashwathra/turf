"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("❌ Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      alert("✅ Login successful!");
      window.location.href = "/"; 
    } catch (error) {
      alert("❌ " + (error instanceof Error ? error.message : "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/bg-image.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="relative z-10 max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-12 gap-12">
        <div className="lg:w-1/2 text-white text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight drop-shadow-md">
            Welcome Back, <span className="text-red-400">Player!</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium drop-shadow-md mb-6">
            Your Game. Your Rules. <br />
            All Sports One Place. <br />
            From Football to Snooker 🎱
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all">
            EXPLORE
          </button>
        </div>

        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <h2 className="text-3xl font-bold text-center text-white">Login</h2>

            <div>
              <label className="block mb-1 text-white font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/90 text-black placeholder-gray-600 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block mb-1 text-white font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/90 text-black placeholder-gray-600 outline-none"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-right text-sm text-white/80">
              <Link href="/auth/forgot-password">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <p className="text-center text-sm text-white">
              Dont have an account?{" "}
              <Link href="/auth/register" className="text-blue-300 underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

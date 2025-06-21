"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("❌ All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      alert("✅ Registered successfully!");
      router.push("/auth/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("❌ " + err.message);
      } else {
        alert("❌ Something went wrong.");
      }
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
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-md">
            Join the <span className="text-red-400">GameZone</span> Today!
          </h1>
          <p className="text-lg sm:text-xl font-medium mb-6 drop-shadow-md">
            Play, Book & Compete Anytime. <br />
            One Account. All Sports.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all">
            EXPLORE
          </button>
        </div>

        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleRegister}>
            <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>

            <div>
              <label className="block mb-1 text-white font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/90 text-black placeholder-gray-600 outline-none"
                placeholder="Enter your name"
              />
            </div>

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
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block mb-1 text-white font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/90 text-black placeholder-gray-600 outline-none"
                placeholder="Repeat password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>

            <p className="text-center text-sm text-white">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-300 underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

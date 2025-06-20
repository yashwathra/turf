"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/bg-image.jpg')" }}
    >
      {/* 🌑 Background Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

     

      {/* 🧾 Register Content */}
      <div className="relative z-10 max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-12 gap-12">
        {/* Left Panel Text */}
        <div className="lg:w-1/2 text-white text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-md">
            Join the <span className="text-red-400">GameZone</span> Today!
          </h1>
          <p className="text-lg sm:text-xl font-medium mb-6 drop-shadow-md">
            Play, Book & Compete – Anytime. <br />
            One Account. All Sports.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all">
            EXPLORE
          </button>
        </div>

        {/* Right Panel: Register Form */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>

            <div>
              <label className="block mb-1 text-white font-medium">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-md bg-white/90 text-black placeholder-gray-600 outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block mb-1 text-white font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-md bg-white/90 text-black placeholder-gray-600 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block mb-1 text-white font-medium">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-md bg-white/90 text-black placeholder-gray-600 outline-none"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block mb-1 text-white font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-md bg-white/90 text-black placeholder-gray-600 outline-none"
                placeholder="Repeat password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              REGISTER
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

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoginPage() {
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
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/bg-image.jpg')",
      }}
    >
      {/* 🏀 Floating Sports Balls */}
      <Image
  src="/footbal.jpg"
  alt="football"
  width={96} // equivalent to w-24 (24 x 4)
  height={96} // equivalent to h-24
  className="absolute top-[10%] left-[5%] transition-transform duration-500 ease-out shadow-lg shadow-black/30"
  style={{
    transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
  }}
/>
     

      {/* 🔒 Login Content (same as before) */}
      <div className="relative z-10 max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-10 py-10 gap-10">
        {/* Left side content */}
        <div className="lg:w-1/2 text-white text-center lg:text-left">
          <h1 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-md">
            Welcome Back,<br />
            <span className="text-white">Player!</span>
          </h1>
          <p className="text-lg font-medium drop-shadow-md">
            Your Game, Your Time <br />
            All Games, One Platform <br />
            From Football to Snooker
          </p>
          <button className="mt-6 bg-white text-red-600 px-6 py-2 rounded-full font-bold shadow-md hover:bg-red-100 transition">
            EXPLORE
          </button>
        </div>

        {/* Right: Login Card */}
        <div className="w-full max-w-md bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-8 text-black shadow-2xl">
          <form className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">Login</h2>
            <div>
              <label className="block font-semibold mb-1 text-white/90">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md bg-white/80 text-black placeholder-gray-600 outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-white/90">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-md bg-white/80 text-black placeholder-gray-600 outline-none"
                placeholder="Enter your password"
              />
            </div>
            <div className="text-right text-sm text-white/80">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
            >
              LOGIN
            </button>
            <p className="text-center text-sm text-white/90">
              Dont have an account?{" "}
              <Link href="/signup" className="text-blue-200 underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

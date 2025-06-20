"use client";

import Link from "next/link";


export default function LoginPage() {
  

 
   

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/bg-image.jpg')" }}
    >
      {/* 🔥 Overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* 🔐 Main Content */}
      <div className="relative z-10 max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-12 gap-12">
        {/* Left Panel */}
        <div className="lg:w-1/2 text-white text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight drop-shadow-md">
            Welcome Back, <span className="text-red-400">Player!</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium drop-shadow-md mb-6">
            Your Game. Your Rules. <br />
            All Sports  One Place. <br />
            From Football to Snooker 🎱
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all">
            EXPLORE
          </button>
        </div>

        {/* Right Panel – Login Card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">Login</h2>
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
                placeholder="Enter your password"
              />
            </div>
            <div className="text-right text-sm text-white/80">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              LOGIN
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

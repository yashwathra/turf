"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

type DecodedUser = {
  name?: string;
  email: string;
  role: string;
  exp: number;
};

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<DecodedUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 320);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      setUser(null);
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const navLinkClass = (path: string) =>
    `block pb-1 border-b-2 transition-all duration-300 ${
      pathname === path ? "border-white" : "border-transparent"
    }`;

  return (
    <nav
      className={`sticky top-4 z-50 max-w-5xl mx-auto px-6 py-4 
      flex items-center justify-between 
      rounded-full shadow-md border backdrop-blur-md transition-colors duration-300
      ${scrolled ? "bg-black/50 text-white border-white" : "bg-white/30 text-white border-white/40"}`}
    >
      
      <Link href="/"><div className="text-2xl font-bold">GreenPlay</div></Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex absolute inset-0 justify-center items-center pointer-events-none">
        <div className="flex space-x-6 font-medium items-center pointer-events-auto">
          <Link href="/" className={navLinkClass("/")}>HOME</Link>
          <Link href="/play" className={navLinkClass("/play")}>PLAY</Link>
          <Link href="/book" className={navLinkClass("/book")}>BOOK</Link>
          <Link href="/about" className={navLinkClass("/about")}>ABOUT</Link>

          {/* ADMIN Link */}
          {user?.role === "admin" && (
            <Link href="/dashboard/admin" className={navLinkClass("/dashboard/admin")}>ADMIN</Link>
          )}

          {/* USER Link */}
          {user?.role === "user" && (
            <Link href="/dashboard/user" className={navLinkClass("/dashboard/user")}>USER</Link>
          )}
        </div>
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center space-x-3">
        {user ? (
          <>
            <span className="text-sm font-bold text-white">👋 {user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-red-600 px-3 py-1 rounded-full shadow font-bold"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <Link href="/auth/login">
            <button className="bg-white px-4 py-1 text-red-600 rounded-full shadow font-bold ml-4">
              LOGIN
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="absolute top-[70px] left-4 right-4 bg-black/80 text-white rounded-xl p-6 flex flex-col space-y-4 md:hidden">
          <Link href="/" onClick={() => setMobileOpen(false)} className={navLinkClass("/")}>HOME</Link>
          <Link href="/play" onClick={() => setMobileOpen(false)} className={navLinkClass("/play")}>PLAY</Link>
          <Link href="/book" onClick={() => setMobileOpen(false)} className={navLinkClass("/book")}>BOOK</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className={navLinkClass("/about")}>ABOUT</Link>

          {user?.role === "admin" && (
            <Link href="/dashboard/admin" onClick={() => setMobileOpen(false)} className={navLinkClass("/dashboard/admin")}>
              ADMIN
            </Link>
          )}

          {user?.role === "user" && (
            <Link href="/dashboard/user" onClick={() => setMobileOpen(false)} className={navLinkClass("/dashboard/user")}>
              USER
            </Link>
          )}

          {user ? (
            <>
              <span className="text-center font-bold">👋 {user.name || user.email}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="bg-white px-4 py-2 text-red-600 rounded-full shadow font-bold w-full"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
              <button className="bg-white px-4 py-2 text-red-600 rounded-full shadow font-bold w-full">
                LOGIN
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

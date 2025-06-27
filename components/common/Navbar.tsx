"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

type DecodedUser = {
  name?: string;
  email: string;
  role: string;
  exp: number;
  avatarUrl?: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

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
      <Link href="/">
        <div className="text-2xl font-bold">GreenPlay</div>
      </Link>

      {/* Desktop Center Nav */}
      <div className="hidden md:flex absolute inset-0 justify-center items-center pointer-events-none">
        <div className="flex space-x-6 font-medium items-center pointer-events-auto">
          <Link href="/" className={navLinkClass("/")}>HOME</Link>
          <Link href="/play" className={navLinkClass("/play")}>PLAY</Link>
          <Link href="/book" className={navLinkClass("/book")}>BOOK</Link>
          <Link href="/about" className={navLinkClass("/about")}>ABOUT</Link>
        </div>
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center space-x-3 relative">
        {user ? (
          <div
            className="relative"
            onMouseEnter={() => {
              if (closeTimeout.current) clearTimeout(closeTimeout.current);
              setDropdownOpen(true);
            }}
            onMouseLeave={() => {
              closeTimeout.current = setTimeout(() => setDropdownOpen(false), 300);
            }}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-black">👤</div>
                )}
              </div>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-md w-40 z-50">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">👤 Profile</Link>
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">⚙️ Settings</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login">
            <button className="bg-white px-4 py-1 text-red-600 rounded-full shadow font-bold ml-4">
              LOGIN
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-[70px] left-4 right-4 bg-black/80 text-white rounded-xl p-6 flex flex-col space-y-4 md:hidden z-50">
          <Link href="/" onClick={() => setMobileOpen(false)} className={navLinkClass("/")}>HOME</Link>
          <Link href="/play" onClick={() => setMobileOpen(false)} className={navLinkClass("/play")}>PLAY</Link>
          <Link href="/book" onClick={() => setMobileOpen(false)} className={navLinkClass("/book")}>BOOK</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className={navLinkClass("/about")}>ABOUT</Link>

          {user && (
            <div className="flex flex-col items-center gap-2">
              {user.avatarUrl && (
                <Image
                  src={user.avatarUrl}
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border"
                />
              )}
              <span className="font-bold">👋 {user.name || user.email}</span>

              <button
                className="bg-white text-black rounded-full px-4 py-2 mt-2 shadow"
                onClick={() => setMobileDropdownOpen(!isMobileDropdownOpen)}
              >
                ☰ Menu
              </button>

              {isMobileDropdownOpen && (
                <div className="w-full text-center space-y-2 mt-3">
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="block hover:underline">👤 Profile</Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="block hover:underline">⚙️ Settings</Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="bg-red-500 text-white w-full py-2 rounded-full font-bold"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!user && (
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

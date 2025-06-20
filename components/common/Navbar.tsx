"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 320);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = (path: string) =>
    `pb-1 border-b-2 transition-all duration-300 ${
      pathname === path ? "border-white" : "border-transparent"
    }`;

  return (
    <nav
      className={`sticky top-4 z-50 flex justify-between items-center px-10 py-4 
      ${scrolled ? "bg-black/50" : "bg-white/30"} 
      backdrop-blur-md text-white 
      border border-white rounded-[50px] 
      max-w-5xl mx-auto shadow-md transition-colors duration-300`}
    >
      <div className="text-2xl font-bold">TURF</div>

      <div className="space-x-6 font-medium">
        <Link href="/" className={navLinkClass("/")}>HOME</Link>
        <Link href="/play" className={navLinkClass("/play")}>PLAY</Link>
        <Link href="/book" className={navLinkClass("/book")}>BOOK</Link>
        <Link href="/about" className={navLinkClass("/about")}>ABOUT</Link>
      </div>

      <Link href="/auth/login">
  <button className="bg-white px-4 py-1 text-red-600 rounded-full shadow-md font-bold">
    LOGIN
  </button>
</Link>

    </nav>
  );
}

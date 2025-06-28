"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { Menu, X } from "lucide-react";

const navItems = {
  user: [
    { name: "\ud83c\udfe0 My Bookings", href: "/dashboard/user/bookings" },
    { name: "\ud83d\udc64 Profile", href: "/profile" },
  ],
  owner: [
    { name: "My Turfs", href: "/dashboard/owner/turf" },
    { name: "Turf Bookings", href: "/dashboard/owner/bookings" },
    { name: "Add Turf", href: "/dashboard/owner/turf/create" },
    { name: "Staff", href: "/dashboard/owner/staff" },
    
  ],
  admin: [
    { name: "Users", href: "/dashboard/admin/users" },
    { name: "All Turfs", href: "/dashboard/admin/turfs" },
    { name: "Revenue", href: "/dashboard/admin/revenue" },
  ],
};

interface DecodedToken {
  role?: "admin" | "owner" | "user";
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "owner" | "user" | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const decoded = jwt.decode(token) as DecodedToken;
      setRole(decoded?.role || "user");
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  const links = role ? navItems[role] : [];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  if (!role) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0ff] via-[#f5f5f5] to-[#ce4747] p-4">
      {/* Top Navigation */}
    <header className="sticky top-4 z-50 backdrop-blur-xl bg-white/30 border border-white/20 shadow-lg rounded-3xl px-6 py-4 flex justify-between items-center mb-8">

        <h1 className="text-2xl font-bold text-gray-800">Turf Dashboard</h1>
        <div className="md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={28} className="text-gray-800" />
          </button>
        </div>
        <nav className="hidden md:flex gap-4">
          <Link
            href={`/dashboard/${role}`}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all backdrop-blur-md bg-white/40 hover:bg-white/70 ${
              pathname === `/dashboard/${role}` ? "text-blue-600 bg-white" : "text-gray-700"
            }`}
          >
            Home
          </Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all backdrop-blur-md bg-white/40 hover:bg-white/70 ${
                pathname === link.href ? "text-blue-600 bg-white" : "text-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-all bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white/80 backdrop-blur-xl text-gray-900 p-6 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={28} />
            </button>
          </div>
          <Link
            href={`/dashboard/${role}`}
            className={`block px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition ${
              pathname === `/dashboard/${role}` ? "bg-white text-blue-600 font-bold" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            \ud83c\udfe0 Dashboard Home
          </Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition ${
                pathname === link.href ? "bg-white text-blue-600 font-bold" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <button
          onClick={() => {
            setSidebarOpen(false);
            handleLogout();
          }}
          className="mt-6 w-full text-left px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
        >
          \ud83d\udeaa Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="mt-2 max-w-7xl mx-auto px-4">{children}</main>
    </div>
  );
}

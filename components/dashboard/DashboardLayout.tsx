"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { Menu, X } from "lucide-react";

const navItems = {
  user: [
    { name: "🏠 My Bookings", href: "/dashboard/user/bookings" },
    { name: "👤 Profile", href: "/profile" },
  ],
  owner: [
    { name: "🌿 My Turfs", href: "/dashboard/owner/turf" },
    { name: "📅 Turf Bookings", href: "/dashboard/owner/bookings" },
    { name: "➕ Add Turf", href: "/dashboard/owner/turf/create" },
  ],
  admin: [
    { name: "👥 Users", href: "/dashboard/admin/users" },
    { name: "🌍 All Turfs", href: "/dashboard/admin/turfs" },
    { name: "💰 Revenue", href: "/dashboard/admin/revenue" },
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
    <div className="flex flex-col md:flex-row min-h-screen relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-red-600 text-white px-4 py-3 shadow z-10">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-red-600 text-white p-6 shadow-md flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <Link
            href={`/dashboard/${role}`}
            className={`block px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition ${
              pathname === `/dashboard/${role}` ? "bg-white text-red-600 font-bold" : ""
            }`}
          >
            🏠 Dashboard Home
          </Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition ${
                pathname === link.href ? "bg-white text-red-600 font-bold" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full text-left px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 transition font-medium"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Sidebar (Mobile Drawer Right) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-red-600 text-white p-6 shadow-md z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={28} />
            </button>
          </div>
          <Link
            href={`/dashboard/${role}`}
            className={`block px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition ${
              pathname === `/dashboard/${role}` ? "bg-white text-red-600 font-bold" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            🏠 Dashboard Home
          </Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition ${
                pathname === link.href ? "bg-white text-red-600 font-bold" : ""
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
          className="mt-6 w-full text-left px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 transition font-medium"
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-6">{children}</main>
    </div>
  );
}

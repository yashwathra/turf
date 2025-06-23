"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

// Define role-based nav items
const navItems = {
  user: [
    { name: "🏠 My Bookings", href: "/dashboard/user/bookings" },
    { name: "👤 Profile", href: "/profile" },
  ],
  owner: [
    { name: "🌿 My Turfs", href: "/dashboard/owner/turfs" },
    { name: "📅 Turf Bookings", href: "/dashboard/owner/bookings" },
    { name: "➕ Add Turf", href: "/turf/create" },
  ],
  admin: [
    { name: "👥 Users", href: "/dashboard/admin/users" },
    { name: "🌍 All Turfs", href: "/dashboard/admin/turfs" },
    { name: "💰 Revenue", href: "/dashboard/admin/revenue" },
  ],
};

// ✅ Type for decoded JWT
interface DecodedToken {
  role?: "admin" | "owner" | "user";
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "owner" | "user" | null>(null);

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
  }, [router]); // ✅ Added router as dependency

  const links = role ? navItems[role] : [];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  if (!role) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-red-600 text-white p-6 shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

          {/* 🏠 Home Link */}
          <Link
            href={`/dashboard/${role}`}
            className={`block px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition ${
              pathname === `/dashboard/${role}` ? "bg-white text-red-600 font-bold" : ""
            }`}
          >
            🏠 Dashboard Home
          </Link>

          {/* 🔗 Dynamic Links */}
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

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full text-left px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 transition font-medium"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}

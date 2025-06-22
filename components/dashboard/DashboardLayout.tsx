"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  userRole: "admin" | "owner" | "user";
  children: ReactNode;
};

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

export default function DashboardLayout({ userRole, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const links = navItems[userRole] || [];

  const handleLogout = async () => {
    // 🧽 Clear cookie/session from server
    await fetch("/api/auth/logout", { method: "POST" }); // or GET if that’s what you use
    router.push("/auth/login"); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-red-600 text-white p-6 shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
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

        {/* 🚪 Logout Button */}
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

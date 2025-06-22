// app/dashboard/owner/page.tsx
"use client";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function OwnerDashboardPage() {
  return (
    <DashboardLayout userRole="owner">
      <h1 className="text-2xl font-bold mb-4">🌿 Turf Owner Dashboard</h1>
      <ul className="space-y-2 text-lg">
        <li>
          <Link href="/turf/create" className="text-blue-600 hover:underline">
             Add new turf
          </Link>
        </li>
        <li>📅 See all bookings</li>
        <li>🛠 Manage availability</li>
        <li>💬 Get customer feedback</li>
      </ul>
    </DashboardLayout>
  );
}

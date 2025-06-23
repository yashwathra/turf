"use client";

import Link from "next/link";


export default function OwnerDashboardPage() {
  

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">🌿 Owner Dashboard</h1>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link href="/dashboard/owner/turf/create">
          <div className="p-4 bg-white rounded shadow hover:shadow-md transition">
            <h2 className="font-semibold text-red-600">➕ Add Turf</h2>
            <p className="text-sm text-gray-600">Create new turf listing</p>
          </div>
        </Link>
        <Link href="/dashboard/owner/bookings">
          <div className="p-4 bg-white rounded shadow hover:shadow-md transition">
            <h2 className="font-semibold text-red-600">📅 Bookings</h2>
            <p className="text-sm text-gray-600">View turf bookings</p>
          </div>
        </Link>
        <Link href="/dashboard/owner/turf">
          <div className="p-4 bg-white rounded shadow hover:shadow-md transition">
            <h2 className="font-semibold text-red-600">🌱 Your Turfs</h2>
            <p className="text-sm text-gray-600">Manage your turf listings</p>
          </div>
        </Link>
        <div className="p-4 bg-gray-100 rounded shadow cursor-not-allowed opacity-60">
          <h2 className="font-semibold text-gray-400">🛠 Manage Availability</h2>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow cursor-not-allowed opacity-60">
          <h2 className="font-semibold text-gray-400">💬 Customer Feedback</h2>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>
      </div>
    </>
  );
}

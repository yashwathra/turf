"use client";

import Link from "next/link";

export default function OwnerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Owner Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Turf */}
        <Link href="/dashboard/owner/turf/create">
          <div className="bg-white/60 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all rounded-2xl p-6 cursor-pointer">
            <h2 className="text-lg font-semibold text-red-600 mb-1">Add Turf</h2>
            <p className="text-sm text-gray-700">Create new turf listing</p>
          </div>
        </Link>

        {/* Bookings */}
        <Link href="/dashboard/owner/bookings">
          <div className="bg-white/60 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all rounded-2xl p-6 cursor-pointer">
            <h2 className="text-lg font-semibold text-red-600 mb-1">Bookings</h2>
            <p className="text-sm text-gray-700">View turf bookings</p>
          </div>
        </Link>

        {/* Your Turfs */}
        <Link href="/dashboard/owner/turf">
          <div className="bg-white/60 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all rounded-2xl p-6 cursor-pointer">
            <h2 className="text-lg font-semibold text-red-600 mb-1">Turfs</h2>
            <p className="text-sm text-gray-700">Manage your turf listings</p>
          </div>
        </Link>

        {/* Manage Availability - Coming Soon */}
        <div className="bg-white/30 backdrop-blur-md shadow-md rounded-2xl p-6 opacity-60 cursor-not-allowed">
          <h2 className="text-lg font-semibold text-gray-500 mb-1">Manage Availability</h2>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>

        {/* Customer Feedback - Coming Soon */}
        <div className="bg-white/30 backdrop-blur-md shadow-md rounded-2xl p-6 opacity-60 cursor-not-allowed">
          <h2 className="text-lg font-semibold text-gray-500 mb-1">Customer Feedback</h2>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

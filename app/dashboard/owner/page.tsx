"use client";

import { useEffect, useState } from "react";

export default function OwnerDashboardPage() {
  const [data, setData] = useState({
    revenue: 0,
    profit: 0,
    loss: 0,
    bookings: 0,
    completed: 0,
    pending: 0,
    customers: 0,
    activeTurfs: 0,
    totalTurfs: 0,
    sports: 0,
    staff: 0,
    inventory: [],
    expenses: [],
  });

  useEffect(() => {
    const fetchBookingStats = async () => {
      try {
        const res = await fetch("/api/owner/bookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch booking stats");

        const stats = await res.json();

        setData((prev) => ({
          ...prev,
          bookings: stats.total,
          completed: stats.completed,
          pending: stats.pending,
          revenue: stats.revenue,
          profit: stats.profit,
          loss: stats.loss,
        }));
      } catch (err) {
        console.error("❌ Error fetching booking stats:", err);
      }
    };

    const fetchCustomerStats = async () => {
      try {
        const res = await fetch("/api/owner/customers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch customers");

        const { customers } = await res.json();

        setData((prev) => ({
          ...prev,
          customers: customers.length,
        }));
      } catch (err) {
        console.error("❌ Error fetching customer data:", err);
      }
    };

    const fetchTurfStats = async () => {
      try {
        const res = await fetch("/api/owner/turf-status", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch turf stats");

        const { activeTurfs, totalTurfs, sports } = await res.json();

        setData((prev) => ({
          ...prev,
          activeTurfs,
          totalTurfs,
          sports,
        }));
      } catch (err) {
        console.error("❌ Error fetching turf stats:", err);
      }
    };

    fetchBookingStats();
    fetchCustomerStats();
    fetchTurfStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Owner Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Revenue" value={`₹${data.revenue}`} color="green" />
        <StatCard title="Profit" value={`₹${data.profit}`} color="blue" />
        <StatCard title="Loss" value={`₹${data.loss}`} color="red" />
        <StatCard title="Total Bookings" value={data.bookings} color="yellow" />
      </div>

      {/* Booking Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Completed Bookings" value={data.completed} color="green" />
        <StatCard title="Pending Bookings" value={data.pending} color="orange" />
        <StatCard title="Customers" value={data.customers} color="purple" />
      </div>

      {/* Turf & Sports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Turfs" value={data.totalTurfs} color="gray" />
        <StatCard title="Active Turfs" value={data.activeTurfs} color="blue" />
        <StatCard title="Total Sports" value={data.sports} color="indigo" />
      </div>
    </div>
  );
}

// Tailwind-safe color class map
const colorMap = {
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orange: "bg-orange-100 text-orange-800",
  purple: "bg-purple-100 text-purple-800",
  gray: "bg-gray-100 text-gray-800",
  indigo: "bg-indigo-100 text-indigo-800",
};

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: keyof typeof colorMap;
}) {
  const colorClasses = colorMap[color] || "bg-gray-100 text-gray-800";

  return (
    <div className={`rounded-xl shadow p-6 ${colorClasses}`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
}

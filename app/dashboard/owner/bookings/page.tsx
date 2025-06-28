"use client";

import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  turf: { name: string };
  user: { name: string; email: string };
  date: string;
  slot: string;
  price: number;
  sport: string;
  status: "pending" | "completed" | "cancelled";
}

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/owner/bookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-5 animate-pulse space-y-3">
      <div className="h-6 bg-gray-300 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-5 bg-gray-300 rounded w-24 mt-2" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Your Turf Bookings</h1>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500 py-8 bg-white/50 rounded-2xl shadow-inner backdrop-blur-md">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-5 hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-semibold text-red-600 mb-2">{b.turf.name}</h2>
              <p className="text-gray-700">
                <strong>User:</strong> {b.user.name} ({b.user.email})
              </p>
              <p className="text-gray-700">
                <strong>Sport:</strong> {b.sport}
              </p>
              <p className="text-gray-700">
                <strong>Date:</strong> {b.date}
              </p>
              <p className="text-gray-700">
                <strong>Slot:</strong> {b.slot}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    b.status === "completed"
                      ? "text-green-600"
                      : b.status === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {b.status}
                </span>
              </p>
              <p className="text-green-700 font-bold mt-2">₹ {b.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

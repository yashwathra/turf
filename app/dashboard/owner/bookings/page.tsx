"use client";

import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  turf: { name: string };
  user: { name: string; email: string };
  date: string;
  slot: string;
  price: number;
}

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/owner/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) setBookings(data.bookings);
    };
    fetchBookings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Your Turf Bookings</h1>

      {bookings.length === 0 ? (
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
                <strong>Date:</strong> {b.date}
              </p>
              <p className="text-gray-700">
                <strong>Slot:</strong> {b.slot}
              </p>
              <p className="text-green-700 font-bold mt-2">
                ₹ {b.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

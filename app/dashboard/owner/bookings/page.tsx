"use client";

import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  turfId: { name: string };
  userId: { name: string; email: string };
  date: string;
  slot: string;
  amount: number;
}

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/booking/owner", {
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📋 Your Turf Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="border rounded p-3 shadow">
              <p><strong>Turf:</strong> {b.turfId.name}</p>
              <p><strong>User:</strong> {b.userId.name} ({b.userId.email})</p>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Slot:</strong> {b.slot}</p>
              <p><strong>Amount:</strong> ₹{b.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

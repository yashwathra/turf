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
  createdAt: string;
}

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("All");
  const [search, setSearch] = useState("");

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
    <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-inner p-5 animate-pulse space-y-3 border border-gray-300">
      <div className="h-6 bg-gray-300 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-5 bg-gray-300 rounded w-24 mt-2" />
    </div>
  );

  const filteredBookings = bookings
    .filter((b) => selectedSport === "All" || b.sport === selectedSport)
    .filter(
      (b) =>
        b.user.name.toLowerCase().includes(search.toLowerCase()) ||
        b.user.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const sportOptions = ["All", ...new Set(bookings.map((b) => b.sport))];

  return (
    <div className="px-2 sm:px-6 py-4">
      <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">📋 Turf Bookings</h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {sportOptions.map((sport) => (
              <button
                key={sport}
                className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
                  selectedSport === sport
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedSport(sport)}
              >
                {sport}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="🔍 Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-full sm:w-64"
          />
        </div>

        {/* Bookings */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white/50 rounded-2xl shadow-inner">
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-5 border border-gray-300 hover:shadow-2xl transition"
              >
                <h2 className="text-lg font-bold text-red-600 mb-1">{b.turf.name}</h2>
                <p className="text-sm text-gray-700">
                  <strong>User:</strong> {b.user.name} ({b.user.email})
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Sport:</strong> {b.sport}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Date:</strong> {b.date}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Slot:</strong> {b.slot}
                </p>
                <p className="text-sm text-gray-700">
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
                <p className="text-xs text-gray-500 mt-1">
                  Booked at: {new Date(b.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

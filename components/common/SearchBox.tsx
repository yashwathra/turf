"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import searchIcon from "@/public/search.svg";

interface Turf {
  _id: string;
  name: string;
  city: string;
  sports: string[];
  ratePerHour: number;
  imageUrl?: string;
  description?: string;
}

export default function SearchBox() {
  const [cities, setCities] = useState<string[]>([]);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [sports, setSports] = useState<string[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [showSlots, setShowSlots] = useState(false);

  useEffect(() => {
    fetch("/api/turf/cities")
      .then((res) => res.json())
      .then((data) => setCities(data.cities || []));
  }, []);

  useEffect(() => {
    if (!selectedCity) return;
    fetch(`/api/turf/byCity?city=${selectedCity}`)
      .then((res) => res.json())
      .then((data) => setTurfs(data.turfs || []));
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedTurf) return;

    fetch(`/api/turf/${selectedTurf._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSports(data.sports || []);
        setSelectedSport(data.sports?.[0] || "");
      });
  }, [selectedTurf]);

  const handleSearch = async () => {
    if (!selectedTurf || !selectedDate) return alert("Please fill all fields");

    const res = await fetch(
      `/api/slots?turfId=${selectedTurf._id}&date=${selectedDate}`
    );
    const data = await res.json();

    setAvailableSlots(data.availableSlots || []);
    setBookedSlots(data.bookedSlots || []);
    setShowSlots(true);
  };

  const handleBooking = async () => {
    if (!selectedTurf || !selectedSlot) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Please login to book a turf");
      window.location.href = "/auth/login";
      return;
    }

    try {
      const res = await fetch("/api/booking/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          turfId: selectedTurf._id,
          date: selectedDate,
          slot: selectedSlot,
          price: selectedTurf.ratePerHour,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Booking successful");
        setShowSlots(false);
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <section className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 z-20 w-full px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl mx-auto">
        {/* Step 1: Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedTurf(null);
              setShowSlots(false);
            }}
            className="border px-4 py-2 rounded-md"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedTurf?._id || ""}
            onChange={(e) => {
              const t = turfs.find((t) => t._id === e.target.value);
              setSelectedTurf(t || null);
              setShowSlots(false);
            }}
            className="border px-4 py-2 rounded-md"
          >
            <option value="">Select Turf</option>
            {turfs.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="">Select Sport</option>
            {sports.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />

          <button
            onClick={handleSearch}
            className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Image src={searchIcon} alt="Search" width={20} height={20} />
            Search
          </button>
        </div>

        {/* Step 2: Slot Display */}
        {showSlots && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">
              Available Slots for ₹{selectedTurf?.ratePerHour}
            </h2>
            <div className="flex flex-wrap gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-2 rounded-md border ${
                    selectedSlot === slot
                      ? "bg-red-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {slot}
                </button>
              ))}
              {bookedSlots.map((slot) => (
                <button
                  key={slot}
                  disabled
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-600 cursor-not-allowed"
                >
                  {slot} (Booked)
                </button>
              ))}
            </div>

            {selectedSlot && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-medium">
                  Total: ₹{selectedTurf?.ratePerHour}
                </span>
                <div className="flex gap-4">
                  <button
                    onClick={handleBooking}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => setShowSlots(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

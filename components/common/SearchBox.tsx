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
  const [loadingSlots, setLoadingSlots] = useState(false);

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

    setLoadingSlots(true);
    setShowSlots(false);
    const res = await fetch(
      `/api/slots?turfId=${selectedTurf._id}&date=${selectedDate}`
    );
    const data = await res.json();
    setAvailableSlots(data.availableSlots || []);
    setBookedSlots(data.bookedSlots || []);
    setShowSlots(true);
    setLoadingSlots(false);
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
    <section className="absolute top-[65%] left-1/2 transform -translate-x-1/2 z-20 w-full max-w-screen-xl px-2 sm:px-4">


  <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6 w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto">

    {/* 🔍 Search Filters */}
    <div className="flex flex-wrap gap-4 justify-center sm:justify-start mb-4">
  {/* City Select */}
  <div className="flex-1 min-w-[150px]">
    <select
      value={selectedCity}
      onChange={(e) => {
        setSelectedCity(e.target.value);
        setSelectedTurf(null);
        setShowSlots(false);
      }}
      className="w-full border px-4 py-2 rounded-md text-sm"
    >
      <option value="">Select City</option>
      {cities.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  </div>

  {/* Turf Select */}
  <div className="flex-1 min-w-[150px]">
    <select
      value={selectedTurf?._id || ""}
      onChange={(e) => {
        const t = turfs.find((t) => t._id === e.target.value);
        setSelectedTurf(t || null);
        setShowSlots(false);
      }}
      className="w-full border px-4 py-2 rounded-md text-sm"
    >
      <option value="">Select Turf</option>
      {turfs.map((t) => (
        <option key={t._id} value={t._id}>
          {t.name}
        </option>
      ))}
    </select>
  </div>

  {/* Sport Select */}
  <div className="flex-1 min-w-[150px]">
    <select
      value={selectedSport}
      onChange={(e) => setSelectedSport(e.target.value)}
      className="w-full border px-4 py-2 rounded-md text-sm"
    >
      <option value="">Select Sport</option>
      {sports.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  </div>

  {/* Date Picker */}
  <div className="flex-1 min-w-[150px]">
    <input
      type="date"
      min={new Date().toISOString().split("T")[0]}
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="w-full border px-4 py-2 rounded-md text-sm"
    />
  </div>

  {/* Search Button */}
  <div className="flex-1 min-w-[150px]">
    <button
  onClick={handleSearch}
  className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold px-6 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transition-all duration-300"
>
  <Image src={searchIcon} alt="Search" width={16} height={16} />
  Search
</button>
  </div>
</div>


    {/* ⏳ Slot Result */}
    <div className="mt-4 transition-all duration-300">
      {loadingSlots && (
        <div className="text-center text-gray-600 py-4 animate-pulse">
          Fetching available slots...
        </div>
      )}

      {showSlots && !loadingSlots && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center sm:text-left">
            Available Slots for ₹{selectedTurf?.ratePerHour}
          </h2>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
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
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
              <span className="text-lg font-medium">
                Total: ₹{selectedTurf?.ratePerHour}
              </span>
              <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
                <button
                  onClick={handleBooking}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full sm:w-auto"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => setShowSlots(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</section>

  );
}

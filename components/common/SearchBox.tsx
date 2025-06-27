"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import searchIcon from "@/public/search.svg";
import { toast } from "sonner";


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
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingTurfs, setLoadingTurfs] = useState(false);
  const [loadingSports, setLoadingSports] = useState(false);

  const isLoadingAll = loadingCities || loadingTurfs || loadingSports;

  // Load Cities
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch("/api/turf/cities");
        const data = await res.json();
        setCities(data.cities || []);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Load Turfs
  useEffect(() => {
    if (!selectedCity) return;
    const fetchTurfs = async () => {
      setLoadingTurfs(true);
      try {
        const res = await fetch(`/api/turf/byCity?city=${selectedCity}`);
        const data = await res.json();
        setTurfs(data.turfs || []);
      } catch (err) {
        console.error("Failed to fetch turfs:", err);
      } finally {
        setLoadingTurfs(false);
      }
    };
    fetchTurfs();
  }, [selectedCity]);

  // Load Sports
  useEffect(() => {
    if (!selectedTurf) return;
    const fetchSports = async () => {
      setLoadingSports(true);
      try {
        const res = await fetch(`/api/turf/${selectedTurf._id}`);
        const data = await res.json();
        setSports(data.sports || []);
        setSelectedSport(data.sports?.[0] || "");
      } catch (err) {
        console.error("Failed to fetch sports:", err);
      } finally {
        setLoadingSports(false);
      }
    };
    fetchSports();
  }, [selectedTurf]);

  // Search
  const handleSearch = async () => {
    if (!selectedCity || !selectedTurf || !selectedSport || !selectedDate) {
      toast.error("❌ Please select all fields.");
      return;
    }
    setLoadingSlots(true);
    setShowSlots(false);
    try {
      const res = await fetch(
        `/api/slots?turfId=${selectedTurf._id}&date=${selectedDate}`
      );
      const data = await res.json();
      setAvailableSlots(data.availableSlots || []);
      setBookedSlots(data.bookedSlots || []);
      setShowSlots(true);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Confirm Booking
  const handleBooking = async () => {
    const token = localStorage.getItem("token"); // or get from cookie

    if (!token) {
      toast.error("❌ Please log in to book a slot.");
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
          turfId: selectedTurf?._id,
          date: selectedDate,
          slot: selectedSlot,
          price: selectedTurf?.ratePerHour,
          sport: selectedSport,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(`❌ ${data.error || "Booking failed"}`);
        return;
      }

      toast.success("✅ Booking confirmed!");
      // Clear all selections
      setShowSlots(false);
      setSelectedSlot("");
      setSelectedTurf(null);
      setSelectedDate("");
      setSelectedSport("");
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("❌ An error occurred while booking. Please try again.");
    }
  };

  return (
    <section className="relative z-20 w-full max-w-screen-xl px-2 sm:px-4 mx-auto -mt-14 md:-mt-2 lg:-mt-24">
      <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6 w-full max-w-5xl mx-auto">

        {/* Filter Row */}
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start mb-4">
          {/* City Select */}
          <div className="flex-1 min-w-[150px]">
            {loadingCities ? (
              <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
            ) : (
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
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          {/* Turf Select */}
          <div className="flex-1 min-w-[150px]">
            {loadingTurfs ? (
              <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
            ) : (
              <select
                value={selectedTurf?._id || ""}
                onChange={(e) => {
                  const turf = turfs.find((t) => t._id === e.target.value);
                  setSelectedTurf(turf || null);
                  setShowSlots(false);
                }}
                className="w-full border px-4 py-2 rounded-md text-sm"
                disabled={!selectedCity}
              >
                <option value="">Select Turf</option>
                {turfs.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Sport Select */}
          <div className="flex-1 min-w-[150px]">
            {loadingSports ? (
              <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
            ) : (
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full border px-4 py-2 rounded-md text-sm"
                disabled={!selectedTurf}
              >
                <option value="">Select Sport</option>
                {sports.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>

          {/* Date Input */}
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
              disabled={isLoadingAll}
              className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold px-6 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <Image src={searchIcon} alt="Search" width={16} height={16} />
              Search
            </button>
          </div>
        </div>

        {/* Slot Results */}
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

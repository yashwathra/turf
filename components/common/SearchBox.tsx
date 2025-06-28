"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import searchIcon from "@/public/search.svg";
import { toast } from "sonner";

interface Turf {
  _id: string;
  name: string;
  city: string;
  sports: { name: string; ratePerHour: number }[];
  imageUrl?: string;
  description?: string;
}

interface Sport {
  name: string;
  ratePerHour: number;
}

export default function SearchBox() {
  const [cities, setCities] = useState<string[]>([]);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [showSlots, setShowSlots] = useState(false);

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingTurfs, setLoadingTurfs] = useState(false);
  const [loadingSports, setLoadingSports] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const isLoadingAll = loadingCities || loadingTurfs || loadingSports;

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/turf/cities");
        const data = await res.json();
        setCities(data.cities || []);
      } catch {
        toast.error("Failed to load cities.");
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (!selectedCity) return;
    const fetchTurfs = async () => {
      setLoadingTurfs(true);
      try {
        const res = await fetch(`/api/turf/byCity?city=${selectedCity}`);
        const data = await res.json();
        setTurfs(data.turfs || []);
      } catch {
        toast.error("Failed to load turfs.");
      } finally {
        setLoadingTurfs(false);
      }
    };
    fetchTurfs();
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedTurf) return;
    const fetchSports = async () => {
      setLoadingSports(true);
      try {
        const res = await fetch(`/api/turf/${selectedTurf._id}`);
        const data = await res.json();
        setSports(data.sports || []);
        setSelectedSport(data.sports?.[0] || null);
      } catch {
        toast.error("Failed to load sports.");
      } finally {
        setLoadingSports(false);
      }
    };
    fetchSports();
  }, [selectedTurf]);

  const handleSearch = async () => {
  if (!selectedCity || !selectedTurf || !selectedSport || !selectedDate) {
    toast.error("Please select all fields.");
    return;
  }

  setLoadingSlots(true);
  setShowSlots(false);

  try {
    const res = await fetch(
      `/api/slots?turfId=${selectedTurf._id}&date=${selectedDate}&sport=${selectedSport.name}`
    );
    const data = await res.json();

    let filtered = data.availableSlots || [];
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today) {
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();

      filtered = filtered.filter((slot: string) => {
        const [startTime] = slot.split(" - ");
        const [hourStr, minStr] = startTime.split(":");
        const mins = parseInt(hourStr) * 60 + parseInt(minStr);
        return mins > nowMins;
      });
    }

    setAvailableSlots(filtered);
    setBookedSlots(data.bookedSlots || []);
    setShowSlots(true);
  } catch {
    toast.error("Failed to fetch slots.");
  } finally {
    setLoadingSlots(false);
  }
};


  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to book a slot.");
      return setTimeout(() => (window.location.href = "/auth/login"), 1500);
    }

    setBookingLoading(true);
    try {
      const res = await fetch("/api/booking/crate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          turfId: selectedTurf?._id,
          date: selectedDate,
          slot: selectedSlot,
          price: selectedSport?.ratePerHour,
          sport: selectedSport?.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(`❌ ${data.error || "Booking failed"}`);

      toast.success("Booking confirmed!");
      setShowSlots(false);
      setSelectedSlot("");
      setSelectedTurf(null);
      setSelectedDate("");
      setSelectedSport(null);
    } catch {
      toast.error("Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="relative z-20 w-full max-w-screen-xl px-2 sm:px-4 mx-auto -mt-14 md:-mt-2 lg:-mt-24">
      <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6 w-full max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start mb-4">
          {/* City */}
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
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Turf */}
          <div className="flex-1 min-w-[150px]">
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
          </div>

          {/* Sport */}
          <div className="flex-1 min-w-[150px]">
            <select
              value={selectedSport?.name || ""}
              onChange={(e) => {
                const selected = sports.find((s) => s.name === e.target.value);
                setSelectedSport(selected || null);
                setShowSlots(false); // 👈 ADDED
              }}
              className="w-full border px-4 py-2 rounded-md text-sm"
              disabled={!selectedTurf}
            >
              <option value="">Select Sport</option>
              {sports.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} (₹{s.ratePerHour})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex-1 min-w-[150px]">
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setShowSlots(false); // 👈 ADDED
              }}
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

        {/* Slots Section */}
        <div className="mt-4 transition-all duration-300">
          {loadingSlots && (
            <div className="text-center text-gray-600 py-4 animate-pulse">
              Fetching available slots...
            </div>
          )}
          {showSlots && !loadingSlots && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center sm:text-left">
                Available Slots for ₹{selectedSport?.ratePerHour}
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
                    className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed"
                  >
                    {slot} (Booked)
                  </button>
                ))}
              </div>
              {selectedSlot && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                  <span className="text-lg font-medium">
                    Total: ₹{selectedSport?.ratePerHour}
                  </span>
                  <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
                    <button
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className={`px-6 py-2 rounded-lg w-full sm:w-auto transition ${
                        bookingLoading
                          ? "bg-green-400 text-white cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {bookingLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Booking...
                        </span>
                      ) : (
                        "Confirm Booking"
                      )}
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

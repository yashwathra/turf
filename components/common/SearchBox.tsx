"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import searchIcon from "@/public/search.svg";
import { toast } from "sonner";

interface PricingSlot {
  startTime: string;
  endTime: string;
  rate: number;
}
interface Sport {
  name: string;
  available: boolean;
  pricing: PricingSlot[];
}
interface Turf {
  _id: string;
  name: string;
  city: string;
  imageUrl?: string;
  description?: string;
  sports: Sport[];
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

  const [availableSlots, setAvailableSlots] = useState<{ time: string; price: number | null }[]>([]);
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
    setSelectedTurf(null);
    setSelectedSport(null);
    setShowSlots(false);
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
    setSelectedSport(null);
    setShowSlots(false);
    const fetchSports = async () => {
      setLoadingSports(true);
      try {
        const res = await fetch(`/api/turf/${selectedTurf._id}`);
        const data = await res.json();
        const active = (data.sports || []).filter((s: Sport) => s.available);
        setSports(active);
        setSelectedSport(active[0] || null);
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

      let filtered = (data.availableSlots || []) as { time: string; price: number | null }[];

      if (selectedDate === new Date().toISOString().split("T")[0]) {
        const now = new Date();
        const nowMins = now.getHours() * 60 + now.getMinutes();
        filtered = filtered.filter(({ time }) => {
          const [hour, min] = time.split(":").map(Number);
          return hour * 60 + min > nowMins;
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
      toast.error("Please log in first.");
      return setTimeout(() => (window.location.href = "/auth/login"), 1000);
    }

    const price = availableSlots.find((s) => s.time === selectedSlot)?.price ?? null;

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
          price,
          sport: selectedSport?.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Booking failed");

      toast.success("🎉 Booking confirmed!");
      setSelectedSlot("");
      setShowSlots(false);
    } catch {
      toast.error("Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="relative z-20 w-full max-w-screen-xl px-2 sm:px-4 mx-auto -mt-14 md:-mt-2 lg:-mt-24">
      <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6 w-full max-w-5xl mx-auto">

      {/* Select Boxes */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select className="w-full sm:w-auto flex-1 border px-3 py-2 rounded"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="w-full sm:w-auto flex-1 border px-3 py-2 rounded"
          value={selectedTurf?._id || ""}
          onChange={(e) => {
            const turf = turfs.find(t => t._id === e.target.value);
            setSelectedTurf(turf || null);
          }}
          disabled={!selectedCity}
        >
          <option value="">Select Turf</option>
          {turfs.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>

        <select className="w-full sm:w-auto flex-1 border px-3 py-2 rounded"
          value={selectedSport?.name || ""}
          onChange={(e) => {
            const sport = sports.find(s => s.name === e.target.value);
            setSelectedSport(sport || null);
            setSelectedSlot("");
          }}
          disabled={!selectedTurf || sports.length === 0}
        >
          <option value="">Select Sport</option>
          {sports.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name} ({s.pricing.length} slots)
            </option>
          ))}
        </select>

        <input type="date" value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full sm:w-auto flex-1 border px-3 py-2 rounded"
        />

        <button onClick={handleSearch} disabled={isLoadingAll}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded transition"
        >
          <Image src={searchIcon} alt="Search" width={16} height={16} className="inline mr-2" />
          Search
        </button>
      </div>

      {/* Slots Section */}
      {loadingSlots && <p className="text-center text-gray-500">Loading slots...</p>}

      {showSlots && !loadingSlots && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Available Slots:</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableSlots.map(({ time, price }) => (
              <button key={time}
                onClick={() => setSelectedSlot(time)}
                className={`px-4 py-2 rounded border ${
                  selectedSlot === time ? "bg-red-600 text-white" : "bg-white hover:bg-gray-100"
                }`}
              >
                {time} - ₹{price ?? "-"}
              </button>
            ))}
            {bookedSlots.map((time) => (
              <button key={time} disabled className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed">
                {time} (Booked)
              </button>
            ))}
          </div>

          {selectedSlot && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-lg font-medium">
                Total: ₹{availableSlots.find((s) => s.time === selectedSlot)?.price ?? "-"}
              </p>
              <div className="flex gap-3">
                <button onClick={handleBooking} disabled={bookingLoading}
                  className={`px-5 py-2 rounded ${
                    bookingLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                  } text-white transition`}
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
                <button onClick={() => setShowSlots(false)} className="bg-gray-400 text-white px-5 py-2 rounded">
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

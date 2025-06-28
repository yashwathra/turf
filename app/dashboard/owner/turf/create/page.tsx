"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const allSports = [
  "Football", "Cricket", "Tennis", "Badminton", "Volleyball", "Basketball",
  "Hockey", "Rugby", "Table Tennis", "Squash", "Baseball", "Golf",
  "Swimming", "Athletics", "Gymnastics", "Boxing", "Martial Arts",
  "Cycling", "Rowing", "Sailing",
];

interface TurfFormData {
  name: string;
  city: string;
  amenities: string;
  slotDuration: number;
  imageUrl: string;
  description: string;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
  sports: { [key: string]: number }; // sport name -> rate
}

export default function CreateTurfPage() {
  const router = useRouter();

  const [form, setForm] = useState<TurfFormData>({
    name: "",
    city: "",
    amenities: "",
    slotDuration: 60,
    imageUrl: "",
    description: "",
    isActive: true,
    openingTime: "06:00",
    closingTime: "22:00",
    sports: {}, // e.g. { "Football": 800, "Cricket": 1000 }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "slotDuration" ? parseInt(value) : value });
  };

  const toggleSport = (sport: string) => {
    const updated = { ...form.sports };
    if (updated[sport]) delete updated[sport];
    else updated[sport] = 800; // default price
    setForm({ ...form, sports: updated });
  };

  const updateSportRate = (sport: string, rate: number) => {
    const updated = { ...form.sports, [sport]: rate };
    setForm({ ...form, sports: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ You must be logged in to create a turf.");
      return;
    }

    const payload = {
      ...form,
      amenities: form.amenities.split(",").map((a) => a.trim()),
      sports: Object.entries(form.sports).map(([name, ratePerHour]) => ({
        name,
        ratePerHour,
      })),
    };

    const res = await fetch("/api/turf/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("✅ Turf created successfully!");
      router.push("/dashboard/owner");
    } else {
      toast.error("❌ " + (data.error || "Failed to create turf"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-6 py-6 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">➕ Create New Turf</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="name" placeholder="Turf Name" value={form.name} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-xl w-full" required />
        <input name="city" placeholder="City" value={form.city} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-xl w-full" required />
        <input name="amenities" placeholder="Amenities (comma separated)" value={form.amenities} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-xl w-full md:col-span-2" />
        <select name="slotDuration" value={form.slotDuration} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-xl w-full">
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
        </select>
        <input name="openingTime" type="time" value={form.openingTime} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-xl w-full" required />
        <input name="closingTime" type="time" value={form.closingTime} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-xl w-full" required />
        <input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-xl w-full" />
        <textarea name="description" placeholder="Short description" value={form.description} onChange={handleInputChange} className="p-3 border border-gray-300 rounded-xl w-full md:col-span-2" rows={2} />

        {/* Sports Section */}
        <div className="md:col-span-2">
          <span className="text-sm font-semibold block mb-2">Select Sports & Pricing</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allSports.map((sport) => (
              <div key={sport} className="flex items-center gap-2">
                <input type="checkbox" checked={!!form.sports[sport]} onChange={() => toggleSport(sport)} />
                <span className="text-sm">{sport}</span>
                {form.sports[sport] !== undefined && (
                  <input
                    type="number"
                    placeholder="Rate ₹/hr"
                    value={form.sports[sport]}
                    onChange={(e) => updateSportRate(sport, parseInt(e.target.value))}
                    className="ml-auto w-24 px-2 py-1 border rounded"
                    min={0}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Toggle */}
        <div className="md:col-span-2 flex items-center gap-4 mt-4">
          <label className="font-medium text-gray-700">Turf Active</label>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 relative transition-all duration-300">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-xl font-semibold transition">
            ✅ Create Turf
          </button>
        </div>
      </form>
    </div>
  );
}

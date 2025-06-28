"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TurfFormData {
  name: string;
  city: string;
  sports: string;
  amenities: string;
  slotDuration: number;
  imageUrl: string;
  description: string;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
}

export default function CreateTurfPage() {
  const router = useRouter();

  const [form, setForm] = useState<TurfFormData>({
    name: "",
    city: "",
    sports: "",
    amenities: "",
    slotDuration: 60,
    imageUrl: "",
    description: "",
    isActive: true,
    openingTime: "06:00",
    closingTime: "22:00",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "slotDuration" ? parseInt(value) : value });
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
      sports: form.sports.split(",").map((s) => s.trim()),
      amenities: form.amenities.split(",").map((a) => a.trim()),
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
        <input
          name="name"
          placeholder="Turf Name"
          value={form.name}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-xl w-full"
          required
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-xl w-full"
          required
        />

        <input
          name="amenities"
          placeholder="Amenities (e.g. parking, lights)"
          value={form.amenities}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-xl w-full md:col-span-2"
        />

        <select
          name="slotDuration"
          value={form.slotDuration}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-xl w-full"
        >
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
        </select>

        <input
          name="openingTime"
          type="time"
          value={form.openingTime}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-xl w-full"
          required
        />

        <input
          name="closingTime"
          type="time"
          value={form.closingTime}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-xl w-full"
          required
        />

        <input
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-xl w-full"
        />

        <textarea
          name="description"
          placeholder="Short description"
          value={form.description}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-xl w-full md:col-span-2"
          rows={2}
        />

        {/* Sports Section */}
        <div className="md:col-span-2">
          <span className="text-sm font-semibold block mb-2">Select Sports</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              "Football", "Cricket", "Tennis", "Badminton", "Volleyball", "Basketball",
              "Hockey", "Rugby", "Table Tennis", "Squash", "Baseball", "Golf",
              "Swimming", "Athletics", "Gymnastics", "Boxing", "Martial Arts",
              "Cycling", "Rowing", "Sailing",
            ].map((sport) => {
              const selected = form.sports.split(",");
              const isChecked = selected.includes(sport);
              return (
                <label key={sport} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    value={sport}
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) selected.push(sport);
                      else selected.splice(selected.indexOf(sport), 1);
                      setForm({ ...form, sports: selected.join(",") });
                    }}
                  />
                  {sport}
                </label>
              );
            })}
          </div>
        </div>

        {/* Active Toggle */}
        <div className="md:col-span-2 flex items-center gap-4 mt-4">
          <label className="font-medium text-gray-700">Turf Active</label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 relative transition-all duration-300">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-xl font-semibold transition"
          >
            ✅ Create Turf
          </button>
        </div>
      </form>
    </div>
  );
}

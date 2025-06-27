"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateTurfPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    city: "",
    sports: "",
    amenities: "",
    slotDuration: 60,
    imageUrl: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
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
          const isChecked = form.sports.split(",").includes(sport);
          return (
            <label key={sport} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                value={sport}
                checked={isChecked}
                onChange={(e) => {
                  const selected = form.sports.split(",");
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTurfPage() {
  const router = useRouter();

  const [form, setForm] = useState({
  name: "",
  city: "", // ✅ changed from location
  sports: "",
  amenities: "",
  slotDuration: 60,
  imageUrl: "",
  description: "",
});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem("token"); // ✅ Get JWT token from localStorage
  if (!token) {
    alert("❌ You're not logged in.");
    return;
  }

  // Convert sports and amenities into arrays
  const payload = {
    ...form,
    sports: form.sports.split(",").map(s => s.trim()),
    amenities: form.amenities.split(",").map(a => a.trim()),
  };

  const res = await fetch("/api/turf/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ Include token in header
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (res.ok) {
    alert("✅ Turf created!");
    router.push("/dashboard/owner");
  } else {
    alert("❌ Error: " + data.error);
  }
};


  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Turf</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Turf Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
  name="city"
  placeholder="City"
  value={form.city}
  onChange={handleChange}
  className="w-full p-2 border rounded"
  required
/>

        <label className="block">
  <span className="text-sm font-medium mb-2 block">Select Sports</span>
  <div className="grid grid-cols-2 gap-2">
    {["Football", "Cricket", "Tennis", "Badminton", "Volleyball","Basketball", "Hockey", "Rugby", "Table Tennis", "Squash", "Baseball", "Golf", "Swimming", "Athletics", "Gymnastics", "Boxing", "Martial Arts", "Cycling", "Rowing", "Sailing"].map((sport) => {
      const isChecked = form.sports.split(",").includes(sport);
      return (
        <label key={sport} className="flex items-center gap-2">
          <input
            type="checkbox"
            value={sport}
            checked={isChecked}
            onChange={(e) => {
              const selected = form.sports.split(",");
              if (e.target.checked) {
                selected.push(sport);
              } else {
                const index = selected.indexOf(sport);
                if (index > -1) selected.splice(index, 1);
              }
              setForm({ ...form, sports: selected.join(",") });
            }}
          />
          <span className="text-sm">{sport}</span>
        </label>
      );
    })}
  </div>
</label>


        <input
          name="amenities"
          placeholder="Amenities (e.g. parking, lights)"
          value={form.amenities}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="slotDuration"
          value={form.slotDuration}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
        </select>
        <input
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Short description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
          Create Turf
        </button>
      </form>
    </div>
  );
}

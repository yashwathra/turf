"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function EditTurfPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState({
    name: "",
    city: "",
    imageUrl: "",
    description: "",
    sports: [] as string[],
    amenities: [] as string[],
    slotDuration: 60,
  });

  useEffect(() => {
    if (!id) return;
    const fetchTurf = async () => {
      try {
        const res = await fetch(`/api/turf/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error("❌ Error loading turf:", err);
      }
    };
    fetchTurf();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "slotDuration") {
      setForm((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (name: "sports" | "amenities", value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value.split(",").map((v) => v.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/turf/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(`❌ Error updating turf: ${err.error || "Unknown error"}`);
        return;
      }

      toast.success("✅ Turf updated successfully!");
      router.push("/dashboard/owner");
    } catch (err) {
      console.error("❌ Error updating turf:", err);
      toast.error("❌ Failed to update turf. Please try again later.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6 py-8 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl">
  <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">✏️ Edit Turf</h1>

  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column */}
    <div className="space-y-4">
      <input
        name="name"
        placeholder="Turf Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
        required
      />

      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl"
        required
      />

      <input
        name="imageUrl"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl"
      />

      <select
        name="slotDuration"
        value={form.slotDuration}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl"
      >
        <option value={30}>30 minutes</option>
        <option value={60}>1 hour</option>
      </select>

      <input
        name="amenities"
        placeholder="Amenities (e.g., Lights, Security)"
        value={form.amenities.join(", ")}
        onChange={(e) => handleArrayChange("amenities", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl"
      />
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-xl"
      />

      {/* Sports */}
      <div>
        <span className="text-sm font-semibold mb-1 block">Select Sports</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1">
          {[
            "Football", "Cricket", "Tennis", "Badminton", "Volleyball", "Basketball", "Hockey",
            "Rugby", "Table Tennis", "Squash", "Baseball", "Golf", "Swimming", "Athletics",
            "Gymnastics", "Boxing", "Martial Arts", "Cycling", "Rowing", "Sailing",
          ].map((sport) => (
            <label key={sport} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                value={sport}
                checked={form.sports.includes(sport)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...form.sports, sport]
                    : form.sports.filter((s) => s !== sport);
                  setForm((prev) => ({ ...prev, sports: updated }));
                }}
              />
              {sport}
            </label>
          ))}
        </div>
      </div>
    </div>

    {/* Full Width Button */}
   
<div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-2">
  <button
    type="button"
    onClick={() => router.push("/dashboard/owner")}
    className="bg-gray-300 hover:bg-gray-400 text-gray-800 w-full sm:w-auto py-3 px-6 rounded-xl font-semibold transition"
  >
  Cancel
  </button>

  <button
    type="submit"
    className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto py-3 px-6 rounded-xl font-semibold transition"
  >
  Update Turf
  </button>
</div>

  </form>
</div>

  );
}

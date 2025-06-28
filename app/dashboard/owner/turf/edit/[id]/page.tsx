"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

interface TurfFormData {
  name: string;
  city: string;
  imageUrl: string;
  description: string;
  sports: { name: string; ratePerHour: number }[]; // ✅ updated
  amenities: string[];
  slotDuration: number;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
}

export default function EditTurfPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<TurfFormData>({
    name: "",
    city: "",
    imageUrl: "",
    description: "",
    sports: [],
    amenities: [],
    slotDuration: 60,
    isActive: true,
    openingTime: "06:00",
    closingTime: "22:00",
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
        setForm({
          name: data.name || "",
          city: data.city || "",
          imageUrl: data.imageUrl || "",
          description: data.description || "",
          sports: data.sports || [], // ✅ assumes [{ name, ratePerHour }]
          amenities: data.amenities || [],
          slotDuration: data.slotDuration || 60,
          isActive: data.isActive ?? true,
          openingTime: data.openingTime || "06:00",
          closingTime: data.closingTime || "22:00",
        });
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

  const toggleSport = (sportName: string) => {
    const exists = form.sports.find((s) => s.name === sportName);
    const updated = exists
      ? form.sports.filter((s) => s.name !== sportName)
      : [...form.sports, { name: sportName, ratePerHour: 800 }];
    setForm((prev) => ({ ...prev, sports: updated }));
  };

  const updateSportRate = (sportName: string, newRate: number) => {
    const updated = form.sports.map((s) =>
      s.name === sportName ? { ...s, ratePerHour: newRate } : s
    );
    setForm((prev) => ({ ...prev, sports: updated }));
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
            className="w-full p-3 border border-gray-300 rounded-xl"
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

          {/* Opening and Closing Time */}
          <input
            type="time"
            name="openingTime"
            value={form.openingTime}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

          <input
            type="time"
            name="closingTime"
            value={form.closingTime}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

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

          <div>
            <span className="text-sm font-semibold mb-1 block">Select Sports</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1">
              {[
                "Football", "Cricket", "Tennis", "Badminton", "Volleyball", "Basketball",
                "Hockey", "Rugby", "Table Tennis", "Squash", "Baseball", "Golf",
                "Swimming", "Athletics", "Gymnastics", "Boxing", "Martial Arts",
                "Cycling", "Rowing", "Sailing",
              ].map((sport) => {
                const selected = form.sports.find((s) => s.name === sport);
                return (
                  <div key={sport} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => toggleSport(sport)}
                    />
                    <span>{sport}</span>
                    {selected && (
                      <input
                        type="number"
                        min={0}
                        value={selected.ratePerHour}
                        onChange={(e) =>
                          updateSportRate(sport, parseInt(e.target.value))
                        }
                        className="ml-auto px-2 py-1 border rounded w-20"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <label className="font-medium text-gray-700">Turf Active</label>
            <label className="relative inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors duration-300" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5 group-hover:scale-110" />
            </label>
          </div>
        </div>

        {/* Buttons */}
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

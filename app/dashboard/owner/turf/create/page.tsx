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

interface PricingSlot {
  startTime: string;
  endTime: string;
  rate: number;
}

interface TurfFormData {
  name: string;
  city: string;
  address: string;
  amenities: string;
  slotDuration: number;
  imageUrl: string;
  description: string;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
  sports: {
    [sportName: string]: {
      available: boolean;
      startTime: string;
      endTime: string;
      pricing: PricingSlot[];
    };
  };
}

export default function CreateTurfPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TurfFormData>({
    name: "",
    city: "",
    address: "",
    amenities: "",
    slotDuration: 60,
    imageUrl: "",
    description: "",
    isActive: true,
    openingTime: "06:00",
    closingTime: "22:00",
    sports: {},
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
    else {
      updated[sport] = {
        available: true,
        startTime: "09:00",
        endTime: "18:00",
        pricing: [{ startTime: "09:00", endTime: "10:00", rate: 800 }],
      };
    }
    setForm({ ...form, sports: updated });
  };

  const addPricingSlot = (sport: string) => {
    const updated = { ...form.sports };
    updated[sport].pricing.push({
      startTime: "10:00",
      endTime: "11:00",
      rate: 600,
    });
    setForm({ ...form, sports: updated });
  };

  const updatePricingSlot = (
    sport: string,
    index: number,
    field: "startTime" | "endTime" | "rate",
    value: string | number
  ) => {
    const updated = { ...form.sports };
    if (field === "rate") {
      updated[sport].pricing[index].rate = Number(value);
    } else {
      updated[sport].pricing[index][field] = value as string;
    }
    setForm({ ...form, sports: updated });
  };

  const removePricingSlot = (sport: string, index: number) => {
    const updated = { ...form.sports };
    updated[sport].pricing.splice(index, 1);
    setForm({ ...form, sports: updated });
  };

  const toggleSportAvailability = (sport: string) => {
    const updated = { ...form.sports };
    updated[sport].available = !updated[sport].available;
    setForm({ ...form, sports: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    for (const [sport, { pricing }] of Object.entries(form.sports)) {
      for (const slot of pricing) {
        const [sh, sm] = slot.startTime.split(":").map(Number);
        const [eh, em] = slot.endTime.split(":").map(Number);
        const duration = (eh * 60 + em) - (sh * 60 + sm);
        if (duration > form.slotDuration) {
          toast.error(`⚠️ ${sport} slot exceeds ${form.slotDuration} minutes`);
          setLoading(false);
          return;
        }
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ Please log in to create turf");
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      amenities: form.amenities.split(",").map((a) => a.trim()),
      sports: Object.entries(form.sports).map(([name, { available, pricing, startTime, endTime }]) => ({
        name,
        available,
        startTime,
        endTime,
        pricing,
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
      toast.success("✅ Turf created!");
      router.push("/dashboard/owner");
    } else {
      toast.error("❌ " + (data.error || "Something went wrong"));
    }

    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-6 py-6 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">➕ Create New Turf</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="name" value={form.name} onChange={handleInputChange} placeholder="Turf Name" className="p-3 border rounded-xl" required />
        <input name="city" value={form.city} onChange={handleInputChange} placeholder="City" className="p-3 border rounded-xl" required />
        <input name="address" value={form.address} onChange={handleInputChange} placeholder="Address" className="p-3 border rounded-xl" required />
        <input name="amenities" value={form.amenities} onChange={handleInputChange} placeholder="Amenities (comma separated)" className="p-3 border rounded-xl md:col-span-2" />
        <select name="slotDuration" value={form.slotDuration} onChange={handleInputChange} className="p-3 border rounded-xl">
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
        </select>
        <input name="openingTime" type="time" value={form.openingTime} onChange={handleInputChange} className="p-3 border rounded-xl" required />
        <input name="closingTime" type="time" value={form.closingTime} onChange={handleInputChange} className="p-3 border rounded-xl" required />
        <input name="imageUrl" value={form.imageUrl} onChange={handleInputChange} placeholder="Image URL (optional)" className="p-3 border rounded-xl" />
        <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Description" className="p-3 border rounded-xl md:col-span-2" rows={2} />

        {/* Sports Section */}
        <div className="md:col-span-2">
          <span className="text-sm font-semibold block mb-2">Select Sports & Pricing Slots</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allSports.map((sport) => (
              <div key={sport} className="border rounded-xl p-3 bg-white/60 space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!form.sports[sport]} onChange={() => toggleSport(sport)} />
                  <span className="font-medium text-sm">{sport}</span>
                </label>

                {form.sports[sport] && (
                  <div>
                    {/* Sport Time Range */}
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <label>Sport Start</label>
                      <input
                        type="time"
                        value={form.sports[sport].startTime}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sports: {
                              ...form.sports,
                              [sport]: {
                                ...form.sports[sport],
                                startTime: e.target.value,
                              },
                            },
                          })
                        }
                        className="p-1 border rounded"
                      />

                      <label>Sport End</label>
                      <input
                        type="time"
                        value={form.sports[sport].endTime}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sports: {
                              ...form.sports,
                              [sport]: {
                                ...form.sports[sport],
                                endTime: e.target.value,
                              },
                            },
                          })
                        }
                        className="p-1 border rounded"
                      />
                    </div>

                    {/* Pricing slots */}
                    {form.sports[sport].pricing.map((slot, i) => (
                      <div key={i} className="flex flex-col gap-1 mb-2 border p-2 rounded bg-white/80">
                        <div className="flex justify-between items-center gap-2">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updatePricingSlot(sport, i, "startTime", e.target.value)}
                            className="w-full p-1 border rounded"
                          />
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updatePricingSlot(sport, i, "endTime", e.target.value)}
                            className="w-full p-1 border rounded"
                          />
                          <input
                            type="number"
                            min={0}
                            value={slot.rate}
                            onChange={(e) => updatePricingSlot(sport, i, "rate", e.target.value)}
                            placeholder="₹"
                            className="w-full p-1 border rounded"
                          />
                          {form.sports[sport].pricing.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePricingSlot(sport, i)}
                              className="text-red-500 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addPricingSlot(sport)}
                      className="text-blue-500 text-xs mt-1"
                    >
                      ➕ Add Slot
                    </button>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs">Available:</label>
                      <input
                        type="checkbox"
                        checked={form.sports[sport].available}
                        onChange={() => toggleSportAvailability(sport)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active + Submit */}
        <div className="md:col-span-2 flex items-center gap-4 mt-4">
          <label className="font-medium text-gray-700">Turf Active</label>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "⏳ Creating Turf..." : "✅ Create Turf"}
          </button>
        </div>
      </form>
    </div>
  );
}

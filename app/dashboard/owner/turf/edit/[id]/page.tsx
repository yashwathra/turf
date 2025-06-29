"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface Pricing {
  startTime: string;
  endTime: string;
  rate: number;
}

interface Sport {
  name: string;
  pricing: Pricing[];
}

interface TurfFormData {
  name: string;
  city: string;
  address: string;
  imageUrl: string;
  description: string;
  sports: Sport[];
  amenities: string[];
  slotDuration: number;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
}

const allSports = [
  "Football", "Cricket", "Tennis", "Badminton", "Volleyball", "Basketball", "Hockey",
  "Rugby", "Table Tennis", "Squash", "Baseball", "Golf", "Swimming", "Athletics",
  "Gymnastics", "Boxing", "Martial Arts", "Cycling", "Rowing", "Sailing"
];

export default function EditTurfPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<TurfFormData>({
    name: "",
    city: "",
    address: "",
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
          address: data.address || "",
          imageUrl: data.imageUrl || "",
          description: data.description || "",
          sports: (data.sports || []).map((s: Sport) => ({
            name: s.name,
            pricing: s.pricing?.length
              ? s.pricing
              : [{ startTime: "06:00", endTime: "22:00", rate: 800 }],
          })),
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

  const updatePricingSlot = (
    sport: string,
    index: number,
    key: "startTime" | "endTime" | "rate",
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      sports: prev.sports.map((s) =>
        s.name === sport
          ? {
              ...s,
              pricing: s.pricing.map((slot, i) =>
                i === index ? { ...slot, [key]: key === "rate" ? Number(value) : value } : slot
              ),
            }
          : s
      ),
    }));
  };

  const addPricingSlot = (sport: string) => {
    setForm((prev) => ({
      ...prev,
      sports: prev.sports.map((s) =>
        s.name === sport
          ? {
              ...s,
              pricing: [...s.pricing, { startTime: "10:00", endTime: "11:00", rate: 800 }],
            }
          : s
      ),
    }));
  };

  const removePricingSlot = (sport: string, index: number) => {
    setForm((prev) => ({
      ...prev,
      sports: prev.sports.map((s) =>
        s.name === sport
          ? {
              ...s,
              pricing: s.pricing.filter((_, i) => i !== index),
            }
          : s
      ),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "slotDuration" ? parseInt(value) : value,
    }));
  };

  const handleArrayChange = (name: "amenities", value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value.split(",").map((v) => v.trim()),
    }));
  };

  const toggleSport = (sportName: string) => {
    const exists = form.sports.find((s) => s.name === sportName);
    const updated = exists
      ? form.sports.filter((s) => s.name !== sportName)
      : [
          ...form.sports,
          {
            name: sportName,
            pricing: [{ startTime: "06:00", endTime: "07:00", rate: 800 }],
          },
        ];
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
    <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 py-6 sm:py-8 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">✏️ Edit Turf</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <input name="name" placeholder="Turf Name" value={form.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl" required />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl" required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl" required />
          <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl" />
          
          {/* Optimized Image Preview */}
          {form.imageUrl && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <Image src={form.imageUrl} alt="Turf" fill className="object-cover" />
            </div>
          )}

          <select name="slotDuration" value={form.slotDuration} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl">
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
          <input type="time" name="openingTime" value={form.openingTime} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl" />
          <input type="time" name="closingTime" value={form.closingTime} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl" />
          <input name="amenities" placeholder="Amenities (comma separated)" value={form.amenities.join(", ")} onChange={(e) => handleArrayChange("amenities", e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl" />
        </div>

        {/* Right: Description + Sports */}
        <div className="space-y-4">
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={4} className="w-full p-3 text-sm border border-gray-300 rounded-xl" />

          <div>
            <span className="text-sm font-semibold mb-1 block">Select Sports</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto pr-2">
              {allSports.map((sport) => {
                const selected = form.sports.find((s) => s.name === sport);
                return (
                  <div key={sport} className="border p-3 rounded-xl bg-white/60 space-y-2">
                    <label className="flex items-center gap-2 font-medium">
                      <input type="checkbox" checked={!!selected} onChange={() => toggleSport(sport)} />
                      <span className="text-sm">{sport}</span>
                    </label>

                    {selected &&
                      selected.pricing.map((p, i) => (
                        <div key={i} className="flex flex-wrap gap-2 items-center">
                          <input type="time" value={p.startTime} onChange={(e) => updatePricingSlot(sport, i, "startTime", e.target.value)} className="flex-1 min-w-[100px] border rounded px-2 py-1 text-sm" />
                          <input type="time" value={p.endTime} onChange={(e) => updatePricingSlot(sport, i, "endTime", e.target.value)} className="flex-1 min-w-[100px] border rounded px-2 py-1 text-sm" />
                          <input type="number" value={p.rate} onChange={(e) => updatePricingSlot(sport, i, "rate", e.target.value)} className="w-20 border rounded px-2 py-1 text-sm" />
                          {selected.pricing.length > 1 && (
                            <button type="button" onClick={() => removePricingSlot(sport, i)} className="text-red-500 text-xs">✕</button>
                          )}
                        </div>
                      ))}
                    {selected && (
                      <button type="button" onClick={() => addPricingSlot(sport)} className="text-blue-500 text-xs mt-2">
                        ➕ Add Pricing Slot
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <label className="font-medium text-gray-700 text-sm">Turf Active</label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
          </div>
        </div>

        {/* Footer */}
        <div className="md:col-span-2 flex justify-end gap-4">
          <button type="button" onClick={() => router.push("/dashboard/owner")} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-xl font-semibold transition">
            Cancel
          </button>
          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold transition">
            Update Turf
          </button>
        </div>
      </form>
    </div>
  );
}

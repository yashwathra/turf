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
    city: "", // ✅ Changed from location
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

      alert("✅ Turf updated successfully!");
      router.push("/dashboard/owner");
    } catch (err) {
      console.error("❌ Error updating turf:", err);
      toast.error("❌ Failed to update turf. Please try again later.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Turf</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Turf name" className="w-full p-2 border rounded" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" /> {/* ✅ updated */}
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
<label className="block">
  <span className="text-sm font-medium mb-2 block">Select Sports</span>
  <div className="grid grid-cols-2 gap-2">
    {["Football", "Cricket", "Tennis", "Badminton", "Volleyball","Basketball", "Hockey", "Rugby", "Table Tennis", "Squash", "Baseball", "Golf", "Swimming", "Athletics", "Gymnastics", "Boxing", "Martial Arts", "Cycling", "Rowing", "Sailing"].map((sport) => (
      <label key={sport} className="flex items-center gap-2">
        <input
          type="checkbox"
          value={sport}
          checked={form.sports.includes(sport)}
          onChange={(e) => {
            const updatedSports = e.target.checked
              ? [...form.sports, sport]
              : form.sports.filter((s) => s !== sport);
            setForm((prev) => ({ ...prev, sports: updatedSports }));
          }}
        />
        <span className="text-sm">{sport}</span>
      </label>
    ))}
  </div>
</label>


        <input name="amenities" value={form.amenities.join(", ")} onChange={(e) => handleArrayChange("amenities", e.target.value)} placeholder="Amenities (e.g., Lights, Security)" className="w-full p-2 border rounded" />
        <select name="slotDuration" value={form.slotDuration} onChange={handleChange} className="w-full p-2 border rounded">
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Turf</button>
      </form>
    </div>
  );
}

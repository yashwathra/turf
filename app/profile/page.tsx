"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/get", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.user) {
          setForm({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            gender: data.user.gender || "",
            dob: data.user.dob ? data.user.dob.split("T")[0] : "",
            address: data.user.address || "",
            avatarUrl: data.user.avatarUrl || "",
          });
        } else {
          toast.error("⚠️ Profile not found");
        }
      } catch {
        toast.error("❌ Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("✅ Profile updated!");
      setTimeout(() => router.push("/"), 1000);
    } catch {
      toast.error("❌ Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">👤 Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ Avatar using <Image /> */}
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src={form.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                width={112}
                height={112}
                className="rounded-full object-cover border shadow"
              />
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                disabled
                className="w-full p-3 border rounded-xl bg-gray-100 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Date of Birth</label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              >
                <option value="">Select Gender</option>
                <option value="male">♂️ Male</option>
                <option value="female">♀️ Female</option>
                <option value="other">🌈 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Avatar URL</label>
              <input
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={handleChange}
                placeholder="Paste image URL"
                className="w-full p-3 border rounded-xl"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Your full address"
              className="w-full p-3 border rounded-xl"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full bg-gray-100 text-red-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              ❌ Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition ${
                submitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

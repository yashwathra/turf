"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Link from "next/link";
import CardSkeleton from "@/components/common/CardSkeleton";

interface Sport {
  name: string;
  ratePerHour: number;
  available: boolean;
}

interface Turf {
  _id: string;
  name: string;
  city: string;
  imageUrl?: string;
  description?: string;
  sports: Sport[];
  isActive: boolean;
}

export default function MyTurfsPage() {
  const { user } = useAuth();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTurfs = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await fetch("/api/turf/owner", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();
        if (res.ok) setTurfs(data);
        else console.error("API Error:", data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, [user]);

  const handleToggle = async (turfId: string, current: boolean) => {
    try {
      const res = await fetch("/api/owner/turf-toggle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ turfId, isActive: !current }),
      });

      if (res.ok) {
        setTurfs((prev) =>
          prev.map((t) =>
            t._id === turfId ? { ...t, isActive: !current } : t
          )
        );
      } else {
        console.error("Turf toggle failed");
      }
    } catch (error) {
      console.error("Turf toggle error:", error);
    }
  };

  const handleSportToggle = async (turfId: string, sportName: string, current: boolean) => {
    try {
      const res = await fetch("/api/owner/sport-toggle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ turfId, sportName, available: !current }),
      });

      if (res.ok) {
        setTurfs((prev) =>
          prev.map((t) =>
            t._id === turfId
              ? {
                  ...t,
                  sports: t.sports.map((s) =>
                    s.name === sportName ? { ...s, available: !current } : s
                  ),
                }
              : t
          )
        );
      } else {
        console.error("Sport toggle failed");
      }
    } catch (error) {
      console.error("Sport toggle error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Turfs</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : turfs.length === 0 ? (
        <p className="text-gray-600">You have no turfs. Start by adding one.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map((turf) => (
            <Card
  key={turf._id}
  title={turf.name}
  subtitle={turf.city}
  imageUrl={turf.imageUrl}
>
  <div className="space-y-4">
    {/* Description */}
    <p className="text-sm text-gray-600 line-clamp-2">
      {turf.description || "No description available."}
    </p>

    {/* Turf Active Status */}
    <span
      className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
        turf.isActive
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {turf.isActive ? "Active" : "Inactive"}
    </span>

    {/* Sports Toggle */}
    <div className="pt-2 border-t border-gray-200">
      <p className="text-xs font-medium text-gray-500 mb-1">Sports Offered:</p>
      <div className="space-y-2">
        {turf.sports.map((sport) => (
          <div
            key={sport.name}
            className="flex justify-between items-center text-sm"
          >
            <span>
              {sport.name} - ₹{sport.ratePerHour}/hr
            </span>
            <label className="relative inline-flex items-center cursor-pointer w-11 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={sport.available}
                onChange={() =>
                  handleSportToggle(turf._id, sport.name, sport.available)
                }
              />
              <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300" />
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5" />
            </label>
          </div>
        ))}
      </div>
    </div>

    {/* Edit + Toggle Turf Status */}
    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
      <Link href={`/dashboard/owner/turf/edit/${turf._id}`}>
        <Button className="text-sm px-3 py-1">Edit</Button>
      </Link>
      <label className="relative inline-flex items-center cursor-pointer w-11 h-6">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={turf.isActive ?? false}
          onChange={() => handleToggle(turf._id, turf.isActive || false)}
        />
        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300" />
        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5" />
      </label>
    </div>
  </div>
</Card>

          ))}
        </div>
      )}
    </div>
  );
}

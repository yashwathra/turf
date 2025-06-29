"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Link from "next/link";
import CardSkeleton from "@/components/common/CardSkeleton";
import { toast } from "sonner";

interface PricingSlot {
  startTime: string;
  endTime: string;
  rate: number;
}

interface Sport {
  name: string;
  available: boolean;
  pricing?: PricingSlot[];
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
        else toast.error("❌ Failed to load turfs");
      } catch (err) {
        toast.error("❌ Fetch error");
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, [user]);

  const updateSportPricing = async (
    turfId: string,
    sportName: string,
    updatedPricing: PricingSlot[]
  ) => {
    setTurfs((prev) =>
      prev.map((t) =>
        t._id === turfId
          ? {
              ...t,
              sports: t.sports.map((s) =>
                s.name === sportName ? { ...s, pricing: updatedPricing } : s
              ),
            }
          : t
      )
    );

    try {
      const res = await fetch("/api/owner/sport-pricing", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ turfId, sportName, pricing: updatedPricing }),
      });

      if (!res.ok) {
        toast.error("❌ Failed to save pricing");
      } else {
        toast.success("✅ Pricing updated");
      }
    } catch {
      toast.error("❌ Network error");
    }
  };

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
          prev.map((t) => (t._id === turfId ? { ...t, isActive: !current } : t))
        );
        toast.success("✅ Turf status updated");
      } else {
        toast.error("❌ Failed to update turf status");
      }
    } catch (error) {
      console.error("Turf toggle error:", error);
    }
  };

  const handleSportToggle = async (
    turfId: string,
    sportName: string,
    current: boolean
  ) => {
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
        toast.success("✅ Sport availability updated");
      } else {
        toast.error("❌ Failed to update sport availability");
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
                <p className="text-sm text-gray-600 line-clamp-2">
                  {turf.description || "No description available."}
                </p>

                <span
                  className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                    turf.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {turf.isActive ? "Active" : "Inactive"}
                </span>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Sports Offered:
                  </p>
                  <div className="space-y-2">
                    {turf.sports.map((sport) => (
                      <div
                        key={sport.name}
                        className="flex flex-col gap-1 text-sm border p-2 rounded bg-gray-50"
                      >
                        <div className="flex justify-between items-center">
                          <span>{sport.name}</span>
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

                        <div className="space-y-1 text-xs text-gray-700">
                          {(sport.pricing || []).map((slot, i) => (
                            <div
                              key={i}
                              className="flex gap-2 items-center justify-between"
                            >
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => {
                                  const updated = [...(sport.pricing || [])];
                                  updated[i].startTime = e.target.value;
                                  setTurfs((prev) =>
                                    prev.map((t) =>
                                      t._id === turf._id
                                        ? {
                                            ...t,
                                            sports: t.sports.map((s) =>
                                              s.name === sport.name
                                                ? { ...s, pricing: updated }
                                                : s
                                            ),
                                          }
                                        : t
                                    )
                                  );
                                }}
                                onBlur={() =>
                                  updateSportPricing(
                                    turf._id,
                                    sport.name,
                                    sport.pricing || []
                                  )
                                }
                                className="border rounded px-1"
                              />
                              to
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => {
                                  const updated = [...(sport.pricing || [])];
                                  updated[i].endTime = e.target.value;
                                  setTurfs((prev) =>
                                    prev.map((t) =>
                                      t._id === turf._id
                                        ? {
                                            ...t,
                                            sports: t.sports.map((s) =>
                                              s.name === sport.name
                                                ? { ...s, pricing: updated }
                                                : s
                                            ),
                                          }
                                        : t
                                    )
                                  );
                                }}
                                onBlur={() =>
                                  updateSportPricing(
                                    turf._id,
                                    sport.name,
                                    sport.pricing || []
                                  )
                                }
                                className="border rounded px-1"
                              />
                              ₹
                              <input
                                type="number"
                                value={slot.rate}
                                onChange={(e) => {
                                  const updated = [...(sport.pricing || [])];
                                  updated[i].rate = Number(e.target.value);
                                  setTurfs((prev) =>
                                    prev.map((t) =>
                                      t._id === turf._id
                                        ? {
                                            ...t,
                                            sports: t.sports.map((s) =>
                                              s.name === sport.name
                                                ? { ...s, pricing: updated }
                                                : s
                                            ),
                                          }
                                        : t
                                    )
                                  );
                                }}
                                onBlur={() =>
                                  updateSportPricing(
                                    turf._id,
                                    sport.name,
                                    sport.pricing || []
                                  )
                                }
                                className="border rounded px-1 w-20"
                              />
                            </div>
                          ))}
                          <button
                            className="text-blue-600 text-xs underline mt-1"
                            onClick={() => {
                              const newSlot: PricingSlot = {
                                startTime: "06:00",
                                endTime: "07:00",
                                rate: 100,
                              };
                              updateSportPricing(turf._id, sport.name, [
                                ...(sport.pricing || []),
                                newSlot,
                              ]);
                            }}
                          >
                            + Add Slot
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <Link href={`/dashboard/owner/turf/edit/${turf._id}`}>
                    <Button className="text-sm px-3 py-1">Edit</Button>
                  </Link>
                  <label className="relative inline-flex items-center cursor-pointer w-11 h-6">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={turf.isActive}
                      onChange={() =>
                        handleToggle(turf._id, turf.isActive || false)
                      }
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

interface Turf {
  _id: string;
  name: string;
  location: string;
  imageUrl?: string;
  description?: string;
  sports?: string[];
}

export default function OwnerDashboardPage() {
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

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">🌿 Owner Dashboard</h1>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link href="/dashboard/owner/turf/create">
          <div className="p-4 bg-white rounded shadow hover:shadow-md transition">
            <h2 className="font-semibold text-red-600">➕ Add Turf</h2>
            <p className="text-sm text-gray-600">Create new turf listing</p>
          </div>
        </Link>
        <Link href="/dashboard/owner/bookings">
          <div className="p-4 bg-white rounded shadow hover:shadow-md transition">
            <h2 className="font-semibold text-red-600">📅 Bookings</h2>
            <p className="text-sm text-gray-600">View turf bookings</p>
          </div>
        </Link>
        <div className="p-4 bg-gray-100 rounded shadow cursor-not-allowed opacity-60">
          <h2 className="font-semibold text-gray-400">🛠 Manage Availability</h2>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow cursor-not-allowed opacity-60">
          <h2 className="font-semibold text-gray-400">💬 Customer Feedback</h2>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>
      </div>

      {/* YOUR TURFS */}
      <h2 className="text-xl font-semibold mb-4">Your Turfs</h2>
      {loading ? (
        <p className="text-gray-500">Loading turfs...</p>
      ) : turfs.length === 0 ? (
        <p className="text-gray-600">You have no turfs. Start by adding one.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map((turf) => (
            <Card
              key={turf._id}
              title={turf.name}
              subtitle={turf.location}
              imageUrl={turf.imageUrl}
              description={turf.description}
              sports={turf.sports}
            >
              <Link href={`/dashboard/owner/turf/edit/${turf._id}`}>
                <Button>Edit</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

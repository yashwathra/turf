"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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

  useEffect(() => {
    const fetchOwnerTurfs = async () => {
      try {
        console.log("🔐 Fetching turfs for user:", user?._id);
        const res = await fetch("/api/turf/owner", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        });

        console.log("📦 Response status:", res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error("❌ API Error:", errorData);
          return;
        }

        const data = await res.json();
        console.log("✅ Turfs fetched:", data);
        setTurfs(data);
      } catch (err) {
        console.error("🚨 Network or unexpected error:", err);
      }
    };

    if (user?._id) {
      console.log("👤 User exists, running fetch...");
      fetchOwnerTurfs();
    } else {
      console.log("❗ No user found, skipping fetch.");
    }
  }, [user]);

  return (
    <DashboardLayout userRole="owner">
      <h1 className="text-2xl font-bold mb-4">🌿 Turf Owner Dashboard</h1>

      <ul className="space-y-2 text-lg mb-10">
        <li>
          <Link href="/turf/create" className="text-blue-600 hover:underline">
            ➕ Add New Turf
          </Link>
        </li>
        <li>📅 See All Bookings</li>
        <li>🛠 Manage Availability</li>
        <li>💬 Get Customer Feedback</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">Your Turfs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <Card
            key={turf._id}
            title={turf.name}
            subtitle={turf.location}
            imageUrl={turf.imageUrl}
            description={turf.description}
            sports={turf.sports}
            showDots={false}
          >
            <Link href={`/turf/edit/${turf._id}`}>
              <Button>Edit</Button>
            </Link>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

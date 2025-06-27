"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Link from "next/link";
import CardSkeleton from "@/components/common/CardSkeleton";

interface Turf {
  _id: string;
  name: string;
  city: string; 
  imageUrl?: string;
  description?: string;
  sports?: string[];
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

    </div>
  );
}

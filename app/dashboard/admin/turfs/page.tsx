"use client";

import { useEffect, useState } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Link from "next/link";

interface Turf {
  _id: string;
  name: string;
  city: string; 
  imageUrl?: string;
  description?: string;
  sports?: string[];
   isActive?: boolean;
}

export default function AdminAllTurfsPage() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllTurfs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/turf/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();
        if (res.ok) setTurfs(data);
        else console.error("API error:", data.message);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTurfs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">🏟️ All Turfs (Admin View)</h1>
      {loading ? (
        <p>Loading turfs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map((turf) => (
            <Card
              key={turf._id}
              title={turf.name}
              subtitle={`${turf.city}${turf.isActive === false ? " (Inactive)" : ""}`}
              imageUrl={turf.imageUrl}
              description={turf.description}
              sports={turf.sports}
            >
              <Link href={`/dashboard/admin/turfs/${turf._id}`}>
                <Button>View</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

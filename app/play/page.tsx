"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import Card from "@/components/common/Card";
import CategoryCard from "@/components/common/CategoryCard";
import Button from "@/components/common/Button";
import CardSkeleton from "@/components/common/CardSkeleton";
import AdSlider from "@/components/common/AdSlider";
import HeroBanner from "@/components/common/HeroBanner";
import Footer from "@/components/common/Footer";

// Define the Turf type
interface Turf {
  _id: string;
  name: string;
  location: string;
  imageUrl: string;
  description?: string;
  sports?: string[];
}

export default function PlayPage() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/turf/public-list");
        const data = await res.json();
        setTurfs(data);
      } catch (err) {
        console.error("Error fetching turfs:", err);
      } finally {
        setIsLoading(false); // ✅ end loading
      }
    };

    fetchTurfs();
  }, []);

  return (
    <>
      <Navbar />

      <HeroBanner
        title="Let the Game Begin"
        description="Pick your game and book your time"
        backgroundImage="/bg-image.jpg"
      >
        <Button>BOOK NOW</Button>
      </HeroBanner>

      {/* Floating cards section */}
      <section className="relative z-10 -mt-24 px-6 max-w-6xl mx-auto">
        {isLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {[1, 2, 3, 4, 5, 6].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {turfs.map((turf) => (
      <Card
        key={turf._id}
        title={turf.name}
        subtitle={turf.location}
        imageUrl={turf.imageUrl}
        description={turf.description}
        sports={turf.sports}
      >
        <Button>PLAY NOW</Button>
      </Card>
    ))}
  </div>
)}

      </section>

      {/* Category section */}
      <section className="w-full px-6 md:px-10 mt-20">
        <h2 className="text-2xl font-extrabold text-center mb-10 text-red-600">
          PLAY SPORTS
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <CategoryCard name="Cricket" icon="/icons/cricket.svg" />
          <CategoryCard name="Football" icon="/icons/football.svg" />
          <CategoryCard name="Badminton" icon="/icons/badminton.svg" />
          <CategoryCard name="Snooker" icon="/icons/snooker.svg" />
        </div>
      </section>

      {/* Ad slider */}
      <section className="w-full mt-10">
        <AdSlider />
      </section>

      <Footer />
    </>
  );
}

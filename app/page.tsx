"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import { Suspense } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import AdSlider from "@/components/common/AdSlider";
import CategoryCard from "@/components/common/CategoryCard";
import Footer from "@/components/common/Footer";
import SearchBox from "@/components/common/SearchBox";
import HeroBanner from "@/components/common/HeroBanner";

interface Turf {
  _id: string;
  name: string;
  location: string;
  imageUrl: string;
  description?: string;
  sports?: string[];
}

export default function HomePage() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 🌀 Loader state

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/turf/all");
        const data = await res.json();
        setTurfs(data.slice(0, 3)); 
      } catch (err) {
        console.error("Failed to fetch turfs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTurfs();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO BANNER */}
      <HeroBanner
        title="PLAY SPORTS"
        description="We Are Redefining Sports. Experience The Difference. Now book your sports venue from ₹100"
        backgroundImage="/bg-image.jpg"
      />

      {/* SEARCH BOX */}
      <Suspense fallback={<div className="text-center py-8">Loading Search Box...</div>}>
        <SearchBox />
      </Suspense>

      {/* TURF CARDS */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-500 text-lg font-medium">
          ⏳ Loading turfs...
        </div>
      ) : (
        turfs.map((turf, index) => (
          <section
            key={turf._id}
            className={`w-full px-6 md:px-10 mt-28 flex flex-col-reverse md:flex-row items-center justify-between gap-10 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
          >
            {/* TEXT */}
            <div className="max-w-sm text-center md:text-left md:ml-20 md:mr-20">
              <h1 className="text-4xl font-extrabold text-red-600">{turf.name}</h1>
              <p className="text-black mt-3 font-medium leading-relaxed">
                {turf.description || "This turf is perfect for your next game."}
              </p>
              <div className="mt-6">
                <Button>BOOK NOW</Button>
              </div>
              <div className="mt-4 text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
            </div>

            {/* CARD */}
            <div className="relative w-full max-w-sm">
              <div
                className={`absolute ${index % 2 === 0 ? "-top-8 -left-8" : "-top-8 -right-8"
                  } w-52 h-52 bg-red-600 rounded-[30px] z-0`}
              ></div>
              <div className="relative z-10">
                <Card
                  title={turf.name}
                  subtitle={turf.location}
                  imageUrl={turf.imageUrl}
                  description={turf.description}
                  sports={turf.sports}
                />
              </div>
            </div>
          </section>
        ))
      )}

      {/* AD SLIDER */}
      <section className="w-full mt-10">
        <AdSlider />
      </section>

      {/* CATEGORIES */}
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

      {/* FOOTER */}
      <Footer />
    </>
  );
}

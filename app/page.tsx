"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  city: string;
  imageUrl: string;
  description?: string;
  sports?: string[];
}

export default function HomePage() {
  const [allTurfs, setAllTurfs] = useState<Turf[]>([]);
  const [featuredTurfs, setFeaturedTurfs] = useState<Turf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>([]);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/turf/all");
        const data = await res.json();
        setAllTurfs(data);
        setFeaturedTurfs(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch turfs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTurfs();
  }, []);

  useEffect(() => {
    if (!selectedSport) {
      setFilteredTurfs([]);
    } else {
      setFilteredTurfs(
        allTurfs.filter((t) =>
          t.sports?.some(
            (s) => s.toLowerCase() === selectedSport.toLowerCase()
          )
        )
      );
    }
  }, [selectedSport, allTurfs]);

  return (
    <>
      <Navbar />

      <HeroBanner
        title="PLAY SPORTS"
        description="We Are Redefining Sports. Experience The Difference. Now book your sports venue from ₹100"
        backgroundImage="/bg-image.jpg"
      />

      <Suspense fallback={<div className="text-center py-8">Loading Search Box...</div>}>
        <SearchBox />
      </Suspense>

      {/* TURF CARDS - Featured 3 */}
     {isLoading ? (
  <>
    {[1, 2, 3].map((_, index) => (
      <section key={index} className="w-full mt-28">
        <div
          className={`max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-60 px-4 md:px-6 ${
            index % 2 !== 0 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Text Skeleton */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-4 animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto md:mx-0" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-10 w-32 bg-gray-300 rounded mx-auto md:mx-0 mt-4" />
            <div className="h-5 w-24 bg-gray-200 rounded mx-auto md:mx-0 mt-2" />
          </div>

          {/* Card Skeleton with red shape */}
          <div className="w-full md:w-1/2 relative flex justify-center animate-pulse">
            <div
              className={`absolute ${
                index % 2 === 0 ? "-top-8 -left-8" : "-top-8 -right-8"
              } w-52 h-52 bg-red-200 rounded-[30px] z-0`}
            />
            <div className="relative z-10 max-w-sm w-full h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </section>
    ))}
  </>
) : (
  

  featuredTurfs.map((turf, index) => (
          <section key={turf._id} className="w-full mt-28">
            <div
              className={`max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-60 px-4 md:px-6 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* TEXT */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-red-600">{turf.name}</h1>
                <p className="text-black mt-3 font-medium leading-relaxed">
                  {turf.description || "This turf is perfect for your next game."}
                </p>
                <div className="mt-6">
                  <Link href={`/turf/${turf._id}`}>
                    <Button>BOOK NOW</Button>
                  </Link>
                </div>
                <div className="mt-4 text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
              </div>

              {/* CARD */}
              <div className="w-full md:w-1/2 relative flex justify-center">
                <div
                  className={`absolute ${
                    index % 2 === 0 ? "-top-8 -left-8" : "-top-8 -right-8"
                  } w-52 h-52 bg-red-600 rounded-[30px] z-0`}
                ></div>
                <div className="relative z-10 max-w-sm w-full">
                  <Card
                    title={turf.name}
                    subtitle={turf.city}
                    imageUrl={turf.imageUrl}
                    description={turf.description}
                    sports={turf.sports}
                  />
                </div>
              </div>
            </div>
          </section>
        ))
      )}

      <section className="w-full mt-10">
        <AdSlider />
      </section>

      {/* CATEGORY FILTER SECTION */}
      <section className="w-full px-6 md:px-10 mt-20">
        <h2 className="text-2xl font-extrabold text-center mb-10 text-red-600">
          PLAY SPORTS
        </h2>

        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {["Cricket", "Football", "Badminton", "Snooker"].map((sport) => (
            <CategoryCard
              key={sport}
              name={sport}
              icon={`/icons/${sport.toLowerCase()}.svg`}
              selected={selectedSport === sport}
              onClick={() =>
                setSelectedSport((prev) => (prev === sport ? null : sport))
              }
            />
          ))}
        </div>

        {selectedSport && (
          filteredTurfs.length === 0 ? (
            <p className="text-center text-red-500 font-medium">
              No turfs found for {selectedSport}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTurfs.map((turf) => (
                <Card
                  key={turf._id}
                  title={turf.name}
                  subtitle={turf.city}
                  imageUrl={turf.imageUrl}
                  description={turf.description}
                  sports={turf.sports}
                />
              ))}
            </div>
          )
        )}
      </section>

      <Footer />
    </>
  );
}

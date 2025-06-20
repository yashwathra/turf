
"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import searchIcon from "@/assets/search.svg";
import AdSlider from "@/components/common/AdSlider";
import CategoryCard from "@/components/common/CategoryCard";
import Image from "next/image";
import HeroBanner from '@/components/common/HeroBanner';

export default function BookingPage() {
  return (
    <>
      <Navbar />
      {/* ===== HERO SECTION ===== */}
            
            <HeroBanner
                    title="PLAY SPORTS"
                    description="We Are Redefining Sports. Experience The Difference.Now book your sports venue from ₹100"
                    backgroundImage="/bg-image.jpg" />
            {/* ===== SEARCH BOX SECTION ===== */}
                  <section className="relative z-10 -mt-20 flex justify-center">
                    <div className="bg-white shadow-lg rounded-xl px-8 py-6 w-full max-w-5xl min-h-[120px] flex flex-wrap gap-10 items-center justify-center">
                      <select className="border px-4 py-2 rounded-md">
                        <option>Football</option>
                        <option>Cricket</option>
                      </select>
                      <select className="border px-4 py-2 rounded-md">
                        <option>Jaipur</option>
                        <option>Mumbai</option>
                      </select>
                      <input type="date" className="border px-4 py-2 rounded-md" />
                      <select className="border px-4 py-2 rounded-md">
                        <option>1AM - 2AM</option>
                        <option>2AM - 3AM</option>
                      </select>
                      <select className="border px-4 py-2 rounded-md">
                        <option>800₹/hr</option>
                      </select>
                      <button className="bg-red-600 text-white px-8 py-6 rounded-lg text-xl">
                        <Image src={searchIcon} alt="Search" width={32} height={32} />
                      </button>
                    </div>
                  </section>
             {/* ===== AD SLIDER SECTION ===== */}
                  <section className="w-full mt-10">
                    <AdSlider />
                  </section>
                  {/* ===== CATEGORY SECTION ===== */}
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

      

      <Footer />
    </>
  );
}

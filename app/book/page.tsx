
"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Shape from "@/components/common/Shape";
import searchIcon from "@/assets/search.svg";
import AdSlider from "@/components/common/AdSlider";
import CategoryCard from "@/components/common/CategoryCard";
import Image from "next/image";

export default function BookingPage() {
  return (
    <>
      <Navbar />
      {/* ===== HERO SECTION ===== */}
            <section
              className="relative w-full bg-cover bg-center -mt-[88px] pt-[0px] h-[500px] flex items-center justify-center"
              style={{ backgroundImage: "url('/bg-image.jpg')" }}
            >
              <div className="flex w-full max-w-6xl justify-between items-center text-white px-6">
                {/* Left: Title */}
                <div className="text-left max-w-md">
                  <h1 className="text-6xl font-bold">PLAY SPORTS</h1>
                </div>
      
                {/* Right: Paragraph */}
                <div className="text-right max-w-md">
                  <p className="text-lg text-bold">
                    We Are Redefining Sports. Experience The Difference.
                    <br />
                    Now book your sports venue from ₹100
                  </p>
                </div>
              </div>
      
              {/* Shapes */}
              <Shape className="w-40 h-40 bg-red-600 rounded-full opacity-100 absolute top-[90%] left-[25%] shadow-[0_0_40px_10px_rgba(239,68,68,0.5)]" />
              <Shape className="w-80 h-80 bg-red-600 rounded-full opacity-100 absolute top-[65%] left-20" />
              <Shape className="w-[140px] h-[140px] bg-black rounded-full opacity-100 absolute top-[89.7%] left-[25.5%]" />
            </section>
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

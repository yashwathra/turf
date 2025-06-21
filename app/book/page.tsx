import Navbar from "@/components/common/Navbar";
import { Suspense } from "react";
import Footer from "@/components/common/Footer";
import AdSlider from "@/components/common/AdSlider";
import CategoryCard from "@/components/common/CategoryCard";
import HeroBanner from "@/components/common/HeroBanner";
import SearchBox from "@/components/common/SearchBox";
export default function BookingPage() {
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
      <section className="w-full mt-10">
        <AdSlider />
      </section>
      <section className="w-full px-6 md:px-10 mt-20">
        <h2 className="text-2xl font-extrabold text-center mb-10 text-red-600">PLAY SPORTS</h2>
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

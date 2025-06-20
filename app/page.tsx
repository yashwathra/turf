"use client";
import Navbar from "@/components/common/Navbar";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import AdSlider from "@/components/common/AdSlider";
import CategoryCard from "@/components/common/CategoryCard";
import Footer from "@/components/common/Footer";
import SearchBox from '@/components/common/SearchBox';
import HeroBanner from '@/components/common/HeroBanner';


export default function HomePage() {
  const cards = [
    {
      title: "WTP",
      subtitle: "Jaipur · ₹100/hr",
      imageUrl: "/turf-image.jpg",
      icons: ["/wtp1.jpg", "/wtp2.jpg", "/wtp3.jpg"],
      description: "World Trade Park is a shopping mall in Malviya Nagar, Jaipur, Rajasthan, India.",
    },
    {
      title: "Jawahar Turf",
      subtitle: "Jaipur · ₹150/hr",
      imageUrl: "/turf2.jpg",
      icons: ["/wtp1.jpg", "/wtp2.jpg", "/wtp3.jpg"],
      description: "A great football turf with night lighting and full security.",
    },
  ];

  return (
    <>
      {/* ===== NAVBAR SECTION ===== */}
      <Navbar />
      {/* ===== HERO SECTION ===== */}
      <HeroBanner
        title="PLAY SPORTS"
        description="We Are Redefining Sports. Experience The Difference.Now book your sports venue from ₹100"
        backgroundImage="/bg-image.jpg" />
      {/* ===== SEARCH BOX SECTION ===== */}
      <SearchBox />
      {/* ===== CARD SECTION ===== */}
      {cards.map((card, index) => (
        <section
          key={index}
          className={`w-full px-6 md:px-10 mt-28 flex flex-col-reverse md:flex-row items-center justify-between gap-10 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
        >
          {/* TEXT SECTION */}
          <div className="max-w-sm text-center md:text-left md:ml-20 md:mr-20">
            <h1 className="text-4xl font-extrabold text-red-600">{card.title}</h1>
            <p className="text-black mt-3 font-medium leading-relaxed">
              {card.description}
            </p>
            <div className="mt-6">
              <Button>BOOK NOW</Button>
            </div>
            <div className="mt-4 text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
          </div>

          {/* CARD + SHAPE */}
          <div className="relative w-full max-w-sm">
            {/* 🔴 Shape behind the card */}
            <div
              className={`absolute ${index % 2 === 0 ? "-top-8 -left-8" : "-top-8 -right-8"
                } w-52 h-52 bg-red-600 rounded-[30px] z-0`}
            ></div>

            {/* 🧾 Card in front */}
            <div className="relative z-10">
              <Card
                title={card.title}
                subtitle={card.subtitle}
                imageUrl={card.imageUrl}
                icons={card.icons}
              />
            </div>
          </div>
        </section>
      ))}
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
      {/* ===== FOOTER SECTION ===== */}
      <Footer />
    </>
  );
}

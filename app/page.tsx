"use client";
import Navbar from "@/components/common/Navbar";
import searchIcon from "@/assets/search.svg";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Shape from "@/components/common/Shape";
import AdSlider from "@/components/common/AdSlider";
import CategoryCard from "@/components/common/CategoryCard";
import Footer from "@/components/common/Footer";


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
            <img src={searchIcon.src} alt="Search" className="w-8 h-8" />
          </button>
        </div>
      </section>

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

'use client';

import { useState } from 'react';
import Navbar from "@/components/common/Navbar";
import Card from "@/components/common/Card";
import CategoryCard from "@/components/common/CategoryCard";
import Button from "@/components/common/Button";
import AdSlider from "@/components/common/AdSlider";
import HeroBanner from '@/components/common/HeroBanner';
import Footer from "@/components/common/Footer";

const cards = [
    {
        title: "WTP",
        subtitle: "Jaipur · ₹100/hr",
        imageUrl: "/turf-image.jpg",
        icons: ["/wtp1.jpg", "/wtp2.jpg", "/wtp3.jpg"],
    },
    {
        title: "Jawahar Turf",
        subtitle: "Jaipur · ₹150/hr",
        imageUrl: "/turf2.jpg",
        icons: ["/wtp1.jpg", "/wtp2.jpg", "/wtp3.jpg"],
    },
    {
        title: "Mumbai Arena",
        subtitle: "Mumbai · ₹200/hr",
        imageUrl: "/turf3.jpg",
        icons: ["/wtp1.jpg", "/wtp2.jpg", "/wtp3.jpg"],
    },
    {
        title: "Chennai Sports Hub",
        subtitle: "Chennai · ₹180/hr",
        imageUrl: "/turf4.jpg",
        icons: ["/wtp1.jpg", "/wtp2.jpg", "/wtp3.jpg"],
    },
    {
        title: "Bangalore Turf",
        subtitle: "Bangalore · ₹120/hr",
        imageUrl: "/turf5.jpg",
        icons: ["/wtp1.jpg", "/wtp2.jpg", "/wtp3.jpg"],
    },
    {
        title: "Delhi Football Ground",
        subtitle: "Delhi · ₹160/hr",
        imageUrl: "/turf6.jpg",
        icons: ["/wtp1.jpg", "/wtp2.jpg", "/wtp3.jpg"],
    },
];

export default function PlayPage() {
    const [sport] = useState("All");
    const [location] = useState("All");


    const filteredCards = cards.filter(card => {
        const matchSport = sport === "All" || card.title.toLowerCase().includes(sport.toLowerCase());
        const matchLocation = location === "All" || card.subtitle.toLowerCase().includes(location.toLowerCase());
        return matchSport && matchLocation;
    });

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredCards.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            subtitle={card.subtitle}
                            imageUrl={card.imageUrl}
                            icons={card.icons}
                        >
                            <Button>PLAY NOW</Button>
                        </Card>
                    ))}
                </div>
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
            {/* ===== AD SLIDER SECTION ===== */}
            <section className="w-full mt-10">
                <AdSlider />
            </section>
            {/* ===== FOOTER SECTION ===== */}
            <Footer />

        </>
    );
}

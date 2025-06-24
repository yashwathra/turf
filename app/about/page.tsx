// app/about/page.tsx
"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import Button from "@/components/common/Button";
import ContactFormModal from "@/components/common/ContactFormModal";

import Image from "next/image";

export default function AboutPage() {
  return (  
    <>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section
        className="relative w-full bg-cover bg-center -mt-[88px] pt-0 h-[500px] flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        <div className="text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">About Our Platform</h1>
          <p className="text-lg font-medium max-w-2xl mx-auto">
            Discover how we are changing the game. Play, book, and enjoy sports like never before — anywhere, anytime.
          </p>
          <div className="mt-6">
            <Button><Link href="/">GET STARTED</Link></Button>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-10">Who We Are</h2>
        <p className="text-lg text-gray-700 text-center leading-relaxed max-w-3xl mx-auto">
          We are a passionate team of sports enthusiasts who wanted to make it easy for everyone to book playgrounds and turfs online.
          Whether you play football, cricket, or badminton — our platform helps you discover nearby locations, book them easily, and enjoy the game stress-free.
        </p>
      </section>

      {/* ===== MISSION SECTION ===== */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
  src="/team.jpg"
  alt="Team working"
  width={600}
  height={400}
  className="rounded-xl shadow-lg w-full h-auto object-cover"
/>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              We want to build a bridge between sports lovers and available playgrounds using technology.
              Our mission is to help you:
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-600 space-y-2">
              <li>Find the best places to play sports</li>
              <li>Book easily with transparent pricing</li>
              <li>Save time and avoid confusion</li>
              <li>Support community growth through sports</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
  <h3 className="text-2xl font-bold text-red-600 mb-6">Have Questions?</h3>
  <p className="text-gray-700 mb-6">
    Wed love to hear from you! Reach out by filling the quick form below.
  </p>
  <ContactFormModal />
</section>

      <Footer />
    </>
  );
}

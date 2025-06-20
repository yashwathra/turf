'use client';

import Image from 'next/image';
import searchIcon from '@/public/search.svg';

interface SearchBoxProps {
  sports?: string[];
  cities?: string[];
  timeslots?: string[];
  rates?: string[];
}

export default function SearchBox({
  sports = ['Football', 'Cricket'],
  cities = ['Jaipur', 'Mumbai'],
  timeslots = ['1AM - 2AM', '2AM - 3AM'],
  rates = ['800₹/hr'],
}: SearchBoxProps) {
  return (
    <section className="relative z-10 -mt-20 flex justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl px-6 py-6 w-full max-w-5xl flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center justify-center">
        
        <select className="border px-4 py-2 rounded-md w-full md:w-auto">
          {sports.map((sport) => (
            <option key={sport}>{sport}</option>
          ))}
        </select>

        <select className="border px-4 py-2 rounded-md w-full md:w-auto">
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>

        <input
          type="date"
          className="border px-4 py-2 rounded-md w-full md:w-auto"
        />

        <select className="border px-4 py-2 rounded-md w-full md:w-auto">
          {timeslots.map((slot) => (
            <option key={slot}>{slot}</option>
          ))}
        </select>

        <select className="border px-4 py-2 rounded-md w-full md:w-auto">
          {rates.map((rate) => (
            <option key={rate}>{rate}</option>
          ))}
        </select>

        <button className="bg-red-600 text-white px-6 py-4 rounded-lg w-full md:w-auto flex items-center justify-center gap-2">
          <Image src={searchIcon} alt="Search" width={24} height={24} />
          <span className="hidden md:inline text-lg font-medium">Search</span>
        </button>
      </div>
    </section>
  );
}

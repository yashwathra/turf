'use client';

import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [selectedSport, setSelectedSport] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedRate, setSelectedRate] = useState('');
  const [showResult, setShowResult] = useState(false);

  // ✅ Prefill values from query params
  useEffect(() => {
  if (pathname === '/book' && params) {
    const sport = params.get('sport') || '';
    const city = params.get('city') || '';
    const date = params.get('date') || '';
    const slot = params.get('slot') || '';
    const rate = params.get('rate') || '';

    setSelectedSport(sport);
    setSelectedCity(city);
    setSelectedDate(date);
    setSelectedSlot(slot);
    setSelectedRate(rate);

    if (sport && city && date) setShowResult(true);
  }
}, [params, pathname]);

  const handleSearch = () => {
    if (!selectedSport || !selectedCity || !selectedDate) {
      alert('Please fill in sport, city, and date before searching.');
      return;
    }

    const searchParams = new URLSearchParams({
      sport: selectedSport,
      city: selectedCity,
      date: selectedDate,
      slot: selectedSlot,
      rate: selectedRate,
    });

    router.push(`/book?${searchParams.toString()}`);
    setShowResult(true);
  };

  const isBookingPage = pathname === '/book';

  return (
    <section className="relative z-10 -mt-20 flex justify-center px-4 transition-all duration-500">
      <div className={`bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-6xl transition-all duration-500 ${showResult ? 'max-h-[2000px]' : 'max-h-[400px]'}`}>
        
        {/* 🔍 Filter Fields */}
        <div className="px-6 py-6 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center justify-center">
          <select
            className="border px-4 py-2 rounded-md w-full md:w-auto"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">Select Sport</option>
            {sports.map((sport) => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>

          <select
            className="border px-4 py-2 rounded-md w-full md:w-auto"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <input
            type="date"
            min={new Date().toISOString().split("T")[0]} // ✅ Prevent past dates
            className="border px-4 py-2 rounded-md w-full md:w-auto"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded-md w-full md:w-auto"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="">Select Time</option>
            {timeslots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>

          <select
            className="border px-4 py-2 rounded-md w-full md:w-auto"
            value={selectedRate}
            onChange={(e) => setSelectedRate(e.target.value)}
          >
            <option value="">Select Rate</option>
            {rates.map((rate) => (
              <option key={rate} value={rate}>{rate}</option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-red-600 text-white px-6 py-4 rounded-lg w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Image src={searchIcon} alt="Search" width={24} height={24} />
            <span className="hidden md:inline text-lg font-medium">Search</span>
          </button>
        </div>

        {/* 📅 Search Result Table */}
        {isBookingPage && showResult && (
          <div className="w-full px-6 pb-10 overflow-x-auto">
            <div className="w-full min-w-[900px]">
              <div className="grid grid-cols-8 gap-2 mb-4">
                <span className="font-semibold text-gray-600">TIME</span>
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <span key={day} className="font-semibold text-center text-gray-600">{day}</span>
                ))}
              </div>

              {[
                '6AM - 7AM', '7AM - 8AM', '8AM - 9AM', '9AM - 10AM', '10AM - 11AM',
                '11AM - 12PM', '12PM - 1PM', '1PM - 2PM', '2PM - 3PM', '3PM - 4PM',
                '4PM - 5PM', '5PM - 6PM', '6PM - 7PM', '7PM - 8PM', '8PM - 9PM',
                '9PM - 10PM', '10PM - 11PM', '11PM - 12AM'
              ].map((slot) => (
                <div key={slot} className="grid grid-cols-8 gap-2 items-center py-1">
                  <span className="text-sm font-medium text-gray-700">{slot}</span>
                  {[...Array(7)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-full h-8 rounded-md flex items-center justify-center text-sm 
                        ${slot === '2PM - 3PM' && idx === 0 ? 'bg-blue-300 text-white' :
                          slot === '4PM - 5PM' && idx === 0 ? 'bg-blue-300 text-white' :
                          'bg-gray-200 text-gray-700'}`}
                    >
                      {slot === '2PM - 3PM' && idx === 0 ? '600' :
                        slot === '4PM - 5PM' && idx === 0 ? '600' : ''}
                    </div>
                  ))}
                </div>
              ))}

              {/* 🧾 Total and Buttons */}
              <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <span>Total Amount -</span>
                  <input
                    readOnly
                    value="1200/-"
                    className="border border-gray-400 rounded-md px-4 py-1 w-32 text-center"
                  />
                </div>

                <div className="flex gap-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-lg">
                    BOOK
                  </button>
                  <button
                    onClick={() => setShowResult(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg text-lg"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

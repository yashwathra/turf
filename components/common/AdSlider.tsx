'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const ads = [
  {
    image: '/turf-image.jpg',
    title: 'WTP Jaipur Turf',
    subtitle: 'Book Now - ₹100/hr',
  },
  {
    image: '/turf2.jpg',
    title: 'Jawahar Turf',
    subtitle: 'Night Turf - ₹150/hr',
  },
  {
    image: '/turf3.jpg',
    title: 'Elite Sports Ground',
    subtitle: 'Open 24/7',
  },
];

export default function AdSlider() {
  return (
    <div className="relative mt-28">
      {/* 🔴 Red Background Banner */}
      <div className="absolute top-1/2 left-0 w-full h-[140px] bg-red-600 -translate-y-1/2 z-0 " />

      {/* Slider Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          loop
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
        >
          {ads.map((ad, index) => (
            <SwiperSlide key={index}>
              <div className="rounded-3xl overflow-hidden shadow-2xl ">
                <div className="relative w-full h-[260px]">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Transparent Text Box */}
                  <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white px-6 py-4">
                    <h3 className="text-2xl font-bold">{ad.title}</h3>
                    <p className="text-sm mt-1">{ad.subtitle}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

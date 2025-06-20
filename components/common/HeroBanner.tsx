'use client';

import React, { ReactNode } from 'react';

interface HeroBannerProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  children?: ReactNode;
}

export default function HeroBanner({
  title = 'PLAY SPORTS',
  description = 'We Are Redefining Sports.\nBook now from ₹100',
  backgroundImage = '/bg-image.jpg',
  children,
}: HeroBannerProps) {
  return (
    <section className="relative -mt-[88px]">
      {/* 🖼️ Background Image Container */}
      <div
        className="relative w-full h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        {/* 🔲 Black Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* 🌟 Main Content */}
        <div className="relative z-10 flex w-full max-w-6xl flex-col md:flex-row items-center justify-between text-white px-4 sm:px-6 md:px-10 gap-6 text-center md:text-left">
          <div className="max-w-md">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
          </div>

          <div className="max-w-md">
            <p className="text-base sm:text-lg md:text-xl font-semibold whitespace-pre-line">
              {description}
            </p>
            {children && <div className="mt-6">{children}</div>}
          </div>
        </div>

        {/* 🔴 Red Circles - Hide or Resize on Small Screens */}
        <div className="hidden sm:block w-32 sm:w-40 h-32 sm:h-40 bg-red-600 rounded-full absolute top-[90%] left-[25%]" />
        <div className="hidden sm:block w-60 sm:w-80 h-60 sm:h-80 bg-red-600 rounded-full absolute top-[65%] left-10" />
      </div>
    </section>
  );
}

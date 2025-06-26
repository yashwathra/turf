'use client';

import React, { ReactNode } from 'react';
import Image from 'next/image';

interface HeroBannerProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  children?: ReactNode;
  loading?: boolean;
}

export default function HeroBanner({
  title = 'PLAY SPORTS',
  description = 'We Are Redefining Sports.\nBook now from ₹100',
  backgroundImage = '/bg-image.jpg',
  children,
  loading = false, 
}: HeroBannerProps) { 
  return (
    <section className="relative -mt-[88px]">
      <div 
        className={`relative w-full h-[500px] bg-cover bg-center flex items-center justify-center ${
          loading ? 'bg-gray-200 animate-pulse' : ''
        }`}
        style={!loading ? { backgroundImage: `url('${backgroundImage}')` } : {}}
      >
        {!loading && (
          <Image
    src={backgroundImage}
    alt="Sports venue"
    width={1}
    height={1}
    className="hidden"
    priority
  />
        )}

        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between text-white px-4 sm:px-6 md:px-10 gap-8 w-full max-w-6xl text-center md:text-left">
          <div className="max-w-md">
            {loading ? (
              <div className="h-14 sm:h-16 md:h-20 lg:h-24 w-3/4 bg-gray-400 rounded animate-pulse mx-auto md:mx-0" />
            ) : (
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {title}
              </h1>
            )}
          </div>

          <div className="max-w-md">
            {loading ? (
              <>
                <div className="h-4 w-full bg-gray-300 rounded mb-2" />
                <div className="h-4 w-5/6 bg-gray-300 rounded mb-4" />
              </>
            ) : (
              <>
                <p className="text-base sm:text-lg md:text-xl font-semibold whitespace-pre-line">
                  {description}
                </p>
                {children && <div className="mt-6">{children}</div>}
              </>
            )}
          </div>
        </div>

        {/* Red decorative circles */}
        {!loading && (
          <>
            <div
              className="hidden sm:block bg-red-600 rounded-full absolute z-0
                w-32 h-32 top-[85%] left-[20%]
                md:w-40 md:h-40 md:top-[80%] md:left-[27%]
                lg:w-48 lg:h-48 lg:top-[75%] lg:left-[30%]
                xl:top-[81%] xl:left-[27%]"
              role="presentation"
              aria-hidden="true"
            />
            <div
              className="hidden sm:block bg-red-600 rounded-full absolute z-0
                w-60 h-60 top-[60%] left-[5%]
                md:w-72 md:h-72 md:top-[58%] md:left-[7%]
                lg:w-80 lg:h-80 lg:top-[55%] lg:left-[9%]
                xl:top-[61%] xl:left-[6%]"
              role="presentation"
              aria-hidden="true"
            />
          </>
        )}
      </div>
    </section>
  );
}


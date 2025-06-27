"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface CardProps {
  id?: string;
  title: string;
  subtitle?: string; // Will be used as City here
  description?: string;
  imageUrl?: string;
  sports?: string[];
  children?: React.ReactNode;
  showDots?: boolean;
}

export default function Card({
  id,
  title,
  subtitle,
  description,
  imageUrl,
  sports = [],
  children,
 
}: CardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (id) {
      router.push(`/turf/${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-2xl border border-gray-300 shadow-xl w-full 
               overflow-hidden transition-transform hover:scale-105 max-w-sm mx-auto"
    >
      {/* 🖼 Image Section with Title and City overlayed */}
      {imageUrl && (
        <div className="relative px-4 pt-4">
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={200}
            className="w-full h-40 sm:h-48 md:h-52 object-cover rounded-lg"
          />

          {/* City (Top Right) */}
          {subtitle && (
            <div className="absolute top-6 right-8 bg-white/70 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-800 rounded-xl shadow">
              📍 {subtitle}
            </div>
          )}

          {/* Title (Bottom Left) */}
          <div className="absolute bottom-4 left-8 bg-white/70 backdrop-blur px-4 py-1 rounded-xl shadow">
            <h2 className="text-sm sm:text-base font-bold text-gray-800">{title}</h2>
          </div>
        </div>
      )}

      {/* 📄 Description + Tags + Button */}
      <div className="p-4">
  {/* Description */}
  {description && (
    <p className="text-xs sm:text-sm text-gray-600 mb-3">{description}</p>
  )}

  {/* Sports Tags */}
  {sports.length > 0 && (
    <div className="flex flex-wrap gap-2 mb-4">
      {sports.map((sport, index) => (
        <span
          key={index}
          className="bg-red-100 text-red-600 px-3 py-1 rounded-full 
                     text-[10px] sm:text-xs font-semibold"
        >
          {sport}
        </span>
      ))}
    </div>
  )}

  {/* ✅ Button aligned right in flow */}
  {children && (
    <div className="flex justify-end mt-4">
      {children}
    </div>
  )}

  
</div>

    </div>
  );
}

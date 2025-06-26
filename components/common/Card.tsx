"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface CardProps {
  id?: string; 
  title: string;
  subtitle?: string;
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
  showDots = true,
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
  {/* 🖼 Image */}
  {imageUrl && (
    <div className="px-4 pt-4">
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={200}
        className="w-full h-40 sm:h-48 md:h-52 object-cover rounded-lg"
      />
    </div>
  )}

  {/* 📄 Content */}
  <div className="p-4 text-center">
    <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    {description && (
      <p className="text-xs sm:text-sm text-gray-600 mt-2">{description}</p>
    )}

    <div className="mt-4 flex justify-center">{children}</div>

    {/* 🏷 Sports Tags */}
    {sports.length > 0 && (
      <div className="flex justify-center flex-wrap gap-2 mt-4">
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

    {/* 🔴 Dots */}
    {showDots && (
      <div className="flex justify-center gap-2 mt-4">
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-600 rounded-sm" />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-600 rounded-sm" />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-600 rounded-sm" />
      </div>
    )}
  </div>
</div>

  );
}

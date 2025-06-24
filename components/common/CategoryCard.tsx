"use client";

import Image from "next/image";

interface CategoryCardProps {
  name: string;
  icon: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function CategoryCard({ name, icon, selected, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={`w-[250px] h-[190px] bg-white border rounded-2xl shadow-md flex items-center overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
        selected ? "ring-4 ring-red-500" : ""
      }`}
    >
      <div className="w-[100px] h-full bg-red-600 rounded-r-full flex items-center justify-center">
        <Image src={icon} alt={name} width={32} height={32} />
      </div>
      <div className="flex-1 px-3 text-center">
        <p className="text-base font-bold text-gray-800">{name}</p>
      </div>
    </div>
  );
}

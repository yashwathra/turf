'use client';

interface CategoryCardProps {
  name: string;
  icon: string;
}

export default function CategoryCard({ name, icon }: CategoryCardProps) {
  return (
    <div className="w-[250px] h-[190px] bg-white border rounded-2xl shadow-md flex items-center overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* 🔴 Full half-circle red side */}
      <div className="w-[100px] h-full bg-red-600 rounded-r-full flex items-center justify-center">
        <img src={icon} alt={name} className="w-8 h-8" />
      </div>

      {/* 📝 Game name */}
      <div className="flex-1 px-3 text-center">
        <p className="text-base font-bold text-gray-800">{name}</p>
      </div>
    </div>
  );
}

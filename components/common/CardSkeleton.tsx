export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-300 shadow-xl w-full overflow-hidden max-w-sm mx-auto animate-pulse">
      {/* 🖼 Image Skeleton with overlay positions */}
      <div className="relative px-4 pt-4">
        {/* Image Placeholder */}
        <div className="w-full h-40 sm:h-48 md:h-52 bg-gray-200 rounded-lg" />

        {/* City (top right) */}
        <div className="absolute top-6 right-8 bg-gray-300 w-24 h-5 rounded-xl" />

        {/* Title (bottom left) */}
        <div className="absolute bottom-4 left-8 bg-gray-300 w-32 h-6 rounded-xl" />
      </div>

      {/* 📄 Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Description */}
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />

        {/* Sports Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-16 bg-gray-200 rounded-full" />
          ))}
        </div>

        {/* Right-Aligned Button */}
        <div className="flex justify-end mt-4">
          <div className="h-9 w-24 bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

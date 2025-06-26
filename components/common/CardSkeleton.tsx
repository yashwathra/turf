export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-300 shadow-xl w-full overflow-hidden max-w-sm mx-auto animate-pulse">
      {/* Image skeleton */}
      <div className="px-4 pt-4">
        <div className="w-full h-40 sm:h-48 md:h-52 bg-gray-200 rounded-lg" />
      </div>

      {/* Text content skeleton */}
      <div className="p-4 text-center space-y-2">
        <div className="h-5 w-3/4 bg-gray-300 rounded mx-auto" />
        <div className="h-3 w-1/2 bg-gray-200 rounded mx-auto" />
        <div className="h-3 w-5/6 bg-gray-200 rounded mx-auto mt-2" />

        {/* Child button area */}
        <div className="h-10 w-28 bg-gray-300 rounded mx-auto mt-4" />

        {/* Tags (sports) */}
        <div className="flex justify-center flex-wrap gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-16 bg-gray-200 rounded-full" />
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-3 h-3 bg-gray-300 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";

interface CardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  children?: React.ReactNode;
  icons?: string[];
  showDots?: boolean; // Optional
}

export default function Card({ title, subtitle, imageUrl, children, icons, showDots = true }: CardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-300 shadow-xl w-full max-w-sm overflow-hidden transition-transform hover:scale-105">
      {imageUrl && (
        <div className="px-4 pt-4">
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={200}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 text-center">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 text-center mt-1">{subtitle}</p>}

        <div className="mt-4 flex justify-center">{children}</div>

        {icons && icons.length > 0 && (
          <div className="flex justify-center gap-6 mt-4">
            {icons.map((icon, index) => (
              <Image
                key={index}
                src={icon}
                alt={`icon-${index}`}
                width={40}
                height={40}
                className="rounded-full"
              />
            ))}
          </div>
        )}

        {showDots && (
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-3 h-3 bg-red-600 rounded-sm" />
            <div className="w-3 h-3 bg-red-600 rounded-sm" />
            <div className="w-3 h-3 bg-red-600 rounded-sm" />
          </div>
        )}
      </div>
    </div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const base = "px-4 py-2 rounded-full font-semibold transition";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-white text-red-600 border border-red-600 hover:bg-red-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

interface ShapeProps {
  className?: string;
}

export default function Shape({ className = "" }: ShapeProps) {
  return <div className={`absolute ${className}`} />;
}

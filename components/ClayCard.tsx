import { ReactNode } from "react";

interface ClayCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ClayCard({ children, className = "", onClick }: ClayCardProps) {
  return (
    <div
      className={`clay-card ${onClick ? "cursor-pointer hover:-translate-y-1" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

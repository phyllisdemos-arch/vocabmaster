import { ReactNode } from "react";

interface ClayButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "orange" | "green";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function ClayButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: ClayButtonProps) {
  const variantClass = {
    primary: "clay-btn",
    orange: "clay-btn clay-btn-orange",
    green: "clay-btn clay-btn-green",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

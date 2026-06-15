import React from "react";

interface LiveProjectButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export default function LiveProjectButton({ label = "Xem Dự Án", className = "", onClick }: LiveProjectButtonProps) {
  return (
    <button
      id="live-project-button"
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors cursor-pointer duration-200 ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

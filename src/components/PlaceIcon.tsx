
import React from "react";
import { Trophy, Award, Star } from "lucide-react";

interface PlaceIconProps {
  place: number;
  className?: string;
  size?: number;
}

// Return an icon + color for each place
export function PlaceIcon({ place, className = "", size = 26 }: PlaceIconProps) {
  if (place === 1)
    return (
      <Trophy
        className={`text-yellow-400 bg-white rounded-full p-0.5 shadow ${className}`}
        size={size}
        strokeWidth={2.4}
        fill="#fde047"
      />
    );
  if (place === 2)
    return (
      <Award
        className={`text-gray-400 bg-white rounded-full p-0.5 shadow ${className}`}
        size={size}
        strokeWidth={2.4}
        fill="#e5e7eb"
      />
    );
  if (place === 3)
    return (
      <Star
        className={`text-orange-400 bg-white rounded-full p-0.5 shadow ${className}`}
        size={size}
        strokeWidth={2.4}
        fill="#fbbf24"
      />
    );
  // For 4th+, show number badge
  return (
    <span
      className={`w-[${size}px] h-[${size}px] flex items-center justify-center bg-gray-700 text-white rounded-full text-base font-bold border border-white/20 shadow ${className}`}
      style={{ minWidth: `${size}px`, minHeight: `${size}px` }}
    >
      {place}
    </span>
  );
}

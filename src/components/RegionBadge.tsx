
import React from "react";

interface RegionBadgeProps {
  region?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const REGION_STYLES: Record<
  string,
  { label: string; color: string; gradient: string }
> = {
  NA: {
    label: "NA",
    color: "text-white",
    gradient: "from-emerald-500 via-emerald-600 to-emerald-900",
  },
  EU: {
    label: "EU",
    color: "text-white",
    gradient: "from-purple-500 via-purple-600 to-violet-900",
  },
  ASIA: {
    label: "AS",
    color: "text-white",
    gradient: "from-red-400 via-red-500 to-red-900",
  },
  SA: {
    label: "SA",
    color: "text-white",
    gradient: "from-orange-400 via-orange-600 to-amber-900",
  },
  AF: {
    label: "AF",
    color: "text-white",
    gradient: "from-fuchsia-400 via-fuchsia-600 to-pink-900",
  },
  OCE: {
    label: "OC",
    color: "text-white",
    gradient: "from-teal-400 via-teal-600 to-cyan-900",
  },
};

export function RegionBadge({ region = "NA", className = "", size = "md" }: RegionBadgeProps) {
  const style = REGION_STYLES[region.toUpperCase()] || REGION_STYLES["NA"];
  const px = size === "lg" ? "px-4 py-2" : size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const text = size === "lg"
    ? "text-base font-bold"
    : size === "sm"
    ? "text-xs font-bold"
    : "text-sm font-bold";
  return (
    <span
      className={`rounded-full ${px} ${text} bg-gradient-to-tr ${style.gradient} ${style.color} shadow shadow-black/10 border border-white/20 ${className}`}
    >
      {style.label}
    </span>
  );
}

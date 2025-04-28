import React from "react";
import Spline from "@splinetool/react-spline";

export default function HabitTree({
  position,
  habit,
  streak,
  dull,
  depth = 0,
}) {
  // Increase base scale for larger trees
  const baseScale = 0.7;

  // Keep growth multiplier but make it less dramatic to avoid overlap
  const scaleAddition = Math.min(streak * 0.025, 1.2);
  const scale = baseScale + scaleAddition;

  // Determine tree look based on streak
  const progressClass = dull
    ? "opacity-50" // Dull tree
    : ""; // Regular tree

  // More dramatic height differences for taller trees
  const heightClass =
    streak >= 50
      ? "h-96" // 24rem (384px) - Tailwind's largest standard size
      : streak >= 30
      ? "h-80" // 20rem (320px)
      : streak >= 20
      ? "h-72" // 18rem (288px)
      : streak >= 10
      ? "h-64" // 16rem (256px)
      : "h-56"; // 14rem (224px)

  // Width differences using standard Tailwind classes
  const widthClass =
    streak >= 50
      ? "w-96" // 24rem (384px) - Tailwind's largest standard size
      : streak >= 30
      ? "w-80" // 20rem (320px)
      : streak >= 20
      ? "w-72" // 18rem (288px)
      : streak >= 10
      ? "w-64" // 16rem (256px)
      : "w-56";

  // THIS IS THE KEY FIX - Position directly with pixels, not using calc(50% + ...)
  const left = position[0] * 35;

  return (
    <div
      className="absolute"
      style={{
        left: `${left}px`, // Direct pixel positioning instead of calc(50% + ...)
        bottom: `${depth * 15}px`,
        transform: `scale(${scale})`,
        transformOrigin: "bottom center", // Set transform origin to bottom center
        zIndex: Math.floor(streak / 10),
        // Ensure pointer events work
        pointerEvents: "none",
      }}
    >
      <div className={`relative ${widthClass} ${heightClass} ${progressClass}`}>
        <Spline
          scene="https://prod.spline.design/36bZDBFA60N1yRVm/scene.splinecode"
          className="w-full h-full pointer-events-none bg-none" // Add pointer-events-auto here
        />

        {/* Streak indicator */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       px-3 py-1 rounded-full
                      border border-green-400/30 text-white font-semibold text-sm"
        >
          {habit.name} ({streak})
        </div>
      </div>
    </div>
  );
}

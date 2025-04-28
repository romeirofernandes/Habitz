import React from "react";
import HabitTree from "./HabitTree";

export default function HabitForest3D({ habits }) {
  // Increase spacing between trees for more spread
  const spacing = 6; // Even wider spacing

  // For dull trees (if streak is 0)
  const isDull = (habit) => !habit.currentStreak || habit.currentStreak < 1;

  // Generate tree props with more dynamic positioning
  const treeProps = habits.map((habit, idx) => {
    // Add slight variation to positioning to make forest look natural
    const jitterX = Math.sin(idx * 1.5) * 0.8;

    return {
      position: [idx * spacing + jitterX, 0, 0],
      habit,
      streak: habit.currentStreak || 0,
      dull: isDull(habit),
      // Add depth variation for visual interest
      depth: idx % 3, // More depth variations (0, 1, 2)
    };
  });

  // Calculate minimum width for scrolling (based on tree count)
  // Add padding to ensure we have enough room
  const minWidth = Math.max(habits.length * spacing * 28 + 80, 800); // slightly smaller

  return (
    <div className="relative w-full mb-6">
      {/* Header/Navbar - MOVED OUTSIDE */}
      <div className="w-full bg-gradient-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-md p-2 text-white shadow-lg border-b border-emerald-400/30 rounded-t-xl">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-lg flex items-center justify-center bg-white/20 rounded-full">
              🌱
            </div>
            <span className="font-semibold text-sm">Forest Growth</span>
          </div>
          <span className="text-xs ml-2 font-medium text-white/90">
            Reach 50 days for giant trees! ✨
          </span>
        </div>
      </div>

      {/* Forest container - SEPARATED FROM NAVBAR */}
      <div className="relative w-full h-[520px] bg-gradient-to-b from-sky-900/20 to-emerald-900/10 rounded-b-xl overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent"></div>

        {/* Sky */}
        <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-sky-700/20 to-transparent"></div>

        {/* Ground with more earthy texture */}
        <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-amber-900/30 to-transparent">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>
        </div>

        {/* Scrollable container - ISOLATED */}
        <div className="relative h-full w-full overflow-x-auto">
          {/* Forest content */}
          <div
            className="relative h-full flex items-end pl-4"
            style={{
              width: `${minWidth}px`, // Set explicit width for scrolling
              transform: "rotateX(5deg) translateY(-10px)",
              transformOrigin: "bottom",
            }}
          >
            {/* Render all trees */}
            {treeProps.map((props, idx) => (
              <HabitTree key={props.habit._id || idx} {...props} />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-4 right-4 text-white/70 text-xs bg-black/30 
                       px-2 py-1 rounded-full backdrop-blur-sm z-50"
        >
          Scroll to see more →
        </div>
      </div>
    </div>
  );
}

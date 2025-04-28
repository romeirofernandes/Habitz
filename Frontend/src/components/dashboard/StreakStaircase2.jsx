import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Character avatar that appears on the current step
 */
const CharacterAvatar = ({ isActive }) => {
  return (
    <motion.div
      className="relative w-12 h-12"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Character container with glow effect */}
      <div className="relative">
        <motion.div
          className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 blur-sm"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Character body */}
        <div className="relative z-10 bg-[#0a0a0a] w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#A2BFFE]">
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-xl"
          >
            😎
          </motion.div>
        </div>

        {/* Energy trail/glow */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-6"
          style={{
            background:
              "linear-gradient(to bottom, rgba(162, 191, 254, 0.8), transparent)",
          }}
          animate={{
            height: [6, 12, 6],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>
    </motion.div>
  );
};

const StreakStaircase2 = ({ streak = 0 }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 6 });
  const [animation, setAnimation] = useState(true);

  // Helper to detect mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  useEffect(() => {
    if (isMobile) {
      // Show only 3 steps at a time on mobile
      if (streak <= 3) {
        setVisibleRange({ start: 0, end: 3 });
      } else {
        const end = streak;
        const start = Math.max(0, end - 3);
        setVisibleRange({ start, end });
      }
    } else {
      // Desktop/tablet: show up to 7 steps
      if (streak <= 7) {
        setVisibleRange({ start: 0, end: 7 });
      } else {
        const end = streak;
        const start = Math.max(0, end - 7);
        setVisibleRange({ start, end });
      }
    }

    const timer = setTimeout(() => setAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, [streak, isMobile]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-black rounded-xl shadow-2xl border border-[#222] p-6 h-[400px]">
      {/* Background ambient effects */}
      <div className="absolute inset-0 overflow-hidden opacity-90">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-900/0 to-slate-900/0"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#A2BFFE]/20 via-slate-900/0 to-slate-900/0"></div>

        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-[#A2BFFE]/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />

        <motion.div
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-cyan-600/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            delay: 2,
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#f5f5f7]">Day {streak}</h3>
          <p className="text-sm text-[#f5f5f7]/60">
            {streak > 0
              ? `${Math.floor(streak / 7)} ${
                  Math.floor(streak / 7) === 1 ? "Week" : "Weeks"
                }, ${streak % 7} ${streak % 7 === 1 ? "Day" : "Days"}`
              : "Start your streak!"}
          </p>
        </div>

        <motion.div
          className="relative group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-[#A2BFFE] rounded-lg blur opacity-50 group-hover:opacity-80 transition duration-300" />
          <div className="relative bg-gradient-to-br from-[#0a0a0a]/90 to-[#1a1a1a]/70 px-4 py-2 rounded-lg border border-[#A2BFFE]/30 shadow-inner">
            <span className="text-xl font-bold text-[#A2BFFE]">{streak}</span>
            <span className="ml-2 text-sm text-[#f5f5f7]/60">day streak</span>
          </div>
        </motion.div>
      </div>

      {/* Staircase visualization */}
      <div className="relative h-[200px] w-full">
        {/* Steps container with 3D perspective */}
        <div
          className="relative w-full h-full flex items-center justify-center pt-12 pr-16"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Staircase container - adding this wrapper div for centering */}
          <div className="relative">
            {Array.from({ length: visibleRange.end - visibleRange.start }).map(
              (_, i) => {
                const stepIndex = i + visibleRange.start;
                const dayNumber = stepIndex + 1;

                // Calculate total width and height of staircase
                const totalSteps = visibleRange.end - visibleRange.start;
                const totalWidth = (totalSteps - 1) * 60;
                const totalHeight = (totalSteps - 1) * 30;

                // Position each step in a staircase pattern
                // Offset by half the total dimensions to center
                const bottom = i * 30 - totalHeight / 2;
                const left = i * 60 - totalWidth / 2;

                // Special styling for different types of days
                const isCurrentDay = dayNumber === streak;
                const isMilestone = dayNumber % 7 === 0;
                const isSpecialMilestone =
                  dayNumber % 21 === 0 || dayNumber % 10 === 0;

                return (
                  <motion.div
                    key={stepIndex}
                    className="absolute"
                    style={{
                      bottom: `${bottom}px`,
                      left: `${left}px`,
                      zIndex: 10 - i,
                    }}
                    initial={
                      animation
                        ? { opacity: 0, y: 20, scale: 0.8 }
                        : { opacity: 1 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: animation ? i * 0.1 : 0,
                      duration: 0.5,
                    }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    {/* Step platform */}
                    <motion.div
                      className={`relative w-24 h-24 flex items-center justify-center cursor-pointer
                ${
                  isSpecialMilestone
                    ? "bg-gradient-to-br from-[#A2BFFE]/90 to-fuchsia-600/80"
                    : isMilestone
                    ? "bg-gradient-to-br from-[#A2BFFE]/80 to-blue-600/70"
                    : isCurrentDay
                    ? "bg-gradient-to-br from-emerald-500/80 to-green-600/70"
                    : "bg-gradient-to-br from-[#222]/90 to-[#1a1a1a]/80"
                } 
                rounded-lg border border-white/10 shadow-lg`}
                      whileHover={{
                        boxShadow: isSpecialMilestone
                          ? "0 0 15px rgba(162, 191, 254, 0.6)"
                          : isMilestone
                          ? "0 0 10px rgba(162, 191, 254, 0.5)"
                          : isCurrentDay
                          ? "0 0 10px rgba(16, 185, 129, 0.5)"
                          : "0 0 5px rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      {/* Content container */}
                      <div className="flex flex-col items-center justify-center">
                        {/* Day number */}
                        <span
                          className={`text-xl font-bold ${
                            isSpecialMilestone || isMilestone
                              ? "text-white"
                              : "text-[#f5f5f7]"
                          } drop-shadow-lg`}
                        >
                          {dayNumber}
                        </span>

                        {/* Badge for milestones */}
                        {isSpecialMilestone && (
                          <motion.div
                            className="mt-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold flex items-center gap-1"
                            animate={{
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          >
                            <span>{dayNumber % 10 === 0 ? "🏆" : "🌟"}</span>
                            <span>
                              {dayNumber % 10 === 0
                                ? `M${dayNumber / 10}`
                                : `W${Math.ceil(dayNumber / 7)}`}
                            </span>
                          </motion.div>
                        )}

                        {isMilestone && !isSpecialMilestone && (
                          <span className="mt-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold">
                            W{Math.ceil(dayNumber / 7)}
                          </span>
                        )}
                      </div>

                      {/* Glow effect for current day */}
                      {isCurrentDay && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none rounded-lg"
                          animate={{
                            opacity: [0.3, 0.7, 0.3],
                            boxShadow: [
                              "0 0 10px rgba(16, 185, 129, 0.4)",
                              "0 0 20px rgba(16, 185, 129, 0.7)",
                              "0 0 10px rgba(16, 185, 129, 0.4)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Connector between steps */}
                    {i < visibleRange.end - visibleRange.start - 1 && (
                      <motion.div
                        className="absolute h-8 w-1"
                        style={{
                          bottom: "0px",
                          left: "50%",
                          transform:
                            "translateY(100%) translateX(-50%) rotate(30deg)",
                          transformOrigin: "top",
                          background:
                            "linear-gradient(to bottom, rgba(162, 191, 254, 0.5), transparent)",
                        }}
                      />
                    )}
                  </motion.div>
                );
              }
            )}

            {/* Character avatar on current step */}
            {streak > 0 && (
              <motion.div
                className="absolute z-50"
                style={{
                  // Adjust avatar position with the same centering offset
                  bottom: `${
                    (streak - visibleRange.start - 1) * 30 -
                    ((visibleRange.end - visibleRange.start - 1) * 30) / 2 +
                    25
                  }px`,
                  left: `${
                    (streak - visibleRange.start - 1) * 60 -
                    ((visibleRange.end - visibleRange.start - 1) * 60) / 2 +
                    12
                  }px`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animation ? 0.5 : 0 }}
              >
                <CharacterAvatar isActive={true} />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/50 backdrop-blur-sm border-t border-[#222] p-3">
        <div className="flex flex-row xs:flex-row items-center justify-center gap-6 xs:gap-3 text-xs sm:text-sm text-[#f5f5f7]/60">
          {[
            { color: "bg-[#222]", label: "Regular" },
            { color: "bg-[#A2BFFE]", label: "Weekly" },
            { color: "bg-emerald-500", label: "Current" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <motion.div
                className={`w-3 h-3 ${item.color} rounded-sm border border-white/10`}
                animate={{
                  boxShadow: [
                    `0 0 1px ${
                      item.color === "bg-[#222]"
                        ? "rgba(255, 255, 255, 0.2)"
                        : item.color === "bg-[#A2BFFE]"
                        ? "rgba(162, 191, 254, 0.3)"
                        : "rgba(16, 185, 129, 0.3)"
                    }`,
                    `0 0 3px ${
                      item.color === "bg-[#222]"
                        ? "rgba(255, 255, 255, 0.4)"
                        : item.color === "bg-[#A2BFFE]"
                        ? "rgba(162, 191, 254, 0.6)"
                        : "rgba(16, 185, 129, 0.6)"
                    }`,
                    `0 0 1px ${
                      item.color === "bg-[#222]"
                        ? "rgba(255, 255, 255, 0.2)"
                        : item.color === "bg-[#A2BFFE]"
                        ? "rgba(162, 191, 254, 0.3)"
                        : "rgba(16, 185, 129, 0.3)"
                    }`,
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakStaircase2;

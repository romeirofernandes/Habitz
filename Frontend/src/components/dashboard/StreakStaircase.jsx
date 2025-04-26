import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Enhanced cube decoration with more dynamic behavior and improved visual effects
const CubeElement = ({ size, color, speed = 1 }) => {
  const colors = {
    blue: "bg-cyan-500/15 border-cyan-500/30",
    indigo: "bg-fuchsia-500/15 border-fuchsia-500/30",
    purple: "bg-purple-500/15 border-purple-500/30",
    teal: "bg-emerald-500/15 border-emerald-500/30",
  }

  return (
    <motion.div
      className="relative"
      style={{ width: `${size}px`, height: `${size}px` }}
      animate={{
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 20 / speed,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      <div
        className={`absolute inset-0 ${colors[color]} rounded-md transform rotate-45 border shadow-lg backdrop-blur-sm`}
      />
      <div
        className={`absolute inset-0 ${colors[color]} rounded-md transform rotate-12 border shadow-lg backdrop-blur-sm`}
      />
      <div
        className={`absolute inset-0 ${colors[color]} rounded-md transform -rotate-12 border shadow-lg backdrop-blur-sm`}
      />
    </motion.div>
  )
}

// Enhanced star burst animation for achievements with more dynamic rays
const StarBurst = ({ visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-16 bg-gradient-to-t from-transparent via-amber-300 to-amber-100"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 0.05 * i,
                ease: "easeOut",
              }}
              style={{
                rotate: `${i * 22.5}deg`,
                transformOrigin: "center bottom",
              }}
            />
          ))}
          {/* Secondary burst layer for depth */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-12 bg-gradient-to-t from-transparent via-white to-white"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 0.8, 0],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 1.2,
                delay: 0.03 * i + 0.2,
                ease: "easeOut",
              }}
              style={{
                rotate: `${i * 30 + 15}deg`,
                transformOrigin: "center bottom",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// New component for the user avatar with enhanced visuals
const UserAvatar = ({ isActive = false }) => {
  return (
    <motion.div
      className="relative"
      animate={{
        y: [0, -5, 0],
        rotate: [0, 3, 0, -3, 0],
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 2.5,
        ease: "easeInOut",
      }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 opacity-70 blur-md"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      {/* Avatar container with gradient border */}
      <div className="relative z-10 w-full h-full rounded-full p-[2px] bg-gradient-to-br from-cyan-400 to-fuchsia-500 shadow-xl">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 p-2 flex items-center justify-center">
          {/* User icon with animated elements */}
          <div className="relative">
            {/* Head */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300 flex items-center justify-center">
              {/* Face features - simplified for small size */}
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
                <motion.div
                  className="w-3 h-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300"
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </div>

            {/* Body - only visible when larger */}
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-3 rounded-t-full bg-gradient-to-r from-cyan-300 to-fuchsia-300"
              animate={{ y: [0, -1, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Animated pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      {/* Energy trail */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-20 origin-top"
        style={{
          background: "linear-gradient(to bottom, rgba(6, 182, 212, 0.8), transparent)",
        }}
        animate={{
          scaleY: [0, 1, 0],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </motion.div>
  )
}

/**
 * @typedef {Object} StreakStaircaseProps
 * @property {number} [streak] - The current streak count
 * @property {number} [goal] - Optional goal for streak (default: 66)
 * @property {string} [title] - Custom title for the component
 */

/**
 * Enhanced component for displaying a visually striking representation of a user's streak
 * @param {StreakStaircaseProps} props - Component props
 */
const StreakStaircase = ({
  streak = 0,
  goal = 66,
  title = "Streak Journey",
  subtitle = "Building habits, one day at a time",
}) => {
  const [showAchievement, setShowAchievement] = useState(false)
  const [animation, setAnimation] = useState(true)

  // Calculate visibility limits and dimensions
  const containerHeight = Math.max(450, Math.min(streak * 15 + 200, 600))
  const visibleSteps = Math.min(streak, 40)
  const progressPercent = Math.min((streak / goal) * 100, 100)

  // Trigger achievement animation on special milestones
  useEffect(() => {
    if (streak > 0 && (streak % 7 === 0 || streak % 10 === 0)) {
      setShowAchievement(true)
      const timer = setTimeout(() => setShowAchievement(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [streak])

  // Calculate milestone and achievement properties
  const isTodayMilestone = streak > 0 && (streak % 7 === 0 || streak % 10 === 0)
  const streakColor = streak >= goal ? "text-emerald-300" : "text-cyan-300"

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-black rounded-xl shadow-2xl border border-cyan-950 relative">
      {/* Enhanced background ambient elements with more dynamic gradients */}
      <div className="absolute inset-0 overflow-hidden opacity-90">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-900/0 to-slate-900/0"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-slate-900/0 to-slate-900/0"></div>
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-fuchsia-600/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-cyan-600/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        />
      </div>

      {/* Enhanced header with glass effect and more vibrant gradients */}
      <div className="relative p-6 border-b border-cyan-900/50 backdrop-blur-sm bg-slate-900/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-cyan-600 to-fuchsia-600 rounded-full blur-lg opacity-70"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="relative z-10 w-10 h-10 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                }}
              >
                <span className="text-2xl">🔥</span>
              </motion.div>
            </div>
            <div>
              <h3 className="font-bold text-xl bg-gradient-to-r from-cyan-300 to-fuchsia-300 text-transparent bg-clip-text mb-0.5">
                {title}
              </h3>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>

          <motion.div
            className="relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg blur opacity-50 group-hover:opacity-80 transition duration-300" />
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/70 px-5 py-3 rounded-lg border border-cyan-500/30 shadow-inner flex items-center gap-3">
              <span className={`text-xl font-bold ${streakColor}`}>{streak}</span>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-300">{streak === 1 ? "Day" : "Days"}</span>
                <span className="text-xs text-slate-400">
                  {Math.ceil(streak / 7)} {Math.ceil(streak / 7) === 1 ? "Week" : "Weeks"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced progress bar with animated glow effects */}
        <div className="mt-6 relative h-2 bg-slate-800/70 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-0 left-0 h-full bg-white/20 rounded-full"
            initial={{ width: 0, opacity: 0.6 }}
            animate={{
              width: `${progressPercent}%`,
              opacity: 0,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Enhanced milestone markers with glow effects */}
          {[25, 50, 75, 100].map((marker) => (
            <motion.div
              key={marker}
              className={`absolute top-1/2 w-1 h-3 -translate-y-1/2 rounded-full ${
                progressPercent >= marker ? "bg-fuchsia-300" : "bg-slate-700"
              }`}
              style={{ left: `${marker}%` }}
              animate={
                progressPercent >= marker
                  ? {
                      boxShadow: ["0 0 2px #d946ef", "0 0 6px #d946ef", "0 0 2px #d946ef"],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          ))}

          {/* Enhanced goal indicator with pulsing effect */}
          <motion.div
            className="absolute top-0 h-full w-1 bg-emerald-400/50 rounded-full"
            style={{ left: `100%` }}
            animate={{
              boxShadow: ["0 0 2px #10b981", "0 0 8px #10b981", "0 0 2px #10b981"],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>Start</span>
          <span>Goal: {goal} days</span>
        </div>
      </div>

      {/* Enhanced achievement overlay with more dynamic animations */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              <StarBurst visible={showAchievement} />
              <motion.div
                className="relative z-10 bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl p-8 border border-fuchsia-500/30 shadow-xl max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <span className="text-5xl">{streak % 10 === 0 ? "🏆" : "🌟"}</span>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {streak % 10 === 0 ? "Major Milestone!" : "Milestone Achieved!"}
                  </h3>
                  <p className="text-fuchsia-200 mb-4">
                    {streak} day streak! {streak % 10 === 0 ? "Incredible dedication!" : "Keep up the great work!"}
                  </p>
                  <div className="flex justify-center">
                    <motion.button
                      className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white px-4 py-2 rounded-md font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAchievement(false)}
                    >
                      Continue
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced 3D staircase container with improved depth effects */}
      <div
        className="relative bg-gradient-to-b from-slate-900/80 to-black/80 backdrop-blur-sm border-b border-slate-800/50 shadow-inner overflow-hidden"
        style={{
          height: `${containerHeight}px`,
          perspective: "1800px",
        }}
      >
        {/* Enhanced ambient floating elements with more dynamic animations */}
        <motion.div
          className="absolute top-10 left-1/4 opacity-40"
          animate={{
            y: [0, 20, 0],
            rotate: [0, 15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <CubeElement size={80} color="blue" speed={0.7} />
        </motion.div>
        <motion.div
          className="absolute top-40 right-1/4 opacity-30"
          animate={{
            x: [0, 30, 0],
            y: [0, -15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <CubeElement size={60} color="indigo" speed={0.5} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-1/3 opacity-20"
          animate={{
            x: [0, -20, 0],
            y: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <CubeElement size={50} color="purple" speed={0.3} />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/3 opacity-25"
          animate={{
            x: [0, 15, 0],
            y: [0, 25, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <CubeElement size={40} color="teal" speed={0.4} />
        </motion.div>

        {/* Enhanced grid lines with improved depth effects and animation */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0px 0px", "25px 25px"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(6, 182, 212, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "25px 25px",
            transform: "perspective(1000px) rotateX(30deg) translateZ(-100px)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Enhanced glow effect at the top with more vibrant colors */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-cyan-500/10 via-fuchsia-500/5 to-transparent" />

        {/* Enhanced staircase scene with improved 3D perspective */}
        <div className="relative h-full p-6">
          <div
            className="relative h-full"
            style={{
              transform: "perspective(1500px) rotateX(35deg) rotateZ(-12deg) translateZ(50px)",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >
            {/* COMPLETELY REDESIGNED STAIR STEPS - now with 3D hexagonal platforms */}
            {Array.from({ length: visibleSteps }).map((_, i) => {
              const bottom = i * 15
              const left = i * 25
              const isMilestone = (i + 1) % 7 === 0
              const isSpecialMilestone = (i + 1) % 21 === 0 || (i + 1) % 10 === 0
              const isCurrentDay = i === streak - 1

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    bottom: `${bottom}px`,
                    left: `${left}px`,
                    zIndex: visibleSteps - i,
                    transformStyle: "preserve-3d",
                  }}
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: animation ? i * 0.03 : 0,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  {/* Hexagonal platform with 3D effects */}
                  <motion.div
                    className="relative"
                    whileHover={{
                      scale: 1.05,
                      z: 10,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {/* Platform shadow */}
                    <div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-black/40 blur-sm"
                      style={{
                        transform: "rotateX(60deg) scale(0.9, 0.6)",
                      }}
                    />

                    {/* Main hexagonal platform */}
                    <div
                      className={`relative flex items-center justify-center ${
                        isSpecialMilestone ? "w-28 h-28" : isMilestone ? "w-24 h-24" : "w-20 h-20"
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Hexagon base */}
                      <div
                        className={`absolute inset-0 ${
                          isSpecialMilestone
                            ? "bg-gradient-to-br from-fuchsia-500/90 to-purple-600/90"
                            : isMilestone
                              ? "bg-gradient-to-br from-cyan-500/90 to-blue-600/90"
                              : isCurrentDay
                                ? "bg-gradient-to-br from-emerald-500/90 to-green-600/90"
                                : "bg-gradient-to-br from-cyan-600/80 to-cyan-800/80"
                        } shadow-lg backdrop-blur-sm border border-white/10`}
                        style={{
                          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                          transformStyle: "preserve-3d",
                          transform: "translateZ(0px)",
                        }}
                      >
                        {/* Inner glow effect */}
                        <motion.div
                          className="absolute inset-0 bg-white/10"
                          animate={{
                            opacity: [0.1, 0.2, 0.1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          style={{
                            clipPath: "polygon(50% 5%, 95% 27.5%, 95% 72.5%, 50% 95%, 5% 72.5%, 5% 27.5%)",
                          }}
                        />
                      </div>

                      {/* 3D side walls for hexagon */}
                      <div
                        className={`absolute w-full h-full ${
                          isSpecialMilestone
                            ? "bg-gradient-to-b from-fuchsia-600/80 to-fuchsia-900/80"
                            : isMilestone
                              ? "bg-gradient-to-b from-cyan-600/80 to-cyan-900/80"
                              : isCurrentDay
                                ? "bg-gradient-to-b from-emerald-600/80 to-emerald-900/80"
                                : "bg-gradient-to-b from-cyan-700/70 to-cyan-950/70"
                        }`}
                        style={{
                          clipPath: "polygon(50% 100%, 0% 75%, 0% 85%, 50% 110%, 100% 85%, 100% 75%)",
                          transform: "translateZ(-10px) translateY(5px)",
                          transformStyle: "preserve-3d",
                        }}
                      />

                      {/* Content container */}
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        {/* Day number with enhanced styling */}
                        <span
                          className={`text-lg font-bold ${
                            isSpecialMilestone || isMilestone ? "text-white" : "text-white"
                          } drop-shadow-lg`}
                        >
                          {i + 1}
                        </span>

                        {/* Enhanced milestone badges */}
                        {isSpecialMilestone && (
                          <motion.div
                            className="mt-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold flex items-center gap-1 shadow-inner"
                            animate={{
                              scale: [1, 1.1, 1],
                              backgroundColor: [
                                "rgba(255,255,255,0.2)",
                                "rgba(255,255,255,0.3)",
                                "rgba(255,255,255,0.2)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          >
                            <span>{(i + 1) % 10 === 0 ? "🏆" : "🌟"}</span>
                            <span>{(i + 1) % 10 === 0 ? `M${(i + 1) / 10}` : `W${Math.ceil((i + 1) / 7)}`}</span>
                          </motion.div>
                        )}
                        {isMilestone && !isSpecialMilestone && (
                          <span className="mt-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold shadow-inner">
                            W{Math.ceil((i + 1) / 7)}
                          </span>
                        )}
                      </div>

                      {/* Enhanced glow effect for current day */}
                      {isCurrentDay && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          animate={{
                            opacity: [0.3, 0.7, 0.3],
                            boxShadow: [
                              "0 0 10px rgba(16, 185, 129, 0.4)",
                              "0 0 20px rgba(16, 185, 129, 0.7)",
                              "0 0 10px rgba185,129,0.4)",
                              "0 0 20px rgba(16,185,129,0.7)",
                              "0 0 10px rgba(16,185,129,0.4)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          style={{
                            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                          }}
                        />
                      )}
                    </div>

                    {/* Enhanced connectors between platforms */}
                    {i < visibleSteps - 1 && (
                      <motion.div
                        className="absolute h-12 w-1"
                        style={{
                          bottom: "0px",
                          left: "50%",
                          transform: "translateY(100%) translateX(-50%)",
                          background: isSpecialMilestone
                            ? "linear-gradient(to bottom, rgba(217, 70, 239, 0.8), transparent)"
                            : isMilestone
                              ? "linear-gradient(to bottom, rgba(6, 182, 212, 0.8), transparent)"
                              : isCurrentDay
                                ? "linear-gradient(to bottom, rgba(16, 185, 129, 0.8), transparent)"
                                : "linear-gradient(to bottom, rgba(8, 145, 178, 0.8), transparent)",
                        }}
                        animate={{
                          opacity: [0.5, 0.9, 0.5],
                          height: [10, 12, 10],
                          boxShadow: [
                            "0 0 2px rgba(255,255,255,0.1)",
                            "0 0 5px rgba(255,255,255,0.3)",
                            "0 0 2px rgba(255,255,255,0.1)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.05,
                        }}
                      />
                    )}
                  </motion.div>
                </motion.div>
              )
            })}

            {/* COMPLETELY REDESIGNED USER AVATAR */}
            {streak > 0 && (
              <motion.div
                className="absolute z-50"
                style={{
                  bottom: `${(visibleSteps - 1) * 15 + 22}px`,
                  left: `${(visibleSteps - 1) * 25 + 10}px`,
                  width: "54px",
                  height: "54px",
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: animation ? visibleSteps * 0.03 + 0.5 : 0, duration: 0.7 }}
              >
                <UserAvatar isActive={true} />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced info footer with improved glass effect and styling */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/30 p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { color: "bg-cyan-500", label: "Regular days" },
            { color: "bg-cyan-500", label: "Weekly milestones" },
            { color: "bg-emerald-500", label: "Current day" },
            { color: "bg-fuchsia-500", label: "Special milestone" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <motion.div
                className={`w-4 h-4 ${item.color} rounded-sm shadow-md border border-white/30`}
                animate={{
                  boxShadow: [
                    `0 0 2px ${item.color.replace("bg-", "rgba(").replace("-500", ", 0.5)")}`,
                    `0 0 6px ${item.color.replace("bg-", "rgba(").replace("-500", ", 0.8)")}`,
                    `0 0 2px ${item.color.replace("bg-", "rgba(").replace("-500", ", 0.5)")}`,
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-xs text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Enhanced info box with improved styling and glow effects */}
        <div className="bg-gradient-to-r from-slate-800/70 to-slate-900/30 p-4 rounded-lg border border-cyan-500/20 shadow-inner backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <motion.div
              className="bg-cyan-500/20 rounded-full p-1 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(6, 182, 212, 0.3)",
                  "0 0 10px rgba(6, 182, 212, 0.6)",
                  "0 0 0px rgba(6, 182, 212, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-cyan-300 text-sm">💡</span>
            </motion.div>
            <div>
              <p className="text-sm font-medium text-cyan-200">
                It takes <span className="font-semibold text-white">66 days</span> on average to form a new habit
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Keep your streak going to build lasting change! You're making great progress.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced animation toggle button with improved styling */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setAnimation(!animation)}
            className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 group"
          >
            <span>{animation ? "Disable" : "Enable"} animations</span>
            <motion.span
              className={`block w-8 h-4 rounded-full ${animation ? "bg-cyan-600" : "bg-slate-700"} relative group-hover:shadow-md group-hover:shadow-cyan-500/30 transition-all duration-300`}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className={`block w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${animation ? "translate-x-4" : "translate-x-0.5"}`}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StreakStaircase

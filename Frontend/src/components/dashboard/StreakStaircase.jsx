import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced cube decoration with more dynamic behavior
const CubeElement = ({ size, color, speed = 1 }) => {
  const colors = {
    blue: "bg-blue-500/15 border-blue-500/30",
    indigo: "bg-indigo-500/15 border-indigo-500/30",
    purple: "bg-purple-500/15 border-purple-500/30",
    teal: "bg-teal-500/15 border-teal-500/30"
  };
  
  return (
    <motion.div 
      className="relative" 
      style={{ width: `${size}px`, height: `${size}px` }}
      animate={{ 
        rotate: [0, 180, 360],
      }}
      transition={{ 
        duration: 20 / speed, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    >
      <div className={`absolute inset-0 ${colors[color]} rounded-md transform rotate-45 border shadow-lg shadow-${color}-500/10`} />
      <div className={`absolute inset-0 ${colors[color]} rounded-md transform rotate-12 border shadow-lg shadow-${color}-500/10`} />
      <div className={`absolute inset-0 ${colors[color]} rounded-md transform -rotate-12 border shadow-lg shadow-${color}-500/10`} />
    </motion.div>
  );
};

// Star burst animation for achievements
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
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-12 bg-gradient-to-t from-transparent via-yellow-300 to-yellow-100"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5,
                delay: 0.05 * i,
                ease: "easeOut"
              }}
              style={{ 
                rotate: `${i * 30}deg`,
                transformOrigin: "center bottom"
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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
  subtitle = "Building habits, one day at a time"
}) => {
  const [showAchievement, setShowAchievement] = useState(false);
  const [animation, setAnimation] = useState(true);
  
  // Calculate visibility limits and dimensions
  const containerHeight = Math.max(450, Math.min(streak * 15 + 200, 600));
  const visibleSteps = Math.min(streak, 40);
  const progressPercent = Math.min((streak / goal) * 100, 100);
  
  // Trigger achievement animation on special milestones
  useEffect(() => {
    if (streak > 0 && (streak % 7 === 0 || streak % 10 === 0)) {
      setShowAchievement(true);
      const timer = setTimeout(() => setShowAchievement(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  // Calculate milestone and achievement properties
  const isTodayMilestone = streak > 0 && (streak % 7 === 0 || streak % 10 === 0);
  const streakColor = streak >= goal ? "text-emerald-300" : "text-blue-300";
  
  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl shadow-2xl border border-indigo-950 relative">
      {/* Background ambient elements */}
      <div className="absolute inset-0 overflow-hidden opacity-80">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-900/0 to-slate-900/0"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/0 to-slate-900/0"></div>
        <motion.div 
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-indigo-600/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>
      
      {/* Header with glass effect */}
      <div className="relative p-6 border-b border-indigo-900/50 backdrop-blur-sm bg-slate-900/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-70"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="relative z-10 w-10 h-10 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 1
                }}
              >
                <span className="text-2xl">🔥</span>
              </motion.div>
            </div>
            <div>
              <h3 className="font-bold text-xl bg-gradient-to-r from-blue-300 to-indigo-300 text-transparent bg-clip-text mb-0.5">
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-50 group-hover:opacity-80 transition duration-300"/>
            <div className="relative bg-gradient-to-br from-slate-900/90 to-indigo-900/70 px-5 py-3 rounded-lg border border-indigo-500/30 shadow-inner flex items-center gap-3">
              <span className={`text-xl font-bold ${streakColor}`}>
                {streak}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-300">
                  {streak === 1 ? "Day" : "Days"}
                </span>
                <span className="text-xs text-slate-400">
                  {Math.ceil(streak / 7)} {Math.ceil(streak / 7) === 1 ? "Week" : "Weeks"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-6 relative h-2 bg-slate-800/70 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute top-0 left-0 h-full bg-white/20 rounded-full"
            initial={{ width: 0, opacity: 0.6 }}
            animate={{ 
              width: `${progressPercent}%`, 
              opacity: 0 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Milestone markers */}
          {[25, 50, 75, 100].map(marker => (
            <div 
              key={marker}
              className={`absolute top-1/2 w-1 h-3 -translate-y-1/2 rounded-full ${
                progressPercent >= marker ? 'bg-indigo-300' : 'bg-slate-700'
              }`}
              style={{ left: `${marker}%` }}
            />
          ))}
          
          {/* Goal indicator */}
          <div 
            className="absolute top-0 h-full w-1 bg-emerald-400/50 rounded-full"
            style={{ left: `100%` }}
          />
        </div>
        
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>Start</span>
          <span>Goal: {goal} days</span>
        </div>
      </div>

      {/* Achievement overlay */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div 
            className="absolute inset-0 bg-indigo-900/30 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              <StarBurst visible={showAchievement} />
              <motion.div
                className="relative z-10 bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl p-8 border border-indigo-500/30 shadow-xl max-w-md"
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
                        rotate: [0, 10, 0, -10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      <span className="text-5xl">{streak % 10 === 0 ? "🏆" : "🌟"}</span>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {streak % 10 === 0 ? "Major Milestone!" : "Milestone Achieved!"}
                  </h3>
                  <p className="text-indigo-200 mb-4">
                    {streak} day streak! {streak % 10 === 0 ? "Incredible dedication!" : "Keep up the great work!"}
                  </p>
                  <div className="flex justify-center">
                    <motion.button
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md font-medium"
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

      {/* Enhanced 3D staircase container */}
      <div 
        className="relative bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-sm border-b border-slate-800/50 shadow-inner overflow-hidden"  
        style={{ 
          height: `${containerHeight}px`,
          perspective: '1500px',
        }}
      >
        {/* Ambient floating elements */}
        <motion.div 
          className="absolute top-10 left-1/4 opacity-40"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, 15, 0],
            x: [0, -10, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <CubeElement size={80} color="blue" speed={0.7} />
        </motion.div>
        <motion.div 
          className="absolute top-40 right-1/4 opacity-30"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -15, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <CubeElement size={60} color="indigo" speed={0.5} />
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-1/3 opacity-20"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <CubeElement size={50} color="purple" speed={0.3} />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-1/3 opacity-25"
          animate={{ 
            x: [0, 15, 0],
            y: [0, 25, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <CubeElement size={40} color="teal" speed={0.4} />
        </motion.div>
        
        {/* Enhanced grid lines with depth effects */}
        <div className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px',
            transform: 'perspective(800px) rotateX(30deg) translateZ(-100px)',
            transformStyle: 'preserve-3d'
          }}
        />
        
        {/* Glow effect at the top */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-indigo-500/10 to-transparent" />
        
        {/* Staircase scene */}
        <div className="relative h-full p-6">
          <div 
            className="relative h-full"
            style={{ 
              transform: 'perspective(1200px) rotateX(35deg) rotateZ(-12deg) translateZ(50px)', 
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center'
            }}
          >
            {/* Stair steps with enhanced visuals */}
            {Array.from({ length: visibleSteps }).map((_, i) => {
              const bottom = i * 15;
              const left = i * 25;
              const isMilestone = (i + 1) % 7 === 0;
              const isSpecialMilestone = (i + 1) % 21 === 0 || (i + 1) % 10 === 0;
              const isCurrentDay = i === streak - 1;
              
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ 
                    bottom: `${bottom}px`, 
                    left: `${left}px`,
                    zIndex: visibleSteps - i,
                    transformStyle: 'preserve-3d'
                  }}
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: animation ? i * 0.03 : 0, 
                    duration: 0.6, 
                    ease: "easeOut"
                  }}
                >
                  <motion.div 
                    className={`flex items-center ${
                      isSpecialMilestone ? 'w-32 h-14' : isMilestone ? 'w-28 h-12' : 'w-24 h-10'
                    } rounded-md shadow-xl relative overflow-hidden group`}
                    whileHover={{ 
                      scale: 1.05,
                      rotateX: "-5deg",
                      z: 10
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    style={{
                      background: isSpecialMilestone
                        ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(99, 102, 241, 0.9) 100%)'
                        : isMilestone 
                          ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(59, 130, 246, 0.9) 100%)' 
                          : isCurrentDay
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)'
                            : 'linear-gradient(135deg, rgba(30, 64, 175, 0.8) 0%, rgba(30, 58, 138, 0.8) 100%)',
                      boxShadow: isCurrentDay || isMilestone || isSpecialMilestone
                        ? '0 0 15px rgba(99, 102, 241, 0.6), 0 4px 6px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2)'
                        : '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
                      backdropFilter: 'blur(4px)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    
                    {/* Side wall effect for 3D appearance */}
                    <div 
                      className="absolute w-full h-6 origin-bottom" 
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transform: 'rotateX(-90deg) translateY(100%)',
                        background: isSpecialMilestone
                          ? 'linear-gradient(to bottom, rgba(147, 51, 234, 0.7), rgba(147, 51, 234, 0.2))'
                          : isMilestone 
                            ? 'linear-gradient(to bottom, rgba(79, 70, 229, 0.7), rgba(79, 70, 229, 0.2))' 
                            : isCurrentDay
                              ? 'linear-gradient(to bottom, rgba(16, 185, 129, 0.7), rgba(16, 185, 129, 0.2))'
                              : 'linear-gradient(to bottom, rgba(30, 64, 175, 0.7), rgba(30, 64, 175, 0.2))',
                      }}
                    />
                    
                    <div className={`w-3 h-full ${
                      isSpecialMilestone ? 'bg-purple-300' : 
                      isMilestone ? 'bg-indigo-300' : 
                      isCurrentDay ? 'bg-emerald-300' : 'bg-blue-300'
                    } rounded-l shadow-lg`} />
                    
                    <span className={`text-sm font-bold text-white ml-2 drop-shadow-xl ${
                      isSpecialMilestone || isMilestone ? 'text-white' : ''
                    }`}>
                      {i + 1}
                    </span>
                    
                    {isSpecialMilestone && (
                      <motion.span 
                        className="ml-auto mr-2 text-xs font-bold bg-white/30 rounded-full px-3 py-0.5 flex items-center gap-1 shadow-inner"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          backgroundColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.3)"]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity
                        }}
                      >
                        <span className="text-lg">{(i + 1) % 10 === 0 ? "🏆" : "🌟"}</span>
                        <span>
                          {(i + 1) % 10 === 0 ? `Milestone ${(i + 1) / 10}` : `Week ${Math.ceil((i + 1) / 7)}`}
                        </span>
                      </motion.span>
                    )}
                    {isMilestone && !isSpecialMilestone && (
                      <span className="ml-auto mr-2 text-xs font-bold bg-white/20 rounded-full px-2 py-0.5 shadow-inner">
                        Week {Math.ceil((i + 1) / 7)}
                      </span>
                    )}
                    
                    {/* Glow effect for current day */}
                    {isCurrentDay && (
                      <motion.div 
                        className="absolute inset-0 rounded-md bg-emerald-400/20 pointer-events-none"
                        animate={{ 
                          opacity: [0.2, 0.6, 0.2]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Enhanced connectors between stairs */}
                  {i < visibleSteps - 1 && (
                    <motion.div 
                      className="absolute h-5 w-2 rounded-b"
                      style={{ 
                        bottom: '0px',
                        left: '15px',
                        transform: 'translateY(100%)',
                        background: isSpecialMilestone
                          ? 'linear-gradient(to bottom, rgba(147, 51, 234, 0.8), transparent)'
                          : isMilestone 
                            ? 'linear-gradient(to bottom, rgba(79, 70, 229, 0.8), transparent)' 
                            : isCurrentDay
                              ? 'linear-gradient(to bottom, rgba(16, 185, 129, 0.8), transparent)'
                              : 'linear-gradient(to bottom, rgba(59, 130, 246, 0.8), transparent)'
                      }}
                      animate={{ 
                        opacity: [0.5, 0.9, 0.5],
                        height: [5, 6, 5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
            
            {/* Enhanced climbing character */}
            {streak > 0 && (
              <motion.div
                className="absolute z-50"
                style={{
                  bottom: `${(visibleSteps - 1) * 15 + 22}px`,
                  left: `${(visibleSteps - 1) * 25 + 34}px`,
                  width: '54px',
                  height: '54px',
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: animation ? visibleSteps * 0.03 + 0.5 : 0.5, duration: 0.7 }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 3, 0, -3, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.5,
                    ease: "easeInOut" 
                  }}
                  className="w-full h-full relative"
                >
                  {/* Improved character with better glow effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-indigo-500 opacity-40 blur-xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                  
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-xl relative z-10 flex items-center justify-center border border-indigo-400/50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-7 h-7" fill="white">
                      <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                    </svg>
                  </div>
                  
                  {/* Animated pulse effect around character */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-indigo-400/50"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  
                  {/* Climbing trail effect */}
                  <motion.div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-20 origin-top"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.8), transparent)'
                    }}
                    animate={{ 
                      scaleY: [0, 1, 0],
                      opacity: [0, 0.7, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Info footer with glass effect */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/30 p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { color: "bg-blue-500", label: "Regular days" },
            { color: "bg-indigo-500", label: "Weekly milestones" },
            { color: "bg-emerald-500", label: "Current day" },
            { color: "bg-purple-500", label: "Special milestone" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${item.color} rounded-sm shadow-md shadow-${item.color.split('-')[1]}-500/50 border border-${item.color.split('-')[1]}-400/30`} />
              <span className="text-xs text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-slate-800/70 to-indigo-900/30 p-4 rounded-lg border border-indigo-500/20 shadow-inner">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-500/20 rounded-full p-1 flex items-center justify-center">
              <span className="text-blue-300 text-sm">💡</span>
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-200">
                It takes <span className="font-semibold text-white">66 days</span> on average to form a new habit
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Keep your streak going to build lasting change! You're making great progress.
              </p>
            </div>
          </div>
        </div>
        
        {/* Animation toggle button */}
        <div className="flex justify-end mt-4">
          <button 
            onClick={() => setAnimation(!animation)} 
            className="text-xs text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <span>{animation ? "Disable" : "Enable"} animations</span>
            <span className={`block w-8 h-4 rounded-full ${animation ? 'bg-indigo-600' : 'bg-slate-700'} relative`}>
              <span 
                className={`block w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${animation ? 'translate-x-4' : 'translate-x-0.5'}`} 
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreakStaircase;
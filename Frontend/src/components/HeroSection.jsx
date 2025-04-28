import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Responsive grid: fewer dots on mobile for performance
  const isMobile = window.innerWidth < 640;
  const cols = isMobile ? 16 : 40;
  const rows = isMobile ? 32 : 20;
  const totalDots = cols * rows;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 grid grid-cols-[repeat(${cols},1fr)] grid-rows-[repeat(${rows},1fr)] opacity-50`}
        >
          {[...Array(totalDots)].map((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const delay = (row + col) * 0.02;

            return (
              <motion.div
                key={i}
                className="w-0.5 h-0.5 rounded-full bg-[#A2BFFE]/60"
                style={{
                  gridColumn: col + 1,
                  gridRow: row + 1,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 max-w-2xl md:max-w-4xl mx-auto text-center px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Build Better <span className="text-[#A2BFFE]">Habits</span>
        </motion.h1>

        <motion.p
          className="text-[#f5f5f7]/80 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl md:max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Your companion for building lasting habits. Track, analyze, and
          improve your daily routines.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 sm:px-8 py-3 sm:py-4 rounded-md font-bold text-base sm:text-lg w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Get Started
          </motion.button>
          <motion.button
            className="border border-[#f5f5f7]/20 hover:border-[#A2BFFE] text-[#f5f5f7] px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium text-base sm:text-lg w-full sm:w-auto"
            whileHover={{
              scale: 1.05,
              borderColor: "rgba(162, 191, 254, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToFeatures}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

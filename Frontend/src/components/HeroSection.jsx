import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(20,1fr)] opacity-50">
          {[...Array(900)].map((_, i) => {
            const row = Math.floor(i / 40);
            const col = i % 40;
            const delay = (row + col) * 0.02;

            return (
              <motion.div
                key={i}
                className="w-0.5 h-0.5 rounded-full bg-[#A2BFFE]/20"
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
        className="relative z-10 max-w-4xl mx-auto text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Build Better <span className="text-[#A2BFFE]">Habits</span>
        </motion.h1>

        <motion.p
          className="text-[#f5f5f7]/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Your companion for building lasting habits. Track, analyze, and
          improve your daily routines.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 py-3 rounded-md font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
          <motion.button
            className="border border-[#f5f5f7]/20 hover:border-[#A2BFFE] text-[#f5f5f7] px-6 py-3 rounded-md font-medium"
            whileHover={{
              scale: 1.05,
              borderColor: "rgba(162, 191, 254, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

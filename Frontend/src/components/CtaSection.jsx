import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CtaSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-14 sm:py-20">
      <motion.div
        className="max-w-2xl md:max-w-4xl mx-auto px-4 sm:px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
          Ready to build better <span className="text-[#A2BFFE]">habits</span>?
        </h2>
        <p className="text-[#f5f5f7]/80 max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg">
          Join thousands of others who are transforming their lives through
          better habits.
        </p>
        <motion.button
          className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg w-full sm:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            navigate("/register");
          }}
        >
          Start Your Journey Today
        </motion.button>
      </motion.div>
    </section>
  );
};

export default CtaSection;

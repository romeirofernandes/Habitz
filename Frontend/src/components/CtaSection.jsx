import React from "react";
import { motion } from "framer-motion";

const CtaSection = () => {
  return (
    <section className="py-20">
      <motion.div
        className="max-w-4xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold mb-6">
          Ready to build better <span className="text-[#A2BFFE]">habits</span>?
        </h2>
        <p className="text-[#f5f5f7]/80 max-w-2xl mx-auto mb-8">
          Join thousands of others who are transforming their lives through
          better habits.
        </p>
        <motion.button
          className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-8 py-4 rounded-full font-medium text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Journey Today
        </motion.button>
        <p className="text-[#f5f5f7]/60 text-sm mt-4">
          No credit card required • 14-day free trial
        </p>
      </motion.div>
    </section>
  );
};

export default CtaSection;

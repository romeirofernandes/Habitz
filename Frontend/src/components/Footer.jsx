import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-[#222]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div
            className="flex items-center gap-2 mb-4 md:mb-0"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl font-bold">Habitz</span>
          </motion.div>

          <div className="flex gap-6">
            {["Twitter", "GitHub", "Discord"].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-[#f5f5f7]/70 hover:text-[#A2BFFE] transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="border-t border-[#222] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#f5f5f7]/60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Habitz
          </p>
          <p className="text-[#f5f5f7]/60 text-sm">Crafted by Team SOS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-[#222]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
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

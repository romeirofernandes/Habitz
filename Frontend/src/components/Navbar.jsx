import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isScrolled }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 left-0 right-0 z-40 px-6">
      <motion.nav
        className={`max-w-4xl mx-auto px-5 py-3 rounded-full transition-all duration-300 backdrop-blur-md border border-[#A2BFFE]/10 ${
          isScrolled ? "bg-[#080808]/80" : "bg-[#080808]/50"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl font-bold">Habitz</span>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.button
              className="text-[#f5f5f7]/80 hover:text-[#A2BFFE] transition-colors"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </motion.button>
            <motion.button
              className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-4 py-2 rounded-full font-bold text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/register");
              }}
            >
              Sign Up
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;

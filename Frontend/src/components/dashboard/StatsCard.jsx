import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon }) => {
  return (
    <motion.div
      className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-medium text-[#f5f5f7]/60">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
};

export default StatsCard;

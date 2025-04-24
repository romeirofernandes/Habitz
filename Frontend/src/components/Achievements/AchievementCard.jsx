import React from "react";
import { motion } from "framer-motion";

const AchievementCard = ({ achievement }) => {
  const { name, description, icon, unlocked, progress, total, category } = achievement;
  
  // Calculate progress percentage
  const progressPercentage = Math.round((progress / total) * 100);
  
  // Category colors
  const categoryColors = {
    beginner: "#4ade80",    // Green
    streak: "#f97316",      // Orange
    completion: "#3b82f6",  // Blue
    variety: "#8b5cf6",     // Purple
    time: "#ec4899",        // Pink
    perfection: "#eab308",  // Yellow
  };
  
  const categoryColor = categoryColors[category] || "#A2BFFE";
  
  return (
    <motion.div
      className={`border rounded-lg p-5 flex flex-col items-center text-center ${
        unlocked
          ? "border-[#A2BFFE]/30 bg-[#A2BFFE]/5"
          : "border-[#222] bg-[#0a0a0a]/50"
      }`}
      whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(162, 191, 254, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 text-3xl ${
          unlocked 
            ? `bg-${category}/10 text-${category}` 
            : "bg-[#222]/50 text-[#666] grayscale"
        }`}
        style={{ backgroundColor: unlocked ? `${categoryColor}20` : undefined }}
      >
        {icon}
      </div>
      
      <div className="space-y-2 mb-3">
        <h3 className={`font-bold text-base ${!unlocked && "text-[#f5f5f7]/60"}`}>{name}</h3>
        <p className="text-xs text-[#f5f5f7]/60">{description}</p>
      </div>
      
      {/* Category badge */}
      <div 
        className={`text-xs rounded-full px-3 py-1 mb-4 capitalize ${
          unlocked 
            ? "bg-[#A2BFFE]/10 text-[#A2BFFE]" 
            : "bg-[#222] text-[#f5f5f7]/40"
        }`}
        style={{ 
          backgroundColor: unlocked ? `${categoryColor}15` : undefined,
          color: unlocked ? categoryColor : undefined 
        }}
      >
        {category}
      </div>
      
      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-[#f5f5f7]/60 mb-1">
          <span>{progress} / {total}</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-[#111] rounded-full h-2">
          <div 
            className="rounded-full h-2" 
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: unlocked ? categoryColor : "#444" 
            }}
          />
        </div>
      </div>
      
      {/* Locked/Unlocked indicator */}
      <div className={`mt-4 text-xs px-3 py-1 rounded-full ${
        unlocked 
          ? "bg-[#A2BFFE]/10 text-[#A2BFFE]" 
          : "bg-[#222] text-[#f5f5f7]/40"
      }`}>
        {unlocked ? "Unlocked" : "Locked"}
      </div>
    </motion.div>
  );
};

export default AchievementCard;
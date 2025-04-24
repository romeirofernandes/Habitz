import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import StreakStaircase from "./StreakStaircase";

const StreaksList = ({ habits }) => {
  const [selectedHabit, setSelectedHabit] = useState(null);

  // Find the habit with the highest current streak
  const highestStreakHabit = habits.length > 0 
    ? habits.reduce((prev, current) => 
        (prev.currentStreak > current.currentStreak) ? prev : current
      ) 
    : null;
  
  // When selecting a habit, show its staircase
  const handleHabitSelect = (habit) => {
    setSelectedHabit(selectedHabit?._id === habit._id ? null : habit);
  };

  return (
    <div className="space-y-6">
      {/* Featured Streak - Show highest streak or selected habit */}
      {(selectedHabit || highestStreakHabit) && (
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedHabit?._id || "highest"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">
                {selectedHabit 
                  ? `${selectedHabit.name} Streak Journey` 
                  : "Your Top Streak"}
              </h2>
              <StreakStaircase streak={20} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* List of all habits */}
      <h3 className="text-xl font-bold mb-4">All Habit Streaks</h3>
      <div className="space-y-4">
        {habits.map((habit) => (
          <motion.div
            key={habit._id}
            className={`bg-[#0a0a0a] border ${
              selectedHabit?._id === habit._id 
                ? "border-[#A2BFFE]" 
                : "border-[#222]"
            } rounded-xl p-4 cursor-pointer`}
            whileHover={{ y: -2 }}
            onClick={() => handleHabitSelect(habit)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{habit.name}</h3>
                <p className="text-sm text-[#f5f5f7]/60">
                  {habit.frequency} •{" "}
                  {format(new Date(`2000-01-01T${habit.timeOfDay}`), "h:mm a")}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm text-[#f5f5f7]/60">Current</p>
                    <p className="text-xl font-bold text-[#A2BFFE]">
                      {habit.currentStreak}
                      <span className="text-sm text-[#f5f5f7]/60 ml-1">days</span>
                    </p>
                  </div>
                  <div className="h-10 w-px bg-[#222]" />
                  <div>
                    <p className="text-sm text-[#f5f5f7]/60">Longest</p>
                    <p className="text-xl font-bold text-[#A2BFFE]">
                      {habit.longestStreak}
                      <span className="text-sm text-[#f5f5f7]/60 ml-1">days</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual mini-streak indicator */}
            <div className="flex gap-1 mt-3">
              {Array.from({ length: 7 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 flex-1 rounded-full ${
                    idx < Math.min(habit.currentStreak, 7) 
                      ? 'bg-gradient-to-r from-[#A2BFFE] to-[#91AFFE]' 
                      : 'bg-[#222]'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StreaksList;
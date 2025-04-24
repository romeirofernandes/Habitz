import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const StreaksList = ({ habits }) => {
  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <motion.div
          key={habit._id}
          className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4"
          whileHover={{ y: -2 }}
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
        </motion.div>
      ))}
    </div>
  );
};

export default StreaksList;

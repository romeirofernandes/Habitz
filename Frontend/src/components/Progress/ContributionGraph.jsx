import React from "react";
import { motion } from "framer-motion";
import { format, subYears, eachDayOfInterval } from "date-fns";

const ContributionGraph = ({ habits }) => {
  // Get dates for exactly one year
  const today = new Date();
  const oneYearAgo = subYears(today, 1);
  const dates = eachDayOfInterval({ start: oneYearAgo, end: today });

  // Calculate completion counts for each day
  const completionsByDate = dates.reduce((acc, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const completions = habits.reduce((count, habit) => {
      const wasCompleted = habit.completedDates?.some(
        (completedDate) =>
          format(new Date(completedDate), "yyyy-MM-dd") === dateStr
      );
      return wasCompleted ? count + 1 : count;
    }, 0);
    acc[dateStr] = completions;
    return acc;
  }, {});

  // Get max completions for scaling
  const maxCompletions = Math.max(...Object.values(completionsByDate), 1);

  // Helper function to get color based on completion count
  const getColor = (count) => {
    if (count === 0) return "bg-[#1a1a1a]";
    const intensity = Math.min((count / maxCompletions) * 100, 100);
    if (intensity < 25) return "bg-[#1e3a8a]";
    if (intensity < 50) return "bg-[#2563eb]";
    if (intensity < 75) return "bg-[#60a5fa]";
    return "bg-[#A2BFFE]";
  };

  // Group dates by week (ensure 52 weeks + remaining days)
  const weeks = Array.from({ length: 53 }, () => Array(7).fill(null)); // 53 weeks to ensure full coverage
  let currentWeekIndex = weeks.length - 1;
  let currentDayIndex = 6;

  // Fill in the dates from right to left
  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i];
    weeks[currentWeekIndex][currentDayIndex] = date;

    currentDayIndex--;
    if (currentDayIndex < 0) {
      currentWeekIndex--;
      currentDayIndex = 6;
    }
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6">
      <h3 className="font-medium text-[#A2BFFE] mb-4">Contribution Activity</h3>
      <div className="w-full overflow-hidden">
        {" "}
        <div className="w-full">
          {" "}
          <div className="flex gap-1 justify-end w-full">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dateIndex) => {
                  if (!date) {
                    return (
                      <motion.div
                        key={`empty-${weekIndex}-${dateIndex}`}
                        className="w-3 h-3 rounded-sm bg-[#1a1a1a]"
                      />
                    );
                  }

                  const dateStr = format(date, "yyyy-MM-dd");
                  const completions = completionsByDate[dateStr] || 0;

                  return (
                    <motion.div
                      key={dateStr}
                      className={`w-3 h-3 rounded-sm ${getColor(
                        completions
                      )} hover:ring-2 hover:ring-[#f5f5f7]/20 cursor-pointer`}
                      whileHover={{ scale: 1.2 }}
                      title={`${format(
                        date,
                        "MMM d, yyyy"
                      )}: ${completions} completion${
                        completions !== 1 ? "s" : ""
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (weekIndex + dateIndex) * 0.001 }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-[#f5f5f7]/60">
            <span>Less</span>
            <div className="flex gap-1">
              {[
                "bg-[#1a1a1a]",
                "bg-[#1e3a8a]",
                "bg-[#2563eb]",
                "bg-[#60a5fa]",
                "bg-[#A2BFFE]",
              ].map((color, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
import React from "react";
import { motion } from "framer-motion";

// Default recommendations as fallback
const defaultRecommendations = [
  {
    category: "health",
    title: "Drink a glass of water",
    recommendation:
      "We noticed you complete morning habits consistently. Adding water intake could boost your productivity.",
    timeOfDay: "08:00",
    icon: "💧",
  },
  {
    category: "productivity",
    title: "5-minute journal",
    recommendation:
      "Your evening habit completion is strong. Consider a short journaling session to reflect on your day.",
    timeOfDay: "21:00",
    icon: "📝",
  },
  {
    category: "self-care",
    title: "2-minute meditation",
    recommendation:
      "Start small with just 2 minutes of meditation to complement your morning routine.",
    timeOfDay: "07:30",
    icon: "🧘",
  },
];

const HabitRecommendations = ({
  onAddHabit,
  recommendations = [],
  loading = false,
  onRefresh,
}) => {
  // Use provided recommendations or fallback to defaults if empty
  const displayRecommendations =
    recommendations.length > 0 ? recommendations : defaultRecommendations;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 w-full">
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start">
          <h3 className="text-lg sm:text-xl font-bold text-[#f5f5f7]">
            <span className="block sm:hidden">Habit Recommendations</span>
            <span className="hidden sm:block">
              Personalized Recommendations
            </span>
          </h3>
          <motion.button
            onClick={onRefresh}
            className="text-[#A2BFFE] hover:text-[#91AFFE] p-2 rounded-full sm:ml-3 ml-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${loading ? "animate-spin" : ""}`}
            >
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
          </motion.button>
        </div>
      </div>

      <p className="text-[#f5f5f7]/60 mb-4 text-sm sm:text-base">
        Based on your habit patterns, here are some ideas that might work well
        for you:
      </p>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A2BFFE]"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {displayRecommendations.map((rec, index) => (
            <motion.div
              key={index}
              className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#A2BFFE]/10 rounded-xl p-3 sm:p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, borderColor: "rgba(162, 191, 254, 0.3)" }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#A2BFFE]/10 rounded-full text-xl mb-2 sm:mb-0">
                  {rec.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#A2BFFE] text-base sm:text-lg">
                    {rec.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#f5f5f7]/60 mt-1">
                    {rec.recommendation}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-2 sm:gap-0">
                    <span className="text-xs text-[#f5f5f7]/40">
                      Suggested time: {rec.timeOfDay}
                    </span>
                    <motion.button
                      className="text-xs font-medium text-[#A2BFFE] hover:text-[#91AFFE] flex items-center gap-1"
                      onClick={() =>
                        onAddHabit({
                          name: rec.title,
                          timeOfDay: rec.timeOfDay,
                          category: rec.category,
                        })
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add This Habit
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitRecommendations;

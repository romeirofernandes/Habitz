import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import axios from "axios";
import ReactCanvasConfetti from "react-canvas-confetti";

const HabitList = ({ habits, onHabitUpdate }) => {
  const [justCompleted, setJustCompleted] = useState(null);
  
  // Check if habits is an array and has items
  const habitArray = Array.isArray(habits) ? habits : [];

  const handleCheck = async (habitId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/habits/${habitId}/check`
      );
      if (!response.data.completedToday) {
        setJustCompleted(habitId);
        setTimeout(() => setJustCompleted(null), 2000);
      }
      onHabitUpdate();
    } catch (error) {
      console.error("Error checking habit:", error);
    }
  };

  const makeShot = useCallback((particleRatio, opts) => {
    confetti({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio),
    });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  return (
    <div className="space-y-4">
      {/* Added a check for empty array */}
      {habitArray.length === 0 ? (
        <div className="text-center py-10 text-[#f5f5f7]/60">
          <p>No habits found. Create a new habit to get started!</p>
        </div>
      ) : (
        habitArray.map((habit) => (
          <motion.div
            key={habit._id}
            className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 flex items-center justify-between"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => {
                  handleCheck(habit._id);
                  if (!habit.completedToday) fire();
                }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  habit.completedToday
                    ? "bg-[#A2BFFE] border-[#A2BFFE]"
                    : "border-[#444] hover:border-[#A2BFFE]"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {habit.completedToday && (
                  <svg
                    className="w-4 h-4 text-[#080808]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </motion.button>

              <div>
                <h3
                  className={`font-bold ${
                    habit.completedToday ? "line-through text-[#f5f5f7]/40" : ""
                  }`}
                >
                  {habit.name}
                </h3>
                <p
                  className={`text-sm ${
                    habit.completedToday
                      ? "text-[#f5f5f7]/40"
                      : "text-[#f5f5f7]/60"
                  }`}
                >
                  {habit.frequency} •{" "}
                  {format(new Date(`2000-01-01T${habit.timeOfDay}`), "h:mm a")}
                </p>
              </div>
            </div>
          </motion.div>
        ))
      )}
      <ReactCanvasConfetti
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 50,
        }}
      />
    </div>
  );
};

export default HabitList;
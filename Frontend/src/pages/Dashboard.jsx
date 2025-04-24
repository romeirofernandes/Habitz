import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HabitForm from "../components/dashboard/HabitForm";
import HabitList from "../components/dashboard/HabitList";
import StreaksList from "../components/dashboard/StreaksList";
import StatsCard from "../components/dashboard/StatsCard";
import axios from "axios";

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("habits");

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/habits`
      );
      setHabits(response.data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const tabs = [
    { id: "habits", label: "Habits" },
    { id: "streaks", label: "Streaks" },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f7]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Habits</h1>
          <motion.button
            onClick={() => setShowForm(true)}
            className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-4 py-2 rounded-full font-bold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Habit
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard title="Current Streak" value="5 days" icon="🔥" />
          <StatsCard title="Completion Rate" value="85%" icon="📊" />
          <StatsCard title="Total Habits" value={habits.length} icon="✨" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[#222]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 relative ${
                activeTab === tab.id
                  ? "text-[#A2BFFE]"
                  : "text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A2BFFE]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "habits" ? (
          <HabitList habits={habits} onHabitUpdate={fetchHabits} />
        ) : (
          <StreaksList habits={habits} />
        )}

        {/* Create Habit Modal */}
        {showForm && (
          <HabitForm
            onClose={() => setShowForm(false)}
            onSubmit={fetchHabits}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

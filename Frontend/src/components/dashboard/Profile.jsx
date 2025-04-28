import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { FaTrophy, FaCalendarCheck, FaFire, FaClock } from "react-icons/fa";

const UserProfile = ({ userId: propsUserId, isOwnProfile }) => {
  const { userId: paramsUserId } = useParams();
  const userId = paramsUserId || propsUserId;

  const [profile, setProfile] = useState(null);
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setProfile({
        username: userData.username,
        email: userData.email,
        _id: userData._id,
      });
    }

    fetchProfile();
    if (isOwnProfile) {
      fetchHabits();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile(response.data);
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  const fetchHabits = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/habits`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setHabits(response.data);
      calculateStats(response.data);
    } catch (error) {
      toast.error("Failed to load habits");
    }
  };

  const calculateStats = (habits) => {
    setStats({
      totalHabits: habits.length,
      completedToday: habits.filter((h) => h.completedToday).length,
      currentStreak: Math.max(...habits.map((h) => h.currentStreak || 0), 0),
      longestStreak: Math.max(...habits.map((h) => h.longestStreak || 0), 0),
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f7] py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* Profile Header */}
        <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#A2BFFE] flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-bold text-[#080808]">
                {profile?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                {profile?.username || "Loading..."}
              </h1>
              <p className="text-[#f5f5f7]/60 text-sm sm:text-base">
                {profile?.email || "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {isOwnProfile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatCard
              icon={<FaTrophy />}
              title="Total Habits"
              value={stats.totalHabits}
            />
            <StatCard
              icon={<FaCalendarCheck />}
              title="Completed Today"
              value={`${stats.completedToday}/${stats.totalHabits}`}
            />
            <StatCard
              icon={<FaFire />}
              title="Current Streak"
              value={`${stats.currentStreak} days`}
            />
            <StatCard
              icon={<FaClock />}
              title="Longest Streak"
              value={`${stats.longestStreak} days`}
            />
          </div>
        )}

        {/* Habits List */}
        {isOwnProfile && habits.length > 0 && (
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Your Habits</h2>
            <div className="space-y-4">
              {habits.map((habit) => (
                <motion.div
                  key={habit._id}
                  className="bg-[#1a1a1a] rounded-lg p-3 sm:p-4"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="font-bold">{habit.name}</h3>
                      <p className="text-sm text-[#f5f5f7]/60">
                        {habit.description}
                      </p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <p className="text-xs sm:text-sm text-[#f5f5f7]/60">
                        Streak
                      </p>
                      <p className="text-lg font-bold text-[#A2BFFE]">
                        {habit.currentStreak || 0} days
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <motion.div
    className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4"
    whileHover={{ y: -2 }}
  >
    <div className="flex items-center gap-2 mb-2 text-[#A2BFFE]">
      {icon}
      <h3 className="text-sm text-[#f5f5f7]/60">{title}</h3>
    </div>
    <p className="text-xl font-bold">{value}</p>
  </motion.div>
);

export default UserProfile;

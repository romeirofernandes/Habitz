import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const HabitEditor = ({ habit, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHabit, setEditedHabit] = useState(habit);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`,
        editedHabit,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Habit updated successfully");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error("Failed to update habit");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Habit deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete habit");
    }
  };

  return (
    <motion.div
      className="bg-[#222] rounded-lg p-4"
      whileHover={{ scale: 1.01 }}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedHabit.name}
            onChange={(e) =>
              setEditedHabit({ ...editedHabit, name: e.target.value })
            }
            className="w-full bg-[#333] rounded px-3 py-2"
          />
          <textarea
            value={editedHabit.description}
            onChange={(e) =>
              setEditedHabit({ ...editedHabit, description: e.target.value })
            }
            className="w-full bg-[#333] rounded px-3 py-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-[#A2BFFE] text-[#080808] px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-[#333] px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="font-bold">{habit.name}</h4>
          <p className="text-[#f5f5f7]/60">{habit.description}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#A2BFFE]/20 text-[#A2BFFE] px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500/20 text-red-500 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HabitEditor;

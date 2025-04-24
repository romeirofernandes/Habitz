import React, { useState } from "react";
import { motion } from "framer-motion";

const ShareProgress = ({ stats }) => {
  const [copying, setCopying] = useState(false);

  const generateShareText = () => {
    return `🎯 My habit tracking progress:
• Longest streak: ${stats.longestStreak} days
• Completion rate: ${stats.completionRate}%
• Total habits: ${stats.totalHabits}
Join me on Habitz to build better habits! #HabitzApp`;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <motion.div
      className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 my-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4">Share Your Progress</h2>
      <div className="bg-[#101010] border border-[#222] rounded-lg p-4 mb-4">
        <pre className="whitespace-pre-wrap text-sm text-[#f5f5f7]/80 font-mono">
          {generateShareText()}
        </pre>
      </div>

      <div className="flex flex-wrap gap-3">
        <motion.button
          onClick={handleCopyToClipboard}
          className="px-4 py-2 bg-[#222] hover:bg-[#333] rounded-lg text-sm font-medium flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copying ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
              Copy to Clipboard
            </>
          )}
        </motion.button>

        <motion.button
          onClick={handleShareTwitter}
          className="px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-lg text-sm font-medium flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-twitter"
            viewBox="0 0 16 16"
          >
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
          </svg>
          Share on Twitter
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ShareProgress;
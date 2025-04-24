import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ShareProgress = ({ stats }) => {
  const [copying, setCopying] = useState(false);
  const [activeTab, setActiveTab] = useState("text"); // text, image

  const generateShareText = () => {
    return `🚀 My Habit Journey on Habitz

✨ Longest Streak: ${stats.longestStreak} days
📊 Completion Rate: ${stats.completionRate}%
📝 Total Habits: ${stats.totalHabits}
🔥 Total Completions: ${stats.totalCompleted}

Join me on Habitz to build lasting habits! #HabitzApp`;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopying(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopying(false), 2000);
  };

  const handleShareSocial = (platform) => {
    const text = encodeURIComponent(generateShareText());
    let url;

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${text}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${text}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent("My Progress on Habitz")}&summary=${text}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${text}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`;
        break;
      default:
        url = null;
    }

    if (url) window.open(url, "_blank");
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-[#222] rounded-xl p-6 my-8 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A2BFFE] to-[#91AFFE]">
          Share Your Progress
        </h2>
        
        <div className="bg-[#0a0a0a] border border-[#222] rounded-full p-1 flex">
          <button 
            className={`px-3 py-1 text-xs rounded-full font-medium transition ${
              activeTab === "text" 
                ? "bg-[#A2BFFE] text-[#080808]" 
                : "text-[#f5f5f7]/70 hover:text-[#f5f5f7]"
            }`}
            onClick={() => setActiveTab("text")}
          >
            Text
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-full font-medium transition ${
              activeTab === "image" 
                ? "bg-[#A2BFFE] text-[#080808]" 
                : "text-[#f5f5f7]/70 hover:text-[#f5f5f7]"
            }`}
            onClick={() => setActiveTab("image")}
          >
            Image
          </button>
        </div>
      </div>
      
      {activeTab === "text" ? (
        <div className="bg-[#0c0c0c] border border-[#222] rounded-lg p-5 mb-5 shadow-inner">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed tracking-wide text-[#f5f5f7]/90 font-['Inter',sans-serif]">
            {generateShareText()}
          </pre>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#222] rounded-lg p-5 mb-5 flex flex-col items-center">
          <div className="bg-gradient-to-br from-[#A2BFFE]/10 to-[#91AFFE]/5 p-6 rounded-lg w-full max-w-sm mx-auto border border-[#A2BFFE]/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#A2BFFE]">Habitz</h3>
              <div className="text-xs text-[#f5f5f7]/50">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#f5f5f7]/40 font-medium mb-1">Longest Streak</div>
                <div className="text-2xl font-bold text-[#f5f5f7]">{stats.longestStreak} days</div>
              </div>
              
              <div>
                <div className="text-xs uppercase tracking-wider text-[#f5f5f7]/40 font-medium mb-1">Completion Rate</div>
                <div className="text-2xl font-bold text-[#f5f5f7]">{stats.completionRate}%</div>
              </div>
              
              <div className="pt-2 border-t border-[#f5f5f7]/10">
                <div className="text-sm text-[#f5f5f7]/70 italic">
                  "Building better habits, one day at a time"
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-[#f5f5f7]/50 mt-3">
            *This is a preview. Actual image will be generated when shared.
          </div>
        </div>
      )}

      <h3 className="text-sm font-medium text-[#f5f5f7]/70 mb-3">Share via:</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {/* Copy to clipboard */}
        <motion.button
          onClick={handleCopyToClipboard}
          className="flex flex-col items-center gap-2 p-3 bg-[#131313] hover:bg-[#191919] rounded-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center">
            {copying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
            )}
          </div>
          <span className="text-xs font-medium text-[#f5f5f7]/80">
            {copying ? "Copied!" : "Copy"}
          </span>
        </motion.button>
        
        {/* Twitter */}
        <motion.button
          onClick={() => handleShareSocial("twitter")}
          className="flex flex-col items-center gap-2 p-3 bg-[#131313] hover:bg-[#191919] rounded-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="text-white"
              viewBox="0 0 16 16"
            >
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-[#f5f5f7]/80">Twitter</span>
        </motion.button>
        
        {/* Facebook */}
        <motion.button
          onClick={() => handleShareSocial("facebook")}
          className="flex flex-col items-center gap-2 p-3 bg-[#131313] hover:bg-[#191919] rounded-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-full bg-[#4267B2] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="text-white"
              viewBox="0 0 16 16"
            >
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-[#f5f5f7]/80">Facebook</span>
        </motion.button>
        
        {/* WhatsApp */}
        <motion.button
          onClick={() => handleShareSocial("whatsapp")}
          className="flex flex-col items-center gap-2 p-3 bg-[#131313] hover:bg-[#191919] rounded-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="text-white"
              viewBox="0 0 16 16"
            >
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-[#f5f5f7]/80">WhatsApp</span>
        </motion.button>
        
        {/* LinkedIn */}
        <motion.button
          onClick={() => handleShareSocial("linkedin")}
          className="flex flex-col items-center gap-2 p-3 bg-[#131313] hover:bg-[#191919] rounded-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-full bg-[#0077b5] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="text-white"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-[#f5f5f7]/80">LinkedIn</span>
        </motion.button>  
      </div>
      
      <div className="mt-6 pt-4 border-t border-[#222]">
        <div className="text-xs text-[#f5f5f7]/50 text-center">
          Share your habit journey and inspire your friends to build better habits too!
        </div>
      </div>
    </motion.div>
  );
};

export default ShareProgress;
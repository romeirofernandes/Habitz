import React from "react";

export default function Legend() {
  return (
    <div className="bg-gradient-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-md rounded-lg p-3 text-white shadow-lg border border-emerald-400/30 max-w-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 text-xl flex items-center justify-center bg-white/20 rounded-full">
          🌱
        </div>
        <span className="font-semibold text-sm">Tree Growth</span>
      </div>
      
      <p className="text-xs leading-relaxed">
        Keep your habits going! The longer your streak, the taller your trees will grow.
      </p>
      
      <div className="mt-3 flex items-center text-xs border-t border-white/20 pt-2">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"></path>
        </svg>
        <span className="opacity-80">Reach 50 days for giant trees!</span>
      </div>
    </div>
  );
}
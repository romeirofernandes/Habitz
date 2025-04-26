import React from 'react';
import AICoach from '../components/AICoach';

const CoachPage = () => {
  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f7] py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">AI Habit Coach</h1>
        <div className="h-[calc(100vh-180px)]">
          <AICoach />
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
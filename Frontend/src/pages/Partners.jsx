import React from "react";
import PartnersSection from "../components/partners/PartnersSection";

const Partners = () => {
  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f7] py-8">
      <main className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Accountability Partners</h1>
          <p className="text-[#f5f5f7]/60">
            Connect with others and stay accountable together
          </p>
        </div>
        <PartnersSection />
      </main>
    </div>
  );
};

export default Partners;

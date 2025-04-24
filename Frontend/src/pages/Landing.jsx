import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#f5f5f7] overflow-x-hidden">
      <Navbar isScrolled={isScrolled} />
      <HeroSection />
      <Features />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

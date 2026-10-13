import React from "react";
import Navbar from "../common/components/Navbar.jsx";
import HeroSection from "../features/home/components/HeroSection.jsx";
import FeaturesGrid from "../features/home/components/FeaturesGrid.jsx";
import HowItWorks from "../features/home/components/HowItWorks.jsx";
import Footer from "../common/components/Footer.jsx";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-vault-primary flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesGrid />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

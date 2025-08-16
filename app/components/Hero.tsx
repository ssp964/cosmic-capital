"use client";
import React from "react";
import { BackgroundLines } from "./ui/background-lines";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  // Scroll to FeaturesSectionDemo when "Learn" is clicked
  const handleLearnClick = () => {
    const section = document.getElementById("features-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  // Redirect to dashboard page
  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <div>
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-1">
        <h2 className="bg-clip-text text-transparent text-center text-transparent bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 text-2xl md:text-4xl lg:text-7xl font-sans py-1 md:py-2 relative z-20 font-bold tracking-tight">
          Welcome to <br /> Cosmic Capital.
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center mt-2 md:mt-3">
          🚀 Cross-Chain Liquidations, Supercharged by Hedera.
        </p>
        <div className="flex gap-6 mt-10">
          <button
            className="group relative px-8 py-4 rounded-xl border-2 border-emerald-200/30 bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 backdrop-blur-sm text-emerald-800 text-lg font-semibold hover:border-emerald-300/50 hover:bg-gradient-to-br hover:from-emerald-50/95 hover:via-white/90 hover:to-emerald-50/95 hover:-translate-y-2 transform transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] active:scale-95 min-w-[140px] overflow-hidden"
            onClick={handleLearnClick}
          >
            <span className="relative z-10">Learn</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
          </button>

          <button
            className="group relative px-8 py-4 rounded-xl border-2 border-emerald-200/30 bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 backdrop-blur-sm text-emerald-800 text-lg font-semibold hover:border-emerald-300/50 hover:bg-gradient-to-br hover:from-emerald-50/95 hover:via-white/90 hover:to-emerald-50/95 hover:-translate-y-2 transform transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] active:scale-95 min-w-[140px] overflow-hidden"
            onClick={handleDashboardClick}
          >
            <span className="relative z-10">Go to Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
          </button>
        </div>
      </BackgroundLines>
    </div>
  );
};

export default Hero;

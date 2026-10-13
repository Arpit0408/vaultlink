import React from "react";
import { motion } from "framer-motion";
import { useTypingAnimation } from "../../../common/hooks/useTypingAnimation.js";
import HeroQuickShorten from "./HeroQuickShorten.jsx";
import { CheckCircle2, Shield, Lock, Clock, Eye, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer } from "../../../common/utils/animations.js";

const HeroSection = () => {
  const { displayText } = useTypingAnimation([
    "Document Watermarking",
    "Secure Link Vaulting",
    "Email Verification",
    "Automatic Expiry",
  ]);

  return (
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-grid-pattern bg-hero-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-heading font-bold tracking-widest uppercase mb-7 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Data Compliance & Zero-Trust Governance</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-vault-main max-w-5xl leading-[1.12]"
          >
            <span className="text-gradient">Privacy–First</span> Secure{" "}
            <span className="block sm:inline">File Sharing & Real–</span>
            <span className="block sm:inline">
              Time{" "}
              <span className="text-gradient">
                {displayText}
                <span className="inline-block w-1 h-8 sm:h-12 bg-indigo-500 ml-1 translate-y-1.5 animate-pulse"></span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-base sm:text-lg md:text-xl text-vault-muted max-w-2xl font-normal leading-relaxed"
          >
            Stop leaks before they happen. Automatically brand, watermark, and inventory sensitive assets before files leave your network. Retain absolute zero-trust control even after download.
          </motion.p>

          <div className="w-full mt-10 md:mt-12">
            <HeroQuickShorten />
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-10 text-xs sm:text-sm font-medium text-vault-muted"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Multi-Language Watermark Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Continuous Post-Share Governance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Zero-Trust Passcode Gates</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

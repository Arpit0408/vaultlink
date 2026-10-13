import React from "react";
import { motion } from "framer-motion";
import { UploadCloud, Sliders, Share2 } from "lucide-react";
import { fadeUp, staggerContainer } from "../../../common/utils/animations.js";

const steps = [
  {
    step: "01",
    icon: UploadCloud,
    title: "Upload Asset or Long URL",
    desc: "Drop mockups, confidential PDFs, or input any destination URL you need to share with external parties.",
  },
  {
    step: "02",
    icon: Sliders,
    title: "Configure Governance Rules",
    desc: "Define custom watermark stamps, set automatic expiration timers, and enable passcode or email verification gates.",
  },
  {
    step: "03",
    icon: Share2,
    title: "Dispatch & Track Conversions",
    desc: "Send straight to recipient emails or share the vault URL. Review real-time click volume and collected lead lists.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-vault-secondary/40 border-y border-vault-subtle relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-heading font-bold text-indigo-500">
            SIMPLE THREE-STEP WORKFLOW
          </span>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-vault-main tracking-tight">
            How VaultLink Protects Your Shares
          </h2>
          <p className="mt-4 text-base sm:text-lg text-vault-muted font-normal">
            From initial file upload to authorized access — complete zero-trust
            lifecycle management.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="glass-panel rounded-2xl p-8 relative flex flex-col items-start border border-vault-subtle hover:border-vault-strong transition-all"
              >
                <div className="w-full flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-gradient text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black font-mono text-vault-muted/30">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-vault-main mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-vault-muted leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

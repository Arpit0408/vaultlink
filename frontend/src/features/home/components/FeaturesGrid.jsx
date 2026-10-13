import React from "react";
import { motion } from "framer-motion";
import {
  Stamp,
  Clock,
  MailCheck,
  Send,
  KeyRound,
  BarChart3,
} from "lucide-react";
import { fadeUp, staggerContainer } from "../../../common/utils/animations.js";

const features = [
  {
    icon: Stamp,
    title: "Dynamic Watermarking",
    desc: "Automatically stamp your company watermark diagonally across images to prevent unauthorized client use before sign-off.",
    badge: "IP Protection",
  },
  {
    icon: Clock,
    title: "Expiring Self-Destruct Links",
    desc: "Set time-to-live restrictions from 10 minutes to 30 days. Expired links immediately close access with automated TTL cleanup.",
    badge: "Ephemeral",
  },
  {
    icon: MailCheck,
    title: "Email Gate & Lead Capture",
    desc: "Turn documents into lead generation magnets. Recipients must submit their verified email before viewing or downloading.",
    badge: "Growth Engine",
  },
  {
    icon: Send,
    title: "Direct Recipient Delivery",
    desc: "Dispatch protected links and passcodes straight to client inboxes with one click, bypassing manual copy-paste friction.",
    badge: "Automation",
  },
  {
    icon: KeyRound,
    title: "Passcode Shielding",
    desc: "Enforce custom or auto-generated pin protection. Only recipients in possession of the key can unlock the vault.",
    badge: "Zero-Trust",
  },
  {
    icon: BarChart3,
    title: "Live Lead & Click Analytics",
    desc: "Track access counts, download velocity, and captured lead logs in real time from your personal creator dashboard.",
    badge: "Intelligence",
  },
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-heading font-bold text-indigo-500">
            ENGINEERED FOR ZERO-TRUST GOVERNANCE
          </span>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-vault-main tracking-tight">
            Everything You Need To Share Assets Safely
          </h2>
          <p className="mt-4 text-base sm:text-lg text-vault-muted font-normal">
            Move beyond fragile raw links. VaultLink turns every shareable asset
            into an intelligent, protected digital container.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="glass-panel rounded-2xl p-7 relative group hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-vault-primary text-vault-muted border border-vault-subtle">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-vault-main mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-vault-muted leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;

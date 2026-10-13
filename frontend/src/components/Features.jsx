import React from "react";
import { FaKey, FaChartLine, FaBolt } from "react-icons/fa";

const features = [
  {
    title: "Custom Slugs",
    desc: "Choose your own custom slugs for a personalized link experience.",
    icon: <FaKey className="text-4xl text-blue-600" />,
  },
  {
    title: "Analytics",
    desc: "Track clicks and engagement with detailed analytics.",
    icon: <FaChartLine className="text-4xl text-green-600" />,
  },
  {
    title: "Fast & Secure",
    desc: "Lightning-fast URL shortening with secure redirection.",
    icon: <FaBolt className="text-4xl text-yellow-500" />,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 bg-white ">
      <h2
        className="text-3xl font-bold text-center text-slate-800 mb-12"
        data-aos="fade-up"
      >
        Why use QuickLink?
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
            data-aos="zoom-in"
          >
            <div className="mb-4 flex justify-center">{f.icon}</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
              {f.title}
            </h3>
            <p className="text-slate-600 text-center">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

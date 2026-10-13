import React from "react";
import UrlForm from "./UrlFormHome";
import { FaRocket } from "react-icons/fa";

const Hero = () => {
  return (
    <section
      className="text-center py-28 px-6 bg-gradient-to-b from-blue-100 to-white"
      data-aos="fade-up"
    >
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6 leading-tight flex justify-center items-center gap-2">
        Shorten, Share & Track Your Links
        <FaRocket className="text-blue-600 inline-block" />
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
        QuickLink makes it simple to turn long URLs into short, memorable links.
        Create, customize, and share your shortened links instantly.
      </p>
      <UrlForm />
    </section>
  );
};

export default Hero;

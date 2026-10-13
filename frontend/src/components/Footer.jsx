import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-slate-900 text-slate-300 py-10 mt-10"
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} QuickLink. All rights reserved.
        </p>
        <div className="flex gap-6 text-2xl">
          <a href="#" className="hover:text-white">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-white">
            <FaLinkedin />
          </a>
          <a href="#" className="hover:text-white">
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

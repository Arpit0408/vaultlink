import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Outlet } from "@tanstack/react-router";
import { useSelector } from "react-redux";

export default function App() {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    AOS.init({ duration: 750, once: true });
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-vault-primary text-vault-main transition-colors">
      <Outlet />
    </div>
  );
}

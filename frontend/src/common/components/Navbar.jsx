import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store/slice/themeSlice.js";
import { logout } from "../../store/slice/authSlice.js";
import { logOutUser } from "../../apis/userApi.js";
import {
  Shield,
  Sun,
  Moon,
  ArrowRight,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.mode);

  const handleLogout = async () => {
    try {
      await logOutUser();
    } catch (err) {
      console.error(err);
    }
    dispatch(logout());
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-vault-subtle bg-vault-primary/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-vault-main">
              Vault<span className="text-gradient">Link</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-vault-muted font-bold -mt-1">
              Zero-Trust Assets
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-vault-muted">
          <a
            href="#features"
            className="hover:text-vault-main transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-vault-main transition-colors"
          >
            How It Works
          </a>
          <a
            href="#security"
            className="hover:text-vault-main transition-colors"
          >
            Security
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-vault-subtle bg-vault-card text-vault-muted hover:text-vault-main hover:border-vault-strong transition-all cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-vault-subtle bg-vault-card hover:bg-vault-primary text-vault-main transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl border border-vault-subtle text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-vault-muted hover:text-vault-main transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                search={{ mode: "register" }}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-gradient hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../../store/slice/themeSlice.js";
import { logout } from "../../../store/slice/authSlice.js";
import { logOutUser } from "../../../apis/userApi.js";
import { Shield, Sun, Moon, LogOut, Plus, Sparkles } from "lucide-react";

const DashboardNavbar = ({ onOpenCreate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.mode);

  const handleLogout = async () => {
    try {
      await logOutUser();
    } catch (err) {
      console.error("Logout error:", err);
    }
    dispatch(logout());
    navigate({ to: "/" });
  };

  const initialLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-vault-subtle bg-vault-card/90 transition-colors">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight text-vault-main">
              Vault<span className="text-gradient">Link</span>
            </span>
          </Link>

          <span className="hidden sm:inline-flex text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onOpenCreate && (
            <button
              onClick={onOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-deep hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Asset</span>
            </button>
          )}

          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-vault-muted hover:text-vault-main transition-all cursor-pointer"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-vault-subtle">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-gradient text-white flex items-center justify-center font-heading font-extrabold text-sm shadow-md shadow-indigo-500/20">
                {initialLetter}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-vault-main leading-tight">
                  {user?.name || "Vault Admin"}
                </span>
                <span className="text-[11px] text-vault-muted leading-tight truncate max-w-[140px]">
                  {user?.email || "user@vaultlink.io"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-vault-subtle hover:bg-red-500/10 text-vault-muted hover:text-red-500 transition-all cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;

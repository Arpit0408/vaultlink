import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../store/slice/themeSlice.js";
import { updateUser, logout } from "../store/slice/authSlice.js";
import { getCurrentUser, updateUserProfile, logOutUser } from "../apis/userApi.js";
import { useNavigate } from "@tanstack/react-router";
import {
  Settings,
  Sun,
  Moon,
  User,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  LogOut,
  Palette,
} from "lucide-react";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentTheme = useSelector((state) => state.theme.mode);
  const authUser = useSelector((state) => state.auth.user);

  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const data = await getCurrentUser();
        const u = data?.user || data;
        if (u) {
          setName(u.name || "");
          setEmail(u.email || "");
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchMe();
  }, []);

  const handleThemeChange = (mode) => {
    dispatch(setTheme(mode));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
      };
      if (password.trim()) {
        payload.password = password.trim();
      }

      const res = await updateUserProfile(payload);
      if (res.user) {
        dispatch(updateUser(res.user));
      }
      setSuccessMsg("Profile and preferences saved successfully");
      setPassword("");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err?.response?.data?.error || err?.response?.data?.message || err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOutUser();
    } catch (err) {
      console.error(err);
    }
    dispatch(logout());
    navigate({ to: "/" });
  };

  const initialLetter = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-gradient text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-vault-main tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs text-vault-muted">
            Configure application theme, account identity, and workspace security policies
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-500" />
          <h2 className="font-heading font-bold text-sm text-vault-main uppercase tracking-wider">
            Workspace Appearance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => handleThemeChange("light")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
              currentTheme === "light"
                ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-vault-card shadow-md"
                : "border-vault-subtle bg-vault-card/60 hover:border-vault-strong"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span className="font-heading font-bold text-sm text-vault-main">
                    Light Theme
                  </span>
                </div>
                {currentTheme === "light" && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-vault-muted">
                Clean, high-clarity daylight palette with crisp contrast for high-density document inspection.
              </p>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-mono text-[#0F172A] flex items-center justify-between">
              <span>Preview Surface</span>
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
            </div>
          </div>

          <div
            onClick={() => handleThemeChange("dark")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
              currentTheme === "dark"
                ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-vault-card shadow-md"
                : "border-vault-subtle bg-vault-card/60 hover:border-vault-strong"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <span className="font-heading font-bold text-sm text-vault-main">
                    Dark Cyber Vault
                  </span>
                </div>
                {currentTheme === "dark" && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-vault-muted">
                Low-light zero-glare environment designed for continuous focus and security operations.
              </p>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-[#090D16] border border-[#1E293B] text-[11px] font-mono text-[#F8FAFC] flex items-center justify-between">
              <span>Preview Surface</span>
              <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          <h2 className="font-heading font-bold text-sm text-vault-main uppercase tracking-wider">
            Account Profile & Identity
          </h2>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className="p-6 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-6"
        >
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-500">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-gradient text-white font-heading font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              {initialLetter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base text-vault-main">{name || "Vault User"}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Authenticated</span>
                </span>
              </div>
              <p className="text-xs text-vault-muted font-mono">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">
              Change Password (Leave blank to keep current)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted" />
              <input
                type="password"
                placeholder="Enter new password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-vault-subtle">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-deep hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <h2 className="font-heading font-bold text-sm text-vault-main uppercase tracking-wider">
            Session & Security
          </h2>
        </div>

        <div className="p-6 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-sm text-vault-main">
              Sign out from this device
            </h3>
            <p className="text-xs text-vault-muted">
              Terminates your current access token and clears secure session cookies.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;

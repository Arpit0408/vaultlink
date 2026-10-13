import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slice/authSlice.js";
import { toggleTheme } from "../../store/slice/themeSlice.js";
import { loginUser, registerUser } from "../../apis/userApi.js";
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowUpRight,
  Sun,
  Moon,
  Loader2,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AuthSplitLayout = () => {
  const getInitialAuthMode = () => {
    if (typeof window === "undefined") return true;
    const mode = new URLSearchParams(window.location.search).get("mode");
    return mode !== "register";
  };

  const [isLogin, setIsLogin] = useState(getInitialAuthMode);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.mode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mode = new URLSearchParams(window.location.search).get("mode");
      if (mode === "register") {
        setIsLogin(false);
      } else if (mode === "login") {
        setIsLogin(true);
      }
    }
  }, []);

  const handleTabSwitch = (mode) => {
    setIsLogin(mode);
    setAuthError("");
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setAuthError("");

      if (isLogin) {
        const response = await loginUser(data.email, data.password);
        dispatch(login(response.user));
      } else {
        const response = await registerUser(
          data.name,
          data.email,
          data.password
        );
        dispatch(login(response.user));
      }

      navigate({ to: "/dashboard" });
    } catch (err) {
      setAuthError(err.message || "Invalid credentials provided");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-vault-primary text-vault-main transition-colors font-body">
      <div
        className="lg:w-1/2 relative text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden min-h-[520px] lg:min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, #4f46e5 0%, #5846f6 35%, #764df7 70%, #8f54f8 100%)",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100,200 C300,100 200,600 800,400 C1200,250 900,900 1400,700"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
          <path
            d="M-100,350 C400,250 300,750 900,550 C1300,400 1000,1050 1500,850"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
          />
        </svg>

        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
              VaultLink
            </span>
          </Link>

          <Link
            to="/"
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm text-white"
          >
            <span>Visit VaultLink Ecosystem</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg my-auto py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Welcome to VaultLink.
            </h1>
            <p className="mt-6 text-white/90 text-sm sm:text-base leading-relaxed font-normal max-w-md">
              Safeguard sensitive and confidential assets with encrypted shared
              vaults, dynamic watermarks, and expiring links. Empower your
              workflow with verified zero-trust governance.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 hidden sm:block">
          <div className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-2xl p-5 shadow-2xl max-w-lg -mb-6 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center justify-between pb-3 border-b border-white/20 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span className="text-white">Active Vault Analytics</span>
              </div>
              <div className="flex items-center gap-3 text-white/90 text-[11px]">
                <span>24 Active</span>
                <span>•</span>
                <span>33 Total</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <span className="block text-[10px] text-white/80 uppercase tracking-wider">
                  Watermarks
                </span>
                <span className="text-base font-bold text-white font-mono">
                  100% Active
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <span className="block text-[10px] text-white/80 uppercase tracking-wider">
                  Storage Cap
                </span>
                <span className="text-base font-bold text-emerald-300 font-mono">
                  80% Allowed
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <span className="block text-[10px] text-white/80 uppercase tracking-wider">
                  Leads Gate
                </span>
                <span className="text-base font-bold text-white font-mono">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-20 relative bg-vault-card">
        <div className="flex justify-end">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-vault-muted hover:text-vault-main transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/25"
                style={{
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #764df7 100%)",
                }}
              >
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-lg text-vault-main tracking-tight">
                VAULTLINK
              </span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-vault-main tracking-tight">
              {isLogin ? "Sign In to Your Vault" : "Create Vault Account"}
            </h2>
            <p className="text-xs sm:text-sm text-vault-muted mt-2 max-w-sm mx-auto">
              {isLogin
                ? "Enter your account email and passcode to access your secured assets."
                : "Create an account to configure watermarks, expiring links and lead gates."}
            </p>
          </div>

          <div className="flex p-1 rounded-xl bg-vault-primary border border-vault-subtle mb-6">
            <button
              type="button"
              onClick={() => handleTabSwitch(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isLogin
                  ? "bg-vault-card text-vault-main shadow-sm border border-vault-subtle"
                  : "text-vault-muted hover:text-vault-main"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isLogin
                  ? "bg-vault-card text-vault-main shadow-sm border border-vault-subtle"
                  : "text-vault-muted hover:text-vault-main"
              }`}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium"
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-vault-main uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
                  <input
                    type="text"
                    {...register("name", {
                      required: !isLogin ? "Name is required" : false,
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    placeholder="Arpit Paliwal"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-vault-primary border border-vault-subtle text-vault-main text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-vault-muted/50"
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-vault-main uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-vault-primary border border-vault-subtle text-vault-main text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-vault-muted/50"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-vault-main uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-vault-primary border border-vault-subtle text-vault-main text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-vault-muted/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-vault-muted hover:text-vault-main cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3.5 px-4 rounded-xl text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5 0%, #5846f6 50%, #764df7 100%)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>{isLogin ? "Continue to Vault" : "Create Account"}</span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-vault-muted">
          <span>Protected by VaultLink Zero-Trust Governance</span>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;

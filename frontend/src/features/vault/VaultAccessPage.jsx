import React, { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import axiosInstance from "../../utils/axiosInstace.js";
import {
  Shield,
  Lock,
  Mail,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import VaultFileViewer from "./VaultFileViewer.jsx";

const VaultAccessPage = () => {
  const { shortcode } = useParams({ strict: false });
  const [loading, setLoading] = useState(true);
  const [itemInfo, setItemInfo] = useState(null);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [accessGranted, setAccessGranted] = useState(null);

  useEffect(() => {
    if (!shortcode) return;

    const fetchInfoAndResolve = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axiosInstance.get(`/api/vault/${shortcode}`);
        setItemInfo(data);

        if (data.type === "url" && !data.isPasswordProtected && !data.requireEmail) {
          const accessRes = await axiosInstance.post(`/api/vault/${shortcode}/access`, {});
          if (accessRes.data?.targetUrl) {
            window.location.replace(accessRes.data.targetUrl);
            return;
          }
        }

        if (data.type === "file" && !data.isPasswordProtected && !data.requireEmail) {
          const accessRes = await axiosInstance.post(`/api/vault/${shortcode}/access`, {});
          setAccessGranted(accessRes.data);
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        const status = err?.response?.status;
        if (status === 410) {
          setError("This VaultLink has expired and is no longer accessible.");
        } else if (status === 404) {
          setError("This VaultLink does not exist or has been removed.");
        } else {
          setError(err?.response?.data?.message || err?.message || "Failed to load asset");
        }
      }
    };

    fetchInfoAndResolve();
  }, [shortcode]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    try {
      setUnlocking(true);
      setError("");

      const { data } = await axiosInstance.post(`/api/vault/${shortcode}/access`, {
        password: password.trim() || undefined,
        email: email.trim() || undefined,
      });

      setAccessGranted(data);

      if (data.type === "url" && data.targetUrl) {
        window.location.replace(data.targetUrl);
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || "Invalid credentials provided");
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vault-primary flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-deep flex items-center justify-center text-white shadow-xl shadow-indigo-500/25">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-vault-main">
              Resolving VaultLink...
            </h2>
            <p className="text-xs text-vault-muted mt-1">
              Verifying security headers and governance policies
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error && !itemInfo) {
    return (
      <div className="min-h-screen bg-vault-primary flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-vault-subtle">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-xl text-vault-main">
            Link Unavailable
          </h2>
          <p className="text-sm text-vault-muted mt-2 leading-relaxed">
            {error}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-deep text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
          >
            <span>Return to VaultLink Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (accessGranted?.type === "file") {
    return (
      <div className="min-h-screen bg-vault-primary flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
        <VaultFileViewer
          fileData={accessGranted}
          viewerEmail={email}
          shortcode={shortcode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vault-primary flex flex-col items-center justify-center p-4 sm:p-6 bg-grid-pattern">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-10 border border-vault-subtle shadow-2xl relative">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-brand-deep text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            PROTECTED VAULTLINK ASSET
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-vault-main mt-3">
            {itemInfo?.fileName || "Verification Required"}
          </h2>
          <p className="text-xs sm:text-sm text-vault-muted mt-1.5 max-w-sm mx-auto">
            {itemInfo?.isPasswordProtected && itemInfo?.requireEmail
              ? "This asset requires a valid passcode and your email address to unlock."
              : itemInfo?.isPasswordProtected
              ? "This link is passcode protected. Enter the passcode to proceed."
              : "Please enter your email to view or download this shared file."}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          {itemInfo?.requireEmail && (
            <div>
              <label className="block text-xs font-bold text-vault-main uppercase tracking-wider mb-1.5">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-vault-primary border border-vault-subtle text-vault-main text-sm focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {itemInfo?.isPasswordProtected && (
            <div>
              <label className="block text-xs font-bold text-vault-main uppercase tracking-wider mb-1.5">
                Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-vault-primary border border-vault-subtle text-vault-main text-sm focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={unlocking}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-brand-deep text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {unlocking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Unlock & Access Asset</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VaultAccessPage;

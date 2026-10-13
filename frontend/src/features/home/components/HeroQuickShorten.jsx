import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
  X,
} from "lucide-react";
import axiosInstance from "../../../utils/axiosInstace.js";

const HeroQuickShorten = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a destination URL to shorten.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShortUrl("");

      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = "https://" + formattedUrl;
      }

      const res = await axiosInstance.post("/api/create", {
        url: formattedUrl,
      });
      const generated =
        typeof res.data === "string" ? res.data : res.data?.shortUrl;
      setShortUrl(generated);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to generate short link",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDismiss = () => {
    setShortUrl("");
    setCopied(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`w-full glass-panel rounded-full p-2 sm:p-2.5 shadow-2xl transition-all border ${
          error
            ? "border-red-400"
            : "border-vault-subtle focus-within:border-indigo-500/60 focus-within:ring-4 focus-within:ring-indigo-500/10 shadow-indigo-500/10"
        }`}
      >
        <form
          noValidate
          onSubmit={handleShorten}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1 flex items-center pl-4 sm:pl-5">
            <Link2 className="w-5 h-5 text-vault-muted shrink-0 mr-3" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter destination link to shorten instantly..."
              className="w-full py-3 bg-transparent text-vault-main placeholder:text-vault-muted/60 text-sm sm:text-base border-none focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="shrink-0 px-6 sm:px-8 py-3.5 rounded-full bg-brand-deep text-white font-heading font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Shortening...</span>
              </>
            ) : (
              <>
                <span>Shorten Link</span>
                <Sparkles className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="mt-2 text-xs text-red-500 font-medium text-center"
          >
            {error}
          </motion.p>
        )}

        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="w-full mt-4 glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-emerald-500/30"
          >
            <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-xs font-semibold text-vault-muted shrink-0">
                Ready:
              </span>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-bold text-indigo-500 hover:underline truncate"
              >
                {shortUrl}
              </a>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-vault-primary hover:bg-vault-subtle text-vault-main text-xs font-bold border border-vault-subtle transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="p-2 rounded-xl hover:bg-vault-subtle text-vault-muted hover:text-vault-main transition-all cursor-pointer border border-transparent hover:border-vault-subtle"
                title="Dismiss"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-vault-muted px-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Zero logs retained on public links</span>
        </div>

        <Link
          to="/auth"
          search={{ mode: "register" }}
          className="flex items-center gap-1 text-indigo-500 font-semibold hover:underline group"
        >
          <span>Need Watermarks, Passcodes & Expiry? Get Vault Pro</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default HeroQuickShorten;

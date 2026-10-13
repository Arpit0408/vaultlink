import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Share2,
  Shield,
  Key,
  Mail,
  Copy,
  CheckCircle2,
  ExternalLink,
  Clock,
  AlertCircle,
  Download,
  EyeOff,
} from "lucide-react";
import { configureShareAsset } from "../../../apis/vaultApi.js";
import NaturalExpiryInput from "./NaturalExpiryInput.jsx";

const ShareConfigModal = ({ asset, isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState(asset?.password || "");
  const [expiresInMinutes, setExpiresInMinutes] = useState("");
  const [requireEmail, setRequireEmail] = useState(Boolean(asset?.requireEmail));
  const [recipientEmail, setRecipientEmail] = useState(asset?.recipientEmail || "");
  const [allowDownload, setAllowDownload] = useState(
    asset?.allowDownload !== undefined ? Boolean(asset.allowDownload) : true
  );
  const [watermarkText, setWatermarkText] = useState(asset?.watermarkText || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !asset) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        password: password.trim(),
        expiresInMinutes: expiresInMinutes ? String(expiresInMinutes) : "",
        requireEmail: Boolean(requireEmail),
        recipientEmail: recipientEmail.trim(),
        allowDownload: Boolean(allowDownload),
        watermarkText: watermarkText.trim(),
      };

      const res = await configureShareAsset(asset.short, payload);
      setResult(res);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to configure share"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.shortUrl) return;
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg rounded-2xl bg-vault-card border border-vault-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-vault-subtle bg-vault-card/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-vault-main">
                {result ? "Secure Link Active" : "Share Vault Asset"}
              </h3>
              <p className="text-xs text-vault-muted">
                {asset.file?.originalName || asset.full} (/{asset.short})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-vault-muted hover:text-vault-main hover:bg-vault-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {result.deliveredViaEmail ? "Emailed to Recipient" : "Share Link Generated"}
                  </h4>
                  <p className="text-xs text-vault-muted mt-0.5">
                    {result.deliveredViaEmail
                      ? `Access link and passcode were dispatched directly to ${result.recipientEmail}.`
                      : "Zero-trust link is now live and protected."}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">
                  Live Access Link
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-vault-subtle bg-vault-primary">
                  <input
                    type="text"
                    readOnly
                    value={result.shortUrl}
                    className="flex-1 bg-transparent text-sm text-vault-main font-mono outline-none select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-deep text-white cursor-pointer hover:opacity-90"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <a
                    href={result.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-vault-muted hover:text-vault-main cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {result.password && (
                <div className="p-3 rounded-xl border border-vault-subtle bg-vault-primary flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <span className="text-vault-muted font-medium">Passcode:</span>
                  </div>
                  <span className="font-mono font-bold text-vault-main px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                    {result.password}
                  </span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-deep hover:opacity-90 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <NaturalExpiryInput
                valueMinutes={expiresInMinutes}
                onChangeMinutes={(m) => setExpiresInMinutes(m)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-vault-muted mb-1 uppercase tracking-wider">
                    Passcode Gate (Optional)
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Require passcode"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-vault-muted mb-1 uppercase tracking-wider">
                    Recipient Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-vault-subtle bg-vault-primary/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireEmail}
                  onChange={(e) => setRequireEmail(e.target.checked)}
                  className="rounded border-vault-subtle text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-vault-main">
                    Require Email Gate
                  </span>
                  <span className="text-[11px] text-vault-muted">
                    Viewer must enter email address to unlock file/link.
                  </span>
                </div>
              </label>

              <div className="p-3.5 rounded-xl border border-vault-subtle bg-vault-primary/40 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="mt-0.5 rounded border-vault-subtle text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-vault-main">
                        Allow File Download
                      </span>
                      {!allowDownload && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          View-Only Active
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-vault-muted block mt-0.5">
                      {allowDownload
                        ? "Recipients can view online and download the original file."
                        : "Download buttons, context menus, and drag-and-drop are blocked. In-browser viewing only."}
                    </span>
                  </div>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-vault-muted mb-1 uppercase tracking-wider">
                    Watermark (Optional)
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL • INTERNAL USE ONLY"
                    className="w-full px-3 py-2 rounded-xl border border-vault-subtle bg-vault-card text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                  />
                  <span className="text-[10px] text-vault-muted mt-1 block">
                    Stamps a repeating diagonal security overlay across images, videos, PDFs, and Office previews.
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-vault-subtle">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-vault-main border border-vault-subtle hover:bg-vault-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-deep hover:opacity-95 shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  <span>{loading ? "Activating..." : "Activate & Share"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ShareConfigModal;

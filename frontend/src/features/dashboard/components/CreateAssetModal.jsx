import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Upload,
  Link2,
  FileText,
  Shield,
  Key,
  Clock,
  CheckCircle2,
  Copy,
  AlertCircle,
  ExternalLink,
  FolderPlus,
  Share2,
} from "lucide-react";
import { createVaultShare } from "../../../apis/vaultApi.js";
import NaturalExpiryInput from "./NaturalExpiryInput.jsx";

const CreateAssetModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("file");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [expiresInMinutes, setExpiresInMinutes] = useState("");
  const [password, setPassword] = useState("");
  const [requireEmail, setRequireEmail] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [saveOnlyPrivate, setSaveOnlyPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const ext = selected.name.split(".").pop()?.toLowerCase();
      const mime = selected.type;
      const isAllowed =
        mime === "application/pdf" ||
        mime.startsWith("image/") ||
        ["pdf", "png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext);

      if (!isAllowed) {
        setError("Only PDF and Image files (PNG, JPG, WEBP, GIF, SVG) are supported for secure viewing.");
        setFile(null);
        return;
      }

      setFile(selected);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === "file" && !file) {
        throw new Error("Please select a file to upload");
      }
      if (activeTab === "url" && !url.trim()) {
        throw new Error("Please enter a destination URL");
      }

      const formData = new FormData();
      if (activeTab === "file" && file) {
        formData.append("file", file);
        formData.append("watermarkText", watermarkText || "VaultLink");
        if (saveOnlyPrivate) {
          formData.append("saveOnly", "true");
          formData.append("isShared", "false");
        }
      } else {
        formData.append("url", url.trim());
      }

      if (slug.trim()) formData.append("slug", slug.trim());
      if (expiresInMinutes) formData.append("expiresInMinutes", String(expiresInMinutes));
      if (password.trim()) formData.append("password", password.trim());
      if (requireEmail) formData.append("requireEmail", "true");
      if (recipientEmail.trim()) formData.append("recipientEmail", recipientEmail.trim());

      const res = await createVaultShare(formData);
      setResult(res);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!result?.shortUrl) return;
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setUrl("");
    setSlug("");
    setPassword("");
    setRecipientEmail("");
    setExpiresInMinutes("");
    setRequireEmail(false);
    setSaveOnlyPrivate(false);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-xl rounded-2xl bg-vault-card border border-vault-subtle shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-vault-subtle bg-vault-card/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-vault-main">
                {result
                  ? result.savedToVault
                    ? "File Saved to Private Vault"
                    : "Asset Protected & Ready"
                  : "Create Vault Asset"}
              </h3>
              <p className="text-xs text-vault-muted">
                {result
                  ? "Asset stored in zero-trust vault. You can share or access it anytime."
                  : "Upload documents or create expirable protected links"}
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

        <div className="p-6 overflow-y-auto space-y-5">
          {result ? (
            <div className="space-y-5 py-2">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {result.savedToVault
                      ? "File Stored Privately in Vault"
                      : result.deliveredViaEmail
                      ? "Dispatched to Recipient via Email"
                      : "VaultLink Created Successfully"}
                  </h4>
                  <p className="text-xs text-vault-muted mt-0.5">
                    {result.savedToVault
                      ? "Your file has been uploaded to your private vault. It is not shared publicly yet. You can click 'Share Securely' anytime from your assets list."
                      : result.deliveredViaEmail
                      ? `Access link and passcode were emailed to ${result.recipientEmail}.`
                      : "Your zero-trust asset is now active and protected according to your security policies."}
                  </p>
                </div>
              </div>

              {!result.savedToVault && result.shortUrl && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">
                    Shareable Access Link
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-vault-subtle bg-vault-primary">
                    <input
                      type="text"
                      readOnly
                      value={result.shortUrl}
                      className="flex-1 bg-transparent text-sm text-vault-main font-mono outline-none select-all"
                    />
                    <button
                      onClick={handleCopyLink}
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
              )}

              {result.password && (
                <div className="p-3 rounded-xl border border-vault-subtle bg-vault-primary flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-vault-muted font-medium">Assigned Passcode:</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-vault-main px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {result.password}
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-vault-main border border-vault-subtle hover:bg-vault-primary cursor-pointer"
                >
                  Create Another
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-deep cursor-pointer hover:opacity-90"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 p-1 rounded-xl bg-vault-primary border border-vault-subtle">
                <button
                  type="button"
                  onClick={() => setActiveTab("file")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "file"
                      ? "bg-vault-card text-indigo-500 shadow-sm"
                      : "text-vault-muted hover:text-vault-main"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Vault File Asset</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("url")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "url"
                      ? "bg-vault-card text-indigo-500 shadow-sm"
                      : "text-vault-muted hover:text-vault-main"
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Shorten & Gate URL</span>
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-500">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {activeTab === "file" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-vault-muted mb-1.5 uppercase tracking-wider">
                      Select Asset (PDF or Image Only)
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-vault-subtle rounded-xl p-5 hover:border-indigo-500/50 bg-vault-primary/40 cursor-pointer transition-colors">
                      <Upload className="w-7 h-7 text-indigo-500 mb-2" />
                      <span className="text-xs font-bold text-vault-main">
                        {file ? file.name : "Click to select or drag and drop PDF or Image"}
                      </span>
                      <span className="text-[11px] text-vault-muted mt-1">
                        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports PDF, PNG, JPG, WEBP, GIF, SVG (Up to 50MB)"}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf,image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-vault-subtle bg-vault-primary/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveOnlyPrivate}
                      onChange={(e) => setSaveOnlyPrivate(e.target.checked)}
                      className="rounded border-vault-subtle text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-vault-main flex items-center gap-1.5">
                        <FolderPlus className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Save to Vault only (Keep private, share later)</span>
                      </span>
                      <span className="text-[11px] text-vault-muted">
                        Adds file to your vault library without generating an active public link right now.
                      </span>
                    </div>
                  </label>

                  {!saveOnlyPrivate && (
                    <div>
                      <label className="block text-xs font-bold text-vault-muted mb-1 uppercase tracking-wider">
                        Watermark (Optional)
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. CONFIDENTIAL - INTERNAL USE ONLY"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-vault-muted mb-1 uppercase tracking-wider">
                      Destination URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/sensitive-resource"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {(!saveOnlyPrivate || activeTab === "url") && (
                <>
                  <div className="pt-1">
                    <NaturalExpiryInput
                      valueMinutes={expiresInMinutes}
                      onChangeMinutes={(mins) => setExpiresInMinutes(mins)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-vault-muted mb-1 uppercase tracking-wider">
                        Passcode Protection (Optional)
                      </label>
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Require passcode to unlock"
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
                        placeholder="recipient@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-vault-muted mb-1 uppercase tracking-wider">
                      Custom Shortcode (Optional)
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. q4-earnings-report"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                    />
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
                        Visitors must submit and verify email address before downloading or viewing.
                      </span>
                    </div>
                  </label>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-vault-subtle">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-vault-main border border-vault-subtle hover:bg-vault-primary transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-deep hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : saveOnlyPrivate ? (
                    <FolderPlus className="w-4 h-4" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  <span>
                    {loading
                      ? "Processing Asset..."
                      : saveOnlyPrivate
                      ? "Save to Vault Library"
                      : "Generate VaultLink"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateAssetModal;

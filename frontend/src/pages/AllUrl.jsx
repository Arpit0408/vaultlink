import React, { useState, useEffect } from "react";
import {
  Link2,
  FileText,
  Copy,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Search,
  Clock,
  Shield,
  Key,
  Plus,
  AlertCircle,
} from "lucide-react";
import { getUserVaultAssets, createVaultShare, deleteVaultAsset } from "../apis/vaultApi.js";
import NaturalExpiryInput from "../features/dashboard/components/NaturalExpiryInput.jsx";

const AllUrls = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [newUrl, setNewUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("");
  const [password, setPassword] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await getUserVaultAssets();
      const activeLinks = (Array.isArray(data) ? data : []).filter(
        (item) => item.type === "url" || item.isShared !== false
      );
      setLinks(activeLinks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreateLink = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        url: newUrl.trim(),
        slug: customSlug.trim() || undefined,
        expiresInMinutes: expiryMinutes ? String(expiryMinutes) : undefined,
        password: password.trim() || undefined,
        recipientEmail: recipientEmail.trim() || undefined,
      };

      const res = await createVaultShare(payload);
      setSuccessMsg(
        recipientEmail.trim()
          ? `Short link created & dispatched to ${recipientEmail.trim()}`
          : "Short link created successfully"
      );
      setNewUrl("");
      setCustomSlug("");
      setExpiryMinutes("");
      setPassword("");
      setRecipientEmail("");
      setTimeout(() => setSuccessMsg(null), 3500);
      fetchLinks();
    } catch (err) {
      setErrorMsg(err?.response?.data?.error || err.message || "Failed to create short link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (shortcode) => {
    if (!window.confirm(`Delete short link /${shortcode}?`)) return;
    try {
      await deleteVaultAsset(shortcode);
      setLinks((prev) => prev.filter((a) => a.short !== shortcode));
    } catch (err) {
      alert("Failed to delete link: " + (err.response?.data?.error || err.message));
    }
  };

  const handleCopy = (shortUrl, id) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getBaseOrigin = () => {
    if (typeof window !== "undefined") return window.location.origin;
    return "http://localhost:5173";
  };

  const filteredLinks = links.filter((item) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    const full = (item.full || "").toLowerCase();
    const short = (item.short || "").toLowerCase();
    const fileName = (item.file?.originalName || "").toLowerCase();
    return full.includes(query) || short.includes(query) || fileName.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-vault-main tracking-tight">
              Short Links
            </h1>
            <p className="text-xs text-vault-muted">
              Shorten, protect, and track destination URLs with expiry timers and passcodes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-vault-card border border-vault-subtle text-vault-main">
            {links.length} Active Links
          </span>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-500" />
          <h2 className="font-heading font-bold text-sm text-vault-main uppercase tracking-wider">
            Quick Link Shortener
          </h2>
        </div>

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

        <form onSubmit={handleCreateLink} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-vault-muted uppercase tracking-wider mb-1">
                Destination URL *
              </label>
              <input
                type="url"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/very-long-sensitive-destination-link"
                className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-vault-muted uppercase tracking-wider mb-1">
                Custom Shortcode (Optional)
              </label>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="my-custom-code"
                className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <NaturalExpiryInput
              valueMinutes={expiryMinutes}
              onChangeMinutes={(mins) => setExpiryMinutes(mins)}
            />

            <div>
              <label className="block text-xs font-bold text-vault-muted uppercase tracking-wider mb-1">
                Passcode Gate (Optional)
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Require password before redirect"
                className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-vault-muted uppercase tracking-wider mb-1">
              Recipient Email (Optional)
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com - automatically email link & password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!newUrl.trim() || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-deep hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-40"
            >
              {isSubmitting ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
              <span>{isSubmitting ? "Generating..." : "Shorten & Protect URL"}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h2 className="font-heading font-extrabold text-base text-vault-main">
            All Destination Links
          </h2>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search links by URL or code..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-vault-subtle bg-vault-card overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-xs text-vault-muted flex flex-col items-center justify-center gap-2">
              <Clock className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Loading Short Links...</span>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="py-16 text-center text-xs text-vault-muted flex flex-col items-center justify-center gap-2">
              <Link2 className="w-8 h-8 text-vault-muted stroke-[1.5]" />
              <p className="font-bold text-sm text-vault-main">No Short Links Found</p>
              <p className="text-vault-muted">
                {searchTerm ? "No links match your search query." : "Shorten your first URL above to track clicks and set passcodes."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-vault-primary/60 border-b border-vault-subtle text-vault-muted font-heading uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Target Destination</th>
                    <th className="py-3 px-4 font-bold">Short Link</th>
                    <th className="py-3 px-4 font-bold">Security Features</th>
                    <th className="py-3 px-4 font-bold text-center">Clicks</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vault-subtle">
                  {filteredLinks.map((item) => {
                    const fullShortUrl = `${getBaseOrigin()}/${item.short}`;
                    const isExpired = item.expiresAt && new Date() > new Date(item.expiresAt);

                    return (
                      <tr key={item._id} className="hover:bg-vault-primary/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                item.type === "file"
                                  ? "bg-indigo-500/10 text-indigo-500"
                                  : "bg-purple-500/10 text-purple-500"
                              }`}
                            >
                              {item.type === "file" ? <FileText className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                            </div>
                            <div className="flex flex-col min-w-0 max-w-[280px]">
                              <span className="font-heading font-bold text-vault-main truncate text-xs">
                                {item.type === "file" ? (item.file?.originalName || "Shared File") : item.full}
                              </span>
                              <span className="text-[10px] text-vault-muted font-mono truncate">
                                {item.type === "file" ? "Shared File • " : ""}Created {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-500">
                          <div className="flex items-center gap-1.5">
                            <span>/{item.short}</span>
                            <button
                              onClick={() => handleCopy(fullShortUrl, item._id)}
                              title="Copy link"
                              className="p-1 rounded text-vault-muted hover:text-indigo-500 transition-colors cursor-pointer"
                            >
                              {copiedId === item._id ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {item.isPasswordProtected && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <Key className="w-3 h-3" />
                                <span>Passcode Gate</span>
                              </span>
                            )}

                            {item.expiresAt && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  isExpired
                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                <span>
                                  {isExpired
                                    ? "Expired"
                                    : new Date(item.expiresAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                </span>
                              </span>
                            )}

                            {!item.isPasswordProtected && !item.expiresAt && (
                              <span className="text-[11px] text-vault-muted font-medium">Standard Link</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-vault-main">
                          {item.clicks || 0}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={fullShortUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Test Short Link"
                              className="p-1.5 rounded-lg border border-vault-subtle hover:bg-vault-primary text-vault-muted hover:text-vault-main transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleDelete(item.short)}
                              title="Delete Link"
                              className="p-1.5 rounded-lg border border-vault-subtle hover:bg-red-500/10 text-vault-muted hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUrls;

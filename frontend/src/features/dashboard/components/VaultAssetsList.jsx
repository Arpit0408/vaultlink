import React, { useState } from "react";
import {
  FileText,
  Link2,
  Copy,
  CheckCircle2,
  ExternalLink,
  Shield,
  Key,
  Clock,
  Trash2,
  Search,
  Share2,
  Lock,
  Download,
} from "lucide-react";

const VaultAssetsList = ({
  assets = [],
  loading = false,
  mode = "all",
  onDeleteAsset,
  onConfigureShare,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (shortUrl, id) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getBaseOrigin = () => {
    if (typeof window !== "undefined") return window.location.origin;
    return "http://localhost:5173";
  };

  const isFileMode = mode === "file";
  const isUrlMode = mode === "url";

  const scopedAssets = assets.filter((item) => {
    if (isFileMode) return item.type === "file";
    if (isUrlMode) return item.type === "url" || item.isShared !== false;
    if (activeFilter === "file") return item.type === "file";
    if (activeFilter === "url") return item.type === "url" || item.isShared !== false;
    return true;
  });

  const filteredAssets = scopedAssets.filter((item) => {
    if (isFileMode) {
      if (activeFilter === "watermarked" && !item.isWatermarked) return false;
      if (activeFilter === "private" && item.isShared !== false) return false;
      if (activeFilter === "shared" && item.isShared === false) return false;
    } else if (isUrlMode) {
      if (activeFilter === "protected" && !item.isPasswordProtected) return false;
      if (activeFilter === "expiring" && !item.expiresAt) return false;
    }

    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    const short = (item.short || "").toLowerCase();
    const full = (item.full || "").toLowerCase();
    const fileName = (item.file?.originalName || "").toLowerCase();
    return short.includes(query) || full.includes(query) || fileName.includes(query);
  });

  const fileCount = assets.filter((a) => a.type === "file").length;
  const urlCount = assets.filter((a) => a.type === "url" || a.isShared !== false).length;
  const watermarkedCount = assets.filter((a) => a.type === "file" && a.isWatermarked).length;
  const privateFileCount = assets.filter((a) => a.type === "file" && a.isShared === false).length;
  const passwordProtectedCount = assets.filter((a) => (a.type === "url" || a.isShared !== false) && a.isPasswordProtected).length;
  const expiringUrlCount = assets.filter((a) => (a.type === "url" || a.isShared !== false) && a.expiresAt).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-vault-primary border border-vault-subtle self-start">
          {isFileMode ? (
            <>
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-vault-card text-indigo-500 shadow-sm"
                    : "text-vault-muted hover:text-vault-main"
                }`}
              >
                All Files ({fileCount})
              </button>
              <button
                onClick={() => setActiveFilter("watermarked")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "watermarked"
                    ? "bg-vault-card text-indigo-500 shadow-sm"
                    : "text-vault-muted hover:text-vault-main"
                }`}
              >
                Watermarked ({watermarkedCount})
              </button>
              <button
                onClick={() => setActiveFilter("private")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "private"
                    ? "bg-vault-card text-indigo-500 shadow-sm"
                    : "text-vault-muted hover:text-vault-main"
                }`}
              >
                Private Vault ({privateFileCount})
              </button>
            </>
          ) : isUrlMode ? (
            <>
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-vault-card text-purple-500 shadow-sm"
                    : "text-vault-muted hover:text-vault-main"
                }`}
              >
                All Links ({urlCount})
              </button>
              <button
                onClick={() => setActiveFilter("protected")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "protected"
                    ? "bg-vault-card text-purple-500 shadow-sm"
                    : "text-vault-muted hover:text-vault-main"
                }`}
              >
                Passcode Protected ({passwordProtectedCount})
              </button>
              <button
                onClick={() => setActiveFilter("expiring")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "expiring"
                    ? "bg-vault-card text-purple-500 shadow-sm"
                    : "text-vault-muted hover:text-vault-main"
                }`}
              >
                Expiring ({expiringUrlCount})
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveFilter("file")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "file"
                    ? "bg-vault-card text-indigo-500 shadow-sm"
                    : "text-vault-muted hover:text-vault-main"
                }`}
              >
                File Assets ({fileCount})
              </button>
              <button
                onClick={() => setActiveFilter("url")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "url"
                    ? "bg-vault-card text-purple-500 shadow-sm"
                    : "text-vault-muted hover:text-vault-main"
                }`}
              >
                Short Links ({urlCount})
              </button>
            </>
          )}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isFileMode
                ? "Search file assets by name..."
                : isUrlMode
                ? "Search destination URLs or slugs..."
                : "Search assets..."
            }
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-vault-subtle bg-vault-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-xs text-vault-muted flex flex-col items-center justify-center gap-2">
            <Clock className="w-5 h-5 animate-spin text-indigo-500" />
            <span>Loading {isFileMode ? "File Assets" : isUrlMode ? "Short Links" : "Assets"}...</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="py-16 text-center text-xs text-vault-muted flex flex-col items-center justify-center gap-2">
            {isFileMode ? (
              <FileText className="w-8 h-8 text-vault-muted stroke-[1.5]" />
            ) : (
              <Link2 className="w-8 h-8 text-vault-muted stroke-[1.5]" />
            )}
            <p className="font-bold text-sm text-vault-main">
              {isFileMode
                ? "No File Assets Found"
                : isUrlMode
                ? "No Short Links Found"
                : "No Assets Found"}
            </p>
            <p className="text-vault-muted">
              {searchTerm
                ? "No records match your search criteria."
                : isFileMode
                ? "Upload documents to your cloud vault to manage them."
                : "Shorten and protect your destination links."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-vault-primary/60 border-b border-vault-subtle text-vault-muted font-heading uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">
                    {isFileMode ? "File Asset" : isUrlMode ? "Asset / Destination" : "Asset / Target"}
                  </th>
                  <th className="py-3 px-4 font-bold">
                    {isFileMode ? "Vault Link" : "Short Code"}
                  </th>
                  <th className="py-3 px-4 font-bold">Security Policies</th>
                  <th className="py-3 px-4 font-bold text-center">
                    {isFileMode ? "Views" : "Clicks / Views"}
                  </th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vault-subtle">
                {filteredAssets.map((item) => {
                  const fullShortUrl = `${getBaseOrigin()}/${item.short}`;
                  const isFile = item.type === "file";
                  const isPrivate = item.isShared === false;
                  const isExpired = item.expiresAt && new Date() > new Date(item.expiresAt);

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-vault-primary/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isFile
                                ? "bg-indigo-500/10 text-indigo-500"
                                : "bg-purple-500/10 text-purple-500"
                            }`}
                          >
                            {isFile ? <FileText className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col min-w-0 max-w-[240px]">
                            <span className="font-heading font-bold text-vault-main truncate text-xs">
                              {isFile ? (item.file?.originalName || "Untitled File") : item.full}
                            </span>
                            <span className="text-[10px] text-vault-muted font-mono truncate">
                              {isFile
                                ? `${((item.file?.size || 0) / 1024 / 1024).toFixed(2)} MB • Cloud Vault`
                                : item.full}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isPrivate ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Lock className="w-3 h-3" />
                            <span>Private in Vault</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5 font-mono font-bold text-indigo-500">
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
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.isWatermarked && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                              <Shield className="w-3 h-3" />
                              <span>Watermarked</span>
                            </span>
                          )}

                          {item.isPasswordProtected && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              <Key className="w-3 h-3" />
                              <span>Passcode</span>
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

                          {!item.isWatermarked &&
                            !item.isPasswordProtected &&
                            !item.expiresAt &&
                            !isPrivate && (
                              <span className="text-[11px] text-vault-muted font-medium">Standard</span>
                            )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-vault-main">
                        {item.clicks || 0}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isFile && (item.file?.cloudUrl || item.file?.url) && (
                            <a
                              href={item.file?.cloudUrl || item.file?.url}
                              target="_blank"
                              rel="noreferrer"
                              download
                              title="Download original file"
                              className="p-1.5 rounded-lg border border-vault-subtle hover:bg-vault-primary text-vault-muted hover:text-emerald-500 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {isPrivate ? (
                            <button
                              onClick={() => onConfigureShare && onConfigureShare(item)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white bg-brand-deep hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Share Securely</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => onConfigureShare && onConfigureShare(item)}
                                title="Edit Share Policy"
                                className="p-1.5 rounded-lg border border-vault-subtle hover:bg-vault-primary text-vault-muted hover:text-indigo-500 transition-colors cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>

                              <a
                                href={fullShortUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Open Link"
                                className="p-1.5 rounded-lg border border-vault-subtle hover:bg-vault-primary text-vault-muted hover:text-vault-main transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </>
                          )}

                          {onDeleteAsset && (
                            <button
                              onClick={() => onDeleteAsset(item.short)}
                              title="Delete Asset"
                              className="p-1.5 rounded-lg border border-vault-subtle hover:bg-red-500/10 text-vault-muted hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
  );
};

export default VaultAssetsList;

import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Shield,
  Lock,
  Share2,
  Trash2,
  ExternalLink,
  Download,
  Copy,
  CheckCircle2,
  Clock,
  Search,
  Key,
  Users,
  AlertCircle,
  FolderLock,
  Plus,
} from "lucide-react";
import { getUserVaultAssets, createVaultShare, deleteVaultAsset } from "../apis/vaultApi.js";
import ShareConfigModal from "../features/dashboard/components/ShareConfigModal.jsx";
import LeadsViewerModal from "../features/dashboard/components/LeadsViewerModal.jsx";

const FileVaultPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [activeShareAsset, setActiveShareAsset] = useState(null);
  const [activeLeadsCode, setActiveLeadsCode] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await getUserVaultAssets();
      const filesOnly = (Array.isArray(data) ? data : []).filter((item) => item.type === "file");
      setAssets(filesOnly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("watermarkText", watermarkText || "VaultLink");
      formData.append("saveOnly", "true");
      formData.append("isShared", "false");

      await createVaultShare(formData);
      setUploadSuccess(true);
      setSelectedFile(null);
      setTimeout(() => setUploadSuccess(false), 3000);
      fetchFiles();
    } catch (err) {
      setUploadError(err?.response?.data?.error || err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (shortcode) => {
    if (!window.confirm(`Delete file asset /${shortcode} from vault?`)) return;
    try {
      await deleteVaultAsset(shortcode);
      setAssets((prev) => prev.filter((a) => a.short !== shortcode));
    } catch (err) {
      alert("Failed to delete file: " + (err.response?.data?.error || err.message));
    }
  };

  const handleCopyLink = (shortUrl, id) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getBaseOrigin = () => {
    if (typeof window !== "undefined") return window.location.origin;
    return "http://localhost:5173";
  };

  const filteredFiles = assets.filter((item) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    const name = (item.file?.originalName || "").toLowerCase();
    const short = (item.short || "").toLowerCase();
    return name.includes(query) || short.includes(query);
  });

  const totalWatermarked = assets.filter((f) => f.isWatermarked).length;
  const privateCount = assets.filter((f) => f.isShared === false).length;
  const sharedCount = assets.filter((f) => f.isShared !== false).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <FolderLock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-vault-main tracking-tight">
              File Vault Library
            </h1>
            <p className="text-xs text-vault-muted">
              Securely store documents, manage cloud assets, and configure zero-trust sharing on demand.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-vault-card border border-vault-subtle text-vault-main">
            {assets.length} Files in Vault
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-1.5">
          <span className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">
            Total Vault Files
          </span>
          <div className="text-2xl font-heading font-extrabold text-vault-main">
            {assets.length}
          </div>
          <p className="text-[11px] text-vault-muted">Stored in cloud storage</p>
        </div>

        <div className="p-4 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-1.5">
          <span className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">
            Watermarked
          </span>
          <div className="text-2xl font-heading font-extrabold text-vault-main">
            {totalWatermarked}
          </div>
          <p className="text-[11px] text-vault-muted">Protected with stamp</p>
        </div>

        <div className="p-4 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-1.5">
          <span className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">
            Private in Vault
          </span>
          <div className="text-2xl font-heading font-extrabold text-amber-500">
            {privateCount}
          </div>
          <p className="text-[11px] text-vault-muted">Not shared yet (Safe)</p>
        </div>

        <div className="p-4 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-1.5">
          <span className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">
            Active Shared Links
          </span>
          <div className="text-2xl font-heading font-extrabold text-indigo-500">
            {sharedCount}
          </div>
          <p className="text-[11px] text-vault-muted">Live gated links</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-indigo-500" />
          <h2 className="font-heading font-bold text-sm text-vault-main uppercase tracking-wider">
            Upload & Add File to Vault
          </h2>
        </div>

        {uploadSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>File uploaded successfully to your private vault. You can share it anytime below!</span>
          </div>
        )}

        {uploadError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-500">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-vault-subtle rounded-2xl p-6 hover:border-indigo-500/60 bg-vault-primary/40 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-xs font-bold text-vault-main">
                  {selectedFile ? selectedFile.name : "Click to select or drag and drop any file"}
                </span>
                <span className="text-[11px] text-vault-muted mt-1">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : "PDFs, Documents, PNGs, JPEGs up to 50MB"}
                </span>
                <input type="file" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>

            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-vault-muted uppercase tracking-wider mb-1">
                  Watermark Overlay Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
                />
                <p className="text-[11px] text-vault-muted mt-1">
                  Images get dynamically watermarked upon upload.
                </p>
              </div>

              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-brand-deep hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-40"
              >
                {isUploading ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{isUploading ? "Uploading to Cloud Vault..." : "Save to Private Vault"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h2 className="font-heading font-extrabold text-base text-vault-main">
            Uploaded Vault Documents
          </h2>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files by name..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-vault-subtle bg-vault-primary text-xs text-vault-main outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-vault-subtle bg-vault-card overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-xs text-vault-muted flex flex-col items-center justify-center gap-2">
              <Clock className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Loading Vault Files...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="py-16 text-center text-xs text-vault-muted flex flex-col items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-vault-muted stroke-[1.5]" />
              <p className="font-bold text-sm text-vault-main">No Files in Vault</p>
              <p className="text-vault-muted">
                {searchTerm
                  ? "No files match your search query."
                  : "Upload your first file above to securely store and share it."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-vault-primary/60 border-b border-vault-subtle text-vault-muted font-heading uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Document Name</th>
                    <th className="py-3 px-4 font-bold">Size & Cloud</th>
                    <th className="py-3 px-4 font-bold">Status / Link</th>
                    <th className="py-3 px-4 font-bold">Security Features</th>
                    <th className="py-3 px-4 font-bold text-center">Downloads</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vault-subtle">
                  {filteredFiles.map((item) => {
                    const fullShortUrl = `${getBaseOrigin()}/${item.short}`;
                    const isPrivate = item.isShared === false;
                    const fileUrl = item.file?.cloudUrl || `/api/vault/${item.short}/download`;

                    return (
                      <tr key={item._id} className="hover:bg-vault-primary/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0 max-w-[220px]">
                              <span className="font-heading font-bold text-vault-main truncate text-xs">
                                {item.file?.originalName || "Untitled File"}
                              </span>
                              <span className="text-[10px] text-vault-muted font-mono truncate">
                                Added {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <span className="text-vault-main font-semibold">
                            {((item.file?.size || 0) / 1024 / 1024).toFixed(2)} MB
                          </span>
                          <span className="block text-[10px] text-emerald-500 font-bold">
                            Cloud Secured
                          </span>
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
                                onClick={() => handleCopyLink(fullShortUrl, item._id)}
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

                            {item.requireEmail && (
                              <button
                                onClick={() => setActiveLeadsCode(item.short)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 cursor-pointer"
                              >
                                <Users className="w-3 h-3" />
                                <span>Email Gate</span>
                              </button>
                            )}

                            {item.expiresAt && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                <Clock className="w-3 h-3" />
                                <span>Expiring</span>
                              </span>
                            )}

                            {!item.isWatermarked && !item.isPasswordProtected && !item.requireEmail && !item.expiresAt && (
                              <span className="text-[11px] text-vault-muted font-medium">Standard Vault</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-vault-main">
                          {item.clicks || 0}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.file?.cloudUrl && (
                              <a
                                href={item.file.cloudUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Download / View Original File"
                                className="p-1.5 rounded-lg border border-vault-subtle hover:bg-vault-primary text-vault-muted hover:text-emerald-500 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              onClick={() => setActiveShareAsset(item)}
                              title={isPrivate ? "Share Securely" : "Configure Share Policy"}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                isPrivate
                                  ? "bg-brand-deep text-white hover:opacity-90 shadow-sm"
                                  : "border border-vault-subtle hover:bg-vault-primary text-vault-muted hover:text-indigo-500"
                              }`}
                            >
                              <Share2 className="w-3 h-3" />
                              <span>{isPrivate ? "Share" : "Edit Policy"}</span>
                            </button>

                            <button
                              onClick={() => handleDelete(item.short)}
                              title="Delete File"
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

      <ShareConfigModal
        asset={activeShareAsset}
        isOpen={Boolean(activeShareAsset)}
        onClose={() => setActiveShareAsset(null)}
        onSuccess={() => {
          fetchFiles();
        }}
      />

      <LeadsViewerModal
        shortcode={activeLeadsCode}
        isOpen={Boolean(activeLeadsCode)}
        onClose={() => setActiveLeadsCode(null)}
      />
    </div>
  );
};

export default FileVaultPage;

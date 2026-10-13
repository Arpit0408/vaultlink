import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "@tanstack/react-router";
import {
  Shield,
  FileText,
  Link2,
  Users,
  Eye,
  Plus,
  Lock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { getUserVaultAssets, deleteVaultAsset } from "../../../apis/vaultApi.js";
import VaultAssetsList from "./VaultAssetsList.jsx";
import CreateAssetModal from "./CreateAssetModal.jsx";
import LeadsViewerModal from "./LeadsViewerModal.jsx";
import ShareConfigModal from "./ShareConfigModal.jsx";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeLeadsCode, setActiveLeadsCode] = useState(null);
  const [activeShareAsset, setActiveShareAsset] = useState(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await getUserVaultAssets();
      setAssets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load user assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async (shortcode) => {
    if (!window.confirm(`Are you sure you want to remove asset /${shortcode}?`)) return;
    try {
      await deleteVaultAsset(shortcode);
      setAssets((prev) => prev.filter((a) => a.short !== shortcode));
    } catch (err) {
      alert("Failed to delete asset: " + (err.response?.data?.error || err.message));
    }
  };

  const totalClicks = assets.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalFiles = assets.filter((a) => a.type === "file").length;
  const totalUrls = assets.filter((a) => a.type === "url" || a.isShared !== false).length;
  const totalWatermarked = assets.filter((a) => a.isWatermarked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-vault-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-vault-main tracking-tight">
              Welcome back, {user?.name || "Vault Admin"}
            </h1>
            <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-vault-muted">
            Manage your zero-trust documents, cloud file vault, and secured short links.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-deep hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Vault Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-vault-muted uppercase tracking-wider">
              Vault Files
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-main">
            {totalFiles}
          </div>
          <p className="text-[11px] text-vault-muted">Documents in cloud vault</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-vault-muted uppercase tracking-wider">
              Short Links
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-main">
            {totalUrls}
          </div>
          <p className="text-[11px] text-vault-muted">Active destination links</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-vault-muted uppercase tracking-wider">
              Total Views
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-main">
            {totalClicks}
          </div>
          <p className="text-[11px] text-vault-muted">Direct visitor interactions</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-vault-subtle bg-vault-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-vault-muted uppercase tracking-wider">
              Watermarked
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-main">
            {totalWatermarked}
          </div>
          <p className="text-[11px] text-vault-muted">Protected with anti-leak stamp</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => navigate({ to: "/dashboard/files" })}
          className="p-5 rounded-2xl border border-vault-subtle bg-vault-card hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm flex items-start justify-between"
        >
          <div className="space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-vault-main group-hover:text-indigo-500 transition-colors">
              Manage File Vault & Watermarks
            </h3>
            <p className="text-xs text-vault-muted max-w-sm">
              Dedicated file drive. Upload documents, manage cloud storage, apply dynamic diagonal watermarks, and share on demand.
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-vault-muted group-hover:text-indigo-500 transition-colors shrink-0" />
        </div>

        <div
          onClick={() => setIsCreateOpen(true)}
          className="p-5 rounded-2xl border border-vault-subtle bg-vault-card hover:border-purple-500/50 transition-all cursor-pointer group shadow-sm flex items-start justify-between"
        >
          <div className="space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Link2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-vault-main group-hover:text-purple-500 transition-colors">
              Protect & Shorten Destination URL
            </h3>
            <p className="text-xs text-vault-muted max-w-sm">
              Turn long links into brand shortcodes with optional email gate verification, passcodes, and expiry timers.
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-vault-muted group-hover:text-purple-500 transition-colors shrink-0" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <h2 className="font-heading font-extrabold text-base text-vault-main">
              Recent File Assets
            </h2>
          </div>
          <button
            onClick={() => navigate({ to: "/dashboard/files" })}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Files ({assets.filter((a) => a.type === "file").length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <VaultAssetsList
          assets={assets.filter((a) => a.type === "file")}
          mode="file"
          loading={loading}
          onDeleteAsset={handleDelete}
          onConfigureShare={(item) => setActiveShareAsset(item)}
          onRefresh={fetchAssets}
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-purple-500" />
            <h2 className="font-heading font-extrabold text-base text-vault-main">
              Recent Short Links
            </h2>
          </div>
          <button
            onClick={() => navigate({ to: "/dashboard/allurls" })}
            className="text-xs font-bold text-purple-500 hover:text-purple-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Links ({assets.filter((a) => a.type === "url" || a.isShared !== false).length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <VaultAssetsList
          assets={assets.filter((a) => a.type === "url" || a.isShared !== false)}
          mode="url"
          loading={loading}
          onDeleteAsset={handleDelete}
          onConfigureShare={(item) => setActiveShareAsset(item)}
          onRefresh={fetchAssets}
        />
      </div>

      <CreateAssetModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          fetchAssets();
        }}
      />

      <ShareConfigModal
        asset={activeShareAsset}
        isOpen={Boolean(activeShareAsset)}
        onClose={() => setActiveShareAsset(null)}
        onSuccess={() => {
          fetchAssets();
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

export default DashboardOverview;

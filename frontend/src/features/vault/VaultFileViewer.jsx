import React, { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  EyeOff,
  Shield,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  ExternalLink,
  Lock,
  FileCheck2,
  AlertCircle,
  Play,
} from "lucide-react";

const VaultFileViewer = ({
  fileData,
  viewerEmail = "",
  shortcode = "",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeOfficeProvider, setActiveOfficeProvider] = useState("microsoft");
  const [iframeError, setIframeError] = useState(false);

  const fileName = fileData?.fileName || "Protected Asset";
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const mime = fileData?.mimeType || "";
  const allowDownload = fileData?.allowDownload !== false;
  const isWatermarked = fileData?.isWatermarked !== false;
  const watermarkText =
    fileData?.watermarkText || "CONFIDENTIAL • VAULTLINK GOVERNANCE";

  const rawUrl = fileData?.cloudUrl || fileData?.downloadUrl || "";
  const resolvedFileUrl = rawUrl.startsWith("http")
    ? rawUrl
    : typeof window !== "undefined"
    ? `${window.location.origin}${rawUrl}`
    : rawUrl;

  const isImage =
    ["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp"].includes(ext) ||
    mime.startsWith("image/");
  const isVideo =
    ["mp4", "webm", "ogg", "mov", "m4v"].includes(ext) ||
    mime.startsWith("video/");
  const isAudio =
    ["mp3", "wav", "ogg", "m4a", "aac"].includes(ext) ||
    mime.startsWith("audio/");
  const isPdf = ext === "pdf" || mime.includes("pdf");
  const isOffice = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext);
  const isText = ["txt", "csv", "json", "md", "xml", "log", "js", "html"].includes(ext);

  const msOfficeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    resolvedFileUrl
  )}`;
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    resolvedFileUrl
  )}&embedded=true`;

  const handlePreventContext = (e) => {
    if (!allowDownload) {
      e.preventDefault();
    }
  };

  const watermarkStamp = `${watermarkText}${
    viewerEmail ? ` • ${viewerEmail}` : ""
  } • ${new Date().toLocaleDateString()}`;

  const renderWatermarkOverlay = () => {
    if (!isWatermarked) return null;

    const repetitions = Array.from({ length: 48 });

    return (
      <div
        className="pointer-events-none select-none absolute inset-0 overflow-hidden z-20 flex flex-wrap items-center justify-around gap-x-16 gap-y-16 p-8"
        style={{ transform: "rotate(-25deg) scale(1.3)" }}
        aria-hidden="true"
      >
        {repetitions.map((_, i) => (
          <div
            key={i}
            className="text-[13px] sm:text-sm font-mono font-black text-slate-500/25 dark:text-white/20 whitespace-nowrap tracking-wider uppercase drop-shadow-sm"
          >
            {watermarkStamp}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col rounded-3xl border border-vault-subtle bg-vault-card shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none w-screen h-screen bg-vault-primary"
          : "w-full max-w-5xl mx-auto"
      }`}
      onContextMenu={handlePreventContext}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-vault-subtle bg-vault-card/95 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-extrabold text-sm sm:text-base text-vault-main truncate max-w-xs sm:max-w-md">
              {fileName}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-vault-muted font-mono mt-0.5">
              <span>{ext.toUpperCase()}</span>
              {fileData?.size ? (
                <>
                  <span>•</span>
                  <span>{(fileData.size / 1024 / 1024).toFixed(2)} MB</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!allowDownload ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <EyeOff className="w-3.5 h-3.5" />
              <span>View Only</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Eye className="w-3.5 h-3.5" />
              <span>Verified Preview</span>
            </span>
          )}

          {isWatermarked && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Shield className="w-3 h-3" />
              <span>Watermarked</span>
            </span>
          )}

          {isImage && (
            <div className="hidden sm:flex items-center border border-vault-subtle rounded-xl p-0.5 bg-vault-primary">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.25))}
                className="p-1.5 rounded-lg text-vault-muted hover:text-vault-main cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-vault-main">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                className="p-1.5 rounded-lg text-vault-muted hover:text-vault-main cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border border-vault-subtle bg-vault-primary text-vault-muted hover:text-vault-main transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {allowDownload && (
            <a
              href={fileData?.downloadUrl || resolvedFileUrl}
              download={fileName}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}
        </div>
      </div>

      <div
        className={`relative w-full overflow-hidden bg-slate-950 flex items-center justify-center select-none ${
          isFullscreen ? "flex-1" : "min-h-[500px] max-h-[750px]"
        }`}
        style={{ userSelect: "none" }}
      >
        {renderWatermarkOverlay()}

        {isImage && (
          <div className="relative w-full h-full p-4 flex items-center justify-center overflow-auto">
            <img
              src={resolvedFileUrl}
              alt={fileName}
              draggable={false}
              onContextMenu={handlePreventContext}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.15s ease-out",
                maxHeight: isFullscreen ? "90vh" : "650px",
              }}
              className="object-contain rounded-xl shadow-2xl pointer-events-auto"
            />
          </div>
        )}

        {isVideo && (
          <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
            <video
              src={resolvedFileUrl}
              controls
              playsInline
              controlsList={!allowDownload ? "nodownload noplaybackrate" : undefined}
              disablePictureInPicture={!allowDownload}
              onContextMenu={handlePreventContext}
              className="max-h-[650px] w-full rounded-2xl shadow-2xl object-contain bg-black z-10"
            />
          </div>
        )}

        {isAudio && (
          <div className="w-full max-w-lg p-8 z-10 flex flex-col items-center gap-6 rounded-3xl bg-vault-card/90 border border-vault-subtle backdrop-blur-xl">
            <div className="w-20 h-20 rounded-3xl bg-brand-deep text-white flex items-center justify-center shadow-xl shadow-indigo-500/25 animate-pulse">
              <Play className="w-10 h-10 ml-1" />
            </div>
            <div className="text-center">
              <h3 className="font-heading font-extrabold text-lg text-vault-main">
                {fileName}
              </h3>
              <p className="text-xs text-vault-muted mt-1 font-mono">
                Encrypted Audio Stream
              </p>
            </div>
            <audio
              src={resolvedFileUrl}
              controls
              controlsList={!allowDownload ? "nodownload" : undefined}
              className="w-full"
            />
          </div>
        )}

        {isPdf && (
          <div className="relative w-full h-full min-h-[600px] flex flex-col">
            <iframe
              src={`${resolvedFileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={fileName}
              className="w-full h-full min-h-[600px] border-none"
              onContextMenu={handlePreventContext}
            />
          </div>
        )}

        {isOffice && (
          <div className="relative w-full h-full min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-300 z-10">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Office Viewer Provider:</span>
                <button
                  onClick={() => setActiveOfficeProvider("microsoft")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    activeOfficeProvider === "microsoft"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Microsoft 365
                </button>
                <button
                  onClick={() => setActiveOfficeProvider("google")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    activeOfficeProvider === "google"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Google Docs
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Read-Only Governance Frame
              </span>
            </div>

            <iframe
              src={activeOfficeProvider === "microsoft" ? msOfficeUrl : googleDocsUrl}
              title={fileName}
              className="w-full h-full min-h-[600px] border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        )}

        {!isImage && !isVideo && !isAudio && !isPdf && !isOffice && (
          <div className="w-full max-w-md p-8 z-10 flex flex-col items-center text-center gap-4 rounded-3xl bg-vault-card/90 border border-vault-subtle backdrop-blur-xl m-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-vault-main">
                {fileName}
              </h3>
              <p className="text-xs text-vault-muted mt-1">
                Zero-Trust Secure Container Encrypted
              </p>
            </div>

            {allowDownload ? (
              <a
                href={fileData?.downloadUrl || resolvedFileUrl}
                download={fileName}
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-deep text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 hover:opacity-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Secure File</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                <Lock className="w-4 h-4" />
                <span>Direct Download Restricted by Asset Policy</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-vault-subtle bg-vault-card/90 flex flex-wrap items-center justify-between text-xs text-vault-muted gap-2">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-indigo-500" />
          <span>Zero-Trust Vault Security Active</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          {!allowDownload ? (
            <span className="text-amber-500 font-bold">
              Download Guard: Enforced
            </span>
          ) : (
            <span className="text-emerald-500 font-bold">
              Download Permitted
            </span>
          )}
          <span>Watermark: {isWatermarked ? "Stamped" : "None"}</span>
        </div>
      </div>
    </div>
  );
};

export default VaultFileViewer;

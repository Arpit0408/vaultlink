import React, { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  Lock,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

const VaultFileViewer = ({
  fileData,
  viewerEmail = "",
  shortcode = "",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);
  const [securityNotice, setSecurityNotice] = useState(null);
  const [isWhiteoutActive, setIsWhiteoutActive] = useState(false);

  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);

  const fileName = fileData?.fileName || "Protected Asset";
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const mime = fileData?.mimeType || "";
  const allowDownload = fileData?.allowDownload !== false;
  const isWatermarked = !allowDownload || Boolean(fileData?.isWatermarked);
  const watermarkText =
    fileData?.watermarkText || "CONFIDENTIAL • VIEW-ONLY VAULT";

  const rawUrl = fileData?.cloudUrl || fileData?.downloadUrl || "";
  const resolvedFileUrl = rawUrl.startsWith("http")
    ? rawUrl
    : typeof window !== "undefined"
    ? `${window.location.origin}${rawUrl}`
    : rawUrl;

  const isImage =
    ["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp"].includes(ext) ||
    mime.startsWith("image/");
  const isPdf = ext === "pdf" || mime.includes("pdf");

  const watermarkStamp = `${watermarkText}${
    viewerEmail ? ` • ${viewerEmail}` : ""
  } • ${new Date().toLocaleDateString()}`;

  const triggerSecurityAlert = (msg) => {
    setSecurityNotice(msg);
    setTimeout(() => setSecurityNotice(null), 3000);
  };

  useEffect(() => {
    if (allowDownload) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerSecurityAlert("Right-click context menu is restricted on this protected file.");
    };

    const handleWindowBlur = () => {
      setIsWhiteoutActive(true);
    };

    const handleWindowFocus = () => {
      setIsWhiteoutActive(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWhiteoutActive(true);
      } else {
        setIsWhiteoutActive(false);
      }
    };

    const handleKeyDown = (e) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;

      if (isCmdOrCtrl && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityAlert("Saving this protected document is restricted.");
      }

      if (isCmdOrCtrl && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityAlert("Printing this protected document is restricted.");
      }

      if (isCmdOrCtrl && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityAlert("Copying content is disabled.");
      }

      if (isCmdOrCtrl && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
      }

      if (
        e.key === "F12" ||
        (isCmdOrCtrl && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key))
      ) {
        e.preventDefault();
      }

      if (
        e.key === "PrintScreen" ||
        e.keyCode === 44 ||
        e.code === "PrintScreen" ||
        (isCmdOrCtrl && e.shiftKey && (e.key === "s" || e.key === "S")) ||
        (e.metaKey && e.shiftKey && ["3", "4", "5", "s", "S"].includes(e.key))
      ) {
        e.preventDefault();
        setIsWhiteoutActive(true);
        setTimeout(() => setIsWhiteoutActive(false), 3000);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("").catch(() => {});
        }
        triggerSecurityAlert("Screenshots are restricted by vault security policy.");
      }
    };

    const handleKeyUp = (e) => {
      if (
        e.key === "PrintScreen" ||
        e.keyCode === 44 ||
        e.code === "PrintScreen"
      ) {
        setIsWhiteoutActive(true);
        setTimeout(() => setIsWhiteoutActive(false), 3000);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("").catch(() => {});
        }
        triggerSecurityAlert("Screenshots are restricted by vault security policy.");
      }
    };

    const handleDragStart = (e) => {
      e.preventDefault();
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("selectstart", handleSelectStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("selectstart", handleSelectStart);
    };
  }, [allowDownload]);

  useEffect(() => {
    if (!isPdf || !resolvedFileUrl) return;

    let isCancelled = false;

    const loadPdfJsScript = () => {
      return new Promise((resolve, reject) => {
        if (window.pdfjsLib) {
          return resolve(window.pdfjsLib);
        }
        const existingScript = document.getElementById("pdfjs-lib-cdn");
        if (existingScript) {
          existingScript.addEventListener("load", () => resolve(window.pdfjsLib));
          existingScript.addEventListener("error", reject);
          return;
        }
        const script = document.createElement("script");
        script.id = "pdfjs-lib-cdn";
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.async = true;
        script.onload = () => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            resolve(window.pdfjsLib);
          } else {
            reject(new Error("pdfjsLib not defined"));
          }
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    setPdfLoading(true);
    setPdfError(null);

    loadPdfJsScript()
      .then((pdfjs) => {
        const loadingTask = pdfjs.getDocument({
          url: resolvedFileUrl,
          withCredentials: false,
        });
        return loadingTask.promise;
      })
      .then((doc) => {
        if (isCancelled) return;
        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setPdfLoading(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        setPdfError(err.message || "Failed to render PDF in canvas mode");
        setPdfLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isPdf, resolvedFileUrl]);

  useEffect(() => {
    if (!isPdf || !pdfDocRef.current || !canvasRef.current) return;

    let isRenderCancelled = false;

    pdfDocRef.current
      .getPage(currentPage)
      .then((page) => {
        if (isRenderCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const unscaledViewport = page.getViewport({ scale: 1 });
        const targetWidth = Math.min(window.innerWidth * 0.85, 900) * zoomLevel;
        const scale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        return page.render(renderContext).promise;
      })
      .catch((err) => {
        if (!isRenderCancelled) {
          console.error("PDF render error:", err);
        }
      });

    return () => {
      isRenderCancelled = true;
    };
  }, [isPdf, currentPage, zoomLevel]);

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

  const handlePreventContext = (e) => {
    if (!allowDownload) {
      e.preventDefault();
      triggerSecurityAlert("Right-click context menu is restricted.");
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            display: none !important;
          }
          html::before {
            content: "CONFIDENTIAL ASSET • PRINTING RESTRICTED BY VAULTLINK GOVERNANCE";
            display: block !important;
            font-size: 20pt;
            font-weight: bold;
            color: #ef4444;
            text-align: center;
            margin-top: 150px;
          }
        }
      `}</style>

      <div
        className={`flex flex-col rounded-3xl border border-vault-subtle bg-vault-card shadow-2xl overflow-hidden transition-all duration-300 select-none relative ${
          isFullscreen
            ? "fixed inset-0 z-50 rounded-none w-screen h-screen bg-vault-primary"
            : "w-full max-w-5xl mx-auto"
        }`}
        onContextMenu={handlePreventContext}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        {isWhiteoutActive && !allowDownload && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 text-center select-none cursor-default">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20 shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-heading font-black text-slate-900 tracking-tight">
              CONFIDENTIAL DOCUMENT PROTECTED
            </h3>
            <p className="text-xs text-slate-600 max-w-md mt-2 font-medium">
              Screen capture or window switch detected. Screenshots and downloads are restricted for this view-only document. Click back onto this window to resume viewing.
            </p>
          </div>
        )}

        {securityNotice && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-md z-30 animate-pulse">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{securityNotice}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-vault-subtle bg-vault-card/95 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <EyeOff className="w-3.5 h-3.5" />
                <span>View Only</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Eye className="w-3.5 h-3.5" />
                <span>Verified Preview</span>
              </span>
            )}

            {isWatermarked && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <Shield className="w-3 h-3" />
                <span>Watermarked</span>
              </span>
            )}

            <div className="flex items-center border border-vault-subtle rounded-xl p-0.5 bg-vault-primary">
              <button
                type="button"
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
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                className="p-1.5 rounded-lg text-vault-muted hover:text-vault-main cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {isPdf && numPages > 1 && (
              <div className="flex items-center border border-vault-subtle rounded-xl p-0.5 bg-vault-primary">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg text-vault-muted hover:text-vault-main disabled:opacity-30 cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-1.5 text-vault-main">
                  {currentPage} / {numPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= numPages}
                  onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                  className="p-1.5 rounded-lg text-vault-muted hover:text-vault-main disabled:opacity-30 cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
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
          className={`relative w-full overflow-auto bg-slate-950 flex items-center justify-center select-none ${
            isFullscreen ? "flex-1 min-h-0" : "min-h-[500px] max-h-[750px]"
          }`}
          onContextMenu={handlePreventContext}
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
                className="object-contain rounded-xl shadow-2xl pointer-events-auto select-none"
              />
            </div>
          )}

          {isPdf && (
            <div className="relative w-full h-full min-h-[550px] p-4 flex flex-col items-center justify-start overflow-auto">
              {pdfLoading && (
                <div className="py-24 flex flex-col items-center gap-3 text-vault-muted text-xs">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <span>Loading PDF pages securely...</span>
                </div>
              )}

              {pdfError ? (
                <div className="relative w-full h-full min-h-[550px] flex flex-col">
                  {!allowDownload && (
                    <div
                      className="absolute inset-0 z-20 cursor-default"
                      onContextMenu={handlePreventContext}
                    />
                  )}
                  <iframe
                    src={`${resolvedFileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    title={fileName}
                    className="w-full h-full min-h-[550px] border-none bg-white rounded-xl"
                  />
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  onContextMenu={handlePreventContext}
                  className="rounded-xl shadow-2xl border border-slate-800 bg-white select-none pointer-events-auto"
                />
              )}
            </div>
          )}

          {!isImage && !isPdf && (
            <div className="w-full max-w-md p-8 z-10 flex flex-col items-center text-center gap-4 rounded-3xl bg-vault-card/90 border border-vault-subtle backdrop-blur-xl m-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-vault-main">
                  {fileName}
                </h3>
                <p className="text-xs text-vault-muted mt-1">
                  Protected Document Format
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
                  <span>Download Restricted by Asset Policy</span>
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
                Anti-Leak Guard: Enforced
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
    </>
  );
};

export default VaultFileViewer;

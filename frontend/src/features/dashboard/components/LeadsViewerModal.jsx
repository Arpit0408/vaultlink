import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Mail, Users, Clock, AlertCircle } from "lucide-react";
import { getVaultLeads } from "../../../apis/vaultApi.js";

const LeadsViewerModal = ({ shortcode, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !shortcode) return;
    setLoading(true);
    setError(null);

    getVaultLeads(shortcode)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err?.response?.data?.error || err.message || "Failed to load leads");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, shortcode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg rounded-2xl bg-vault-card border border-vault-subtle shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-vault-subtle bg-vault-card/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-vault-main">
                Captured Leads
              </h3>
              <p className="text-xs text-vault-muted">
                Visitors who unlocked asset /{shortcode}
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
          {loading && (
            <div className="py-8 text-center text-xs text-vault-muted flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin text-indigo-500" />
              <span>Fetching captured lead records...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-500">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && data && (
            <>
              <div className="flex items-center justify-between p-3 rounded-xl bg-vault-primary border border-vault-subtle">
                <span className="text-xs text-vault-muted font-medium">Total Emails Captured:</span>
                <span className="font-heading font-extrabold text-sm text-indigo-500">
                  {data.totalLeads || 0}
                </span>
              </div>

              {(!data.leads || data.leads.length === 0) ? (
                <div className="py-8 text-center text-xs text-vault-muted">
                  No email submissions captured for this asset yet.
                </div>
              ) : (
                <div className="divide-y divide-vault-subtle border border-vault-subtle rounded-xl overflow-hidden">
                  {data.leads.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-vault-card hover:bg-vault-primary transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-mono text-vault-main font-medium">{item.email}</span>
                      </div>
                      <span className="text-[11px] text-vault-muted font-mono">
                        {item.capturedAt
                          ? new Date(item.capturedAt).toLocaleDateString()
                          : "Captured"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-vault-subtle bg-vault-card flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-deep hover:opacity-90 cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadsViewerModal;

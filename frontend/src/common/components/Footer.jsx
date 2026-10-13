import React from "react";
import { Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";

const Footer = () => {
  return (
    <footer className="border-t border-vault-subtle bg-vault-primary py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-vault-main">
            Vault<span className="text-gradient">Link</span>
          </span>
          <span className="text-xs text-vault-muted ml-2">
            © {new Date().getFullYear()} VaultLink Inc. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-vault-muted">
          <a href="#features" className="hover:text-vault-main transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-vault-main transition-colors">How It Works</a>
          <Link to="/auth" className="hover:text-vault-main transition-colors">Sign In</Link>
          <Link to="/dashboard" className="hover:text-vault-main transition-colors">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

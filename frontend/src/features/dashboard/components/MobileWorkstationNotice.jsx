import React from "react";
import { Laptop, Shield, LogOut, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slice/authSlice.js";
import { logOutUser } from "../../../apis/userApi.js";

const MobileWorkstationNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOutUser();
    } catch (err) {
      console.error(err);
    }
    dispatch(logout());
    navigate({ to: "/" });
  };

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-vault-primary text-center">
      <div className="w-full max-w-sm p-8 rounded-3xl bg-vault-card border border-vault-subtle shadow-2xl flex flex-col items-center text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-gradient text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Laptop className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Workstation Only</span>
          </div>

          <h2 className="font-heading font-extrabold text-xl text-vault-main tracking-tight">
            Please use a Computer or Laptop
          </h2>

          <p className="text-xs text-vault-muted leading-relaxed">
            The VaultLink Security Console is built exclusively for desktop workstations to ensure zero-trust file governance, real-time watermark rendering, and enterprise security policies.
          </p>
        </div>

        <div className="w-full pt-2 flex flex-col gap-2.5">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-vault-main border border-vault-subtle hover:bg-vault-primary transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileWorkstationNotice;

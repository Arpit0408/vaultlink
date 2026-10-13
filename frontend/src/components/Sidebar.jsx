import React from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice/authSlice.js";
import { logOutUser } from "../apis/userApi.js";
import {
  LayoutDashboard,
  FolderLock,
  Layers,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const { location } = useRouterState();
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

  const navItems = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: "/dashboard/files",
      label: "File Assets",
      icon: FolderLock,
    },
    {
      to: "/dashboard/allurls",
      label: "Short Links",
      icon: Layers,
    },
    {
      to: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const isCurrentActive = (item) => {
    if (item.exact) {
      return location.pathname === item.to || location.pathname === `${item.to}/`;
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <aside className="w-64 h-full bg-vault-card border-r border-vault-subtle flex flex-col justify-between p-4 transition-colors select-none">
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-vault-muted px-3">
            Console Menu
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isCurrentActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-indigo-500/10 text-indigo-500 font-bold"
                      : "text-vault-muted hover:text-vault-main hover:bg-vault-primary"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-vault-subtle">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-vault-muted hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

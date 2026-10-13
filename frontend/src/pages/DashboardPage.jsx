import React, { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import Sidebar from "../components/Sidebar.jsx";
import DashboardNavbar from "../features/dashboard/components/DashboardNavbar.jsx";
import CreateAssetModal from "../features/dashboard/components/CreateAssetModal.jsx";
import MobileWorkstationNotice from "../features/dashboard/components/MobileWorkstationNotice.jsx";

const DashboardPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-vault-primary flex flex-col transition-colors">
      <MobileWorkstationNotice />

      <div className="hidden lg:flex flex-col h-full w-full">
        <DashboardNavbar onOpenCreate={() => setIsCreateOpen(true)} />

        <div className="flex flex-1 overflow-hidden w-full">
          <div className="w-64 shrink-0 h-[calc(100vh-4rem)]">
            <Sidebar />
          </div>

          <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-6 xl:p-8 bg-vault-primary">
            <div className="max-w-[1600px] mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <CreateAssetModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </div>
  );
};

export default DashboardPage;

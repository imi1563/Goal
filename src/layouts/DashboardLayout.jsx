import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("sidebar_collapsed")
        : null;
    if (saved != null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebar_collapsed", String(next));
      }
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#1E1B3A]">
      {/* Sidebar - fixed on desktop */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 z-40">
        <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
      </div>

      {/* Sidebar overlay/mobile drawer */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column (header + content) */}
      <div
        className={`flex flex-col min-h-screen transition-all ${isCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 px-2 lg:px-6 bg-[#1E1B3A]/80 backdrop-blur">
          <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />
        </div>

        {/* Content area */}
        <main className="flex-1 pb-8">
          <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

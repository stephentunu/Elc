import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, UserPlus, DollarSign, TrendingUp,
  Megaphone, Calendar, FileText, Image, Settings, LogOut, Menu
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Members", path: "/admin/members" },
  { icon: UserPlus, label: "Add Member", path: "/admin/members/add" },
  { icon: DollarSign, label: "Contributions", path: "/admin/contributions" },
  { icon: TrendingUp, label: "Finance Report", path: "/admin/finance" },
  { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
  { icon: Calendar, label: "Events", path: "/admin/events" },
  { icon: FileText, label: "Meeting Minutes", path: "/admin/minutes" },
  { icon: Image, label: "Gallery", path: "/admin/gallery" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">ELC</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-bold text-sm">MMU ELC</p>
              <p className="text-white/60 text-xs">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { setLocation(item.path); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                isActive
                  ? "bg-white/20 text-white border-l-4 border-yellow-400"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-yellow-400" : ""}`} />
              {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-3 border-t border-white/10">
        {sidebarOpen && admin && (
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-sm font-medium truncate">{admin.name}</p>
            <p className="text-white/60 text-xs truncate">{admin.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}
        style={{ background: "linear-gradient(180deg, #001F5B 0%, #8B0000 100%)" }}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div
            className="absolute left-0 top-0 h-full w-64 flex flex-col"
            style={{ background: "linear-gradient(180deg, #001F5B 0%, #8B0000 100%)" }}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSidebarOpen(!sidebarOpen); setMobileOpen(!mobileOpen); }}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="font-semibold text-gray-900 text-sm md:text-base">
                {menuItems.find(m => m.path === location)?.label || "Admin Panel"}
              </p>
              <p className="text-xs text-gray-500 hidden md:block">
                {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
              <p className="text-xs text-gray-500">{admin?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {admin?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
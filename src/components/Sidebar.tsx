import React from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  FolderGit2,
  Bot,
  Layers,
  User,
  LogOut,
  LogIn,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAuth: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { savedProjects } = useProject();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "generator", label: "Idea Generator", icon: Sparkles, badge: "AI" },
    { id: "my-projects", label: "My Projects", icon: FolderGit2, count: savedProjects.length },
    { id: "mentor", label: "AI Mentor", icon: Bot },
    { id: "roadmap", label: "Roadmap", icon: Layers },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleItemClick = (pageId: string) => {
    onNavigate(pageId);
    onCloseMobile();
  };

  const sidebarContent = (
    <aside className="w-64 bg-slate-900 flex flex-col text-white h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div
          onClick={() => handleItemClick("landing")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-sm shadow-indigo-500/30 group-hover:bg-indigo-400 transition-colors">
            P
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            ProjectMentor<span className="text-indigo-400">AI</span>
          </h1>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>

              {typeof item.count === "number" && item.count > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white text-indigo-600"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  {item.count}
                </span>
              )}

              {item.badge && !isActive && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User Profile Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between gap-3">
            <div
              onClick={() => handleItemClick("profile")}
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white shrink-0 font-semibold text-xs">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "ST"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">
                  {user.branch?.includes("Computer")
                    ? "CS Branch"
                    : user.branch?.includes("AI")
                    ? "AI/DS"
                    : user.branch || "CS Branch"}{" "}
                  • Year 4
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            id="sidebar-signin-btn"
            onClick={() => {
              onOpenAuth();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Student Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:flex shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Backdrop and Off-Canvas */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

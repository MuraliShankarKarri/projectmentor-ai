import React from "react";
import { Menu, Moon, Sun, Bell, Sparkles, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AppHeaderProps {
  currentPage: string;
  onOpenMobileMenu: () => void;
  onOpenAuth: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentPage,
  onOpenMobileMenu,
  onOpenAuth,
  darkMode,
  onToggleDarkMode,
}) => {
  const { user, isAuthenticated } = useAuth();

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Student Engineering Workspace";
      case "generator":
        return "Project Generator Dashboard";
      case "my-projects":
        return "Saved Capstone Portfolio";
      case "mentor":
        return "AI Senior Mentor & Viva Defense";
      case "roadmap":
        return "9-Phase Milestone Roadmap";
      case "profile":
        return "Student Academic Profile";
      case "project-details":
        return "Capstone Architecture Blueprint";
      case "landing":
      default:
        return "ProjectMentor AI Platform";
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shrink-0 transition-colors duration-200">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white truncate">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right: Live AI Status + Theme Toggle + Auth Button */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Gemini Pro Online badge from Design HTML */}
        <span className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden sm:inline">Gemini Pro Online</span>
          <span className="sm:hidden text-[11px] font-semibold">Gemini Online</span>
        </span>

        {/* Theme Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notification / Auth Icon */}
        {!isAuthenticated && (
          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

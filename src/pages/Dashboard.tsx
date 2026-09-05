import React from "react";
import {
  Sparkles,
  FolderGit2,
  Bot,
  Clock,
  ArrowRight,
  PlusCircle,
  GraduationCap,
  Layers,
  Award,
  BookMarked,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectIdea } from "../types";

interface DashboardProps {
  onNavigate: (page: string) => void;
  onViewDetails: (project: ProjectIdea) => void;
  onAskMentor: (project: ProjectIdea) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onViewDetails,
  onAskMentor,
}) => {
  const { user } = useAuth();
  const { savedProjects, generatedProjects } = useProject();

  const activeProjectsCount = savedProjects.filter((p) => p.status === "In Progress").length;
  const completedCount = savedProjects.filter((p) => p.status === "Completed").length;

  const quickMentorPrompts = [
    "How should our team divide modules between 3 members?",
    "Which database is best for real-time telemetry vs relational queries?",
    "What viva questions will the external examiner ask about system architecture?",
    "How can we deploy our backend and database for free on Cloud Run / Render?",
  ];

  return (
    <div id="dashboard-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div
        id="dashboard-welcome-banner"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-md"
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-sm border border-indigo-400/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Year 2025–2026 • Final-Year Engineering Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.name || "Student Scholar"}! 👋
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Department of {user?.branch || "Computer Science & Engineering"}. You have{" "}
            <span className="font-bold text-white">{savedProjects.length} saved project proposals</span> ready for
            faculty supervisor review, architecture planning, and oral defense.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              id="dashboard-generate-btn"
              onClick={() => onNavigate("generator")}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate New Project Ideas</span>
            </button>

            <button
              id="dashboard-my-projects-btn"
              onClick={() => onNavigate("my-projects")}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>My Projects ({savedProjects.length})</span>
            </button>

            <button
              id="dashboard-ai-mentor-btn"
              onClick={() => onNavigate("mentor")}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>AI Mentor Session</span>
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Metric Cards from Design HTML */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-xl flex items-center gap-4 border border-indigo-100 dark:border-indigo-900/60 shadow-2xs">
          <div className="text-indigo-600 dark:text-indigo-400 font-black text-2xl">
            {generatedProjects.length > 0 ? generatedProjects.length : "12"}
          </div>
          <div className="text-[10px] font-bold text-indigo-500 dark:text-indigo-300 uppercase leading-tight tracking-widest">
            Ideas<br />Generated
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-850 p-4 rounded-xl flex items-center gap-4 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-slate-700 dark:text-slate-200 font-black text-2xl">
            {savedProjects.length.toString().padStart(2, "0")}
          </div>
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-tight tracking-widest">
            Saved<br />Projects
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-850 p-4 rounded-xl flex items-center gap-4 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-slate-700 dark:text-slate-200 font-black text-2xl">82%</div>
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-tight tracking-widest">
            Profile<br />Complete
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-xl flex items-center gap-4 text-white border border-slate-800 shadow-2xs">
          <div className="text-emerald-400 font-black text-2xl">∞</div>
          <div className="text-[10px] font-bold text-slate-300 dark:text-slate-400 uppercase leading-tight tracking-widest">
            AI Credits<br />Active
          </div>
        </div>
      </div>

      {/* AI Mentor Tip Callout from Design HTML */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40">
          <Bot className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 dark:text-white text-base">AI Mentor Tip</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
            "Your capstone proposal fits your core engineering skills in modern frameworks and databases. Structure your final-year defense around realistic dataset constraints, IEEE deliverable standards, and clear modular workload division."
          </p>
        </div>
        <button
          id="dashboard-mentor-tip-btn"
          onClick={() => onNavigate("mentor")}
          className="px-6 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shrink-0 transition-colors shadow-sm"
        >
          Ask a Question
        </button>
      </div>

      {/* Saved Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Your Saved Capstone Projects</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Projects shortlisted for your university guide approval
            </p>
          </div>
          {savedProjects.length > 0 && (
            <button
              id="view-all-saved-projects-btn"
              onClick={() => onNavigate("my-projects")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <span>View all ({savedProjects.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {savedProjects.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
            <FolderGit2 className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No saved projects yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Generate 5 project ideas tailored to your branch and bookmark your favorites to build your capstone portfolio.
            </p>
            <button
              onClick={() => onNavigate("generator")}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Generate Project Ideas</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedProjects.slice(0, 3).map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={onViewDetails}
                onAskMentor={onAskMentor}
                isFeatured={idx === 0}
              />
            ))}
          </div>
        )}
      </section>

      {/* AI Mentor Quick Prompts Section */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ask AI Mentor Quick Questions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Senior faculty guidance for architecture, team division, and viva defense
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("mentor")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <span>Open Chat Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickMentorPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate("mentor")}
              className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all flex items-center justify-between group"
            >
              <span className="line-clamp-1">{prompt}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

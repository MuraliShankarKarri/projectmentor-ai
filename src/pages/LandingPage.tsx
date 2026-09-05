import React from "react";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Users,
  Compass,
  FileCode,
  Lightbulb,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenAuth }) => {
  const { isAuthenticated, user } = useAuth();

  const branches = [
    { name: "Computer Science (CSE)", icon: FileCode, count: "120+ Ideas" },
    { name: "AI & Data Science", icon: Cpu, count: "95+ Ideas" },
    { name: "Information Technology", icon: Layers, count: "80+ Ideas" },
    { name: "Electronics & Comm (ECE)", icon: Compass, count: "70+ Ideas" },
    { name: "Electrical & IoT", icon: Sparkles, count: "65+ Ideas" },
    { name: "Mechanical & Robotics", icon: Lightbulb, count: "50+ Ideas" },
  ];

  const features = [
    {
      title: "Context-Aware Project Generator",
      description:
        "Input your branch, specific skills, team size, and target duration. Gemini 3.8 Flash crafts 5 tailored, practical, and defendable project ideas in structured JSON.",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "9-Phase Development Roadmaps",
      description:
        "Step-by-step guidance broken down into Requirement Analysis, Architecture, UI, Backend, DB, AI Integration, QA, Deployment, and University Documentation.",
      icon: Layers,
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "24/7 AI Faculty & Viva Mentor",
      description:
        "Get direct answers on database selection, module division across 3-4 teammates, free-tier deployment, and anticipated viva examination questions.",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Viva Voce & Defense Preparation",
      description:
        "Anticipate external examiner cross-examinations, literature review requirements, and architecture justifications to guarantee top academic grades.",
      icon: Award,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Define Your Constraints",
      desc: "Specify your engineering discipline, existing programming languages, team size, and available semester timeline.",
    },
    {
      step: "02",
      title: "Generate 5 Custom Ideas",
      desc: "Our server-side AI synthesizes 5 realistic, innovative project proposals with problem statements, feature sets, and tech stacks.",
    },
    {
      step: "03",
      title: "Explore Architecture & Roadmap",
      desc: "Review the system architecture diagrams, task checklists, and estimated development weeks across all 9 project phases.",
    },
    {
      step: "04",
      title: "Consult AI Mentor & Defend",
      desc: "Chat with the context-aware mentor to resolve technical roadblocks, divide team roles, and prepare for your final viva presentation.",
    },
  ];

  return (
    <div id="landing-page" className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/70 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Announcement */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xs mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Built for Final-Year Undergraduate Engineering Students
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
              Turn Your Skills into an{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600">
                Outstanding Final-Year
              </span>{" "}
              Project
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              Stop stressing over generic, outdated ideas. Generate practical, realistic, and defendable capstone projects with full technical roadmaps, architecture suggestions, and an AI mentor tailored to your branch.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                id="hero-generate-cta-btn"
                onClick={() => onNavigate("generator")}
                className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Project Ideas</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isAuthenticated ? (
                <button
                  id="hero-dashboard-cta-btn"
                  onClick={() => onNavigate("dashboard")}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  id="hero-login-cta-btn"
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  Sign In / Register
                </button>
              )}
            </div>

            {/* Micro proof points */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Academic Feasibility</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Server Key Exposure</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Structured JSON Output</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Branches Grid */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
              Disciplines Supported
            </h2>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              Tailored specifically to your university syllabus
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {branches.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigate("generator")}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm cursor-pointer transition-all text-center group"
                >
                  <div className="w-9 h-9 mx-auto rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{b.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{b.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Engineered For Academic Success
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Everything you need from project synopsis to final oral viva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all space-y-3"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Four-Step Workflow
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How ProjectMentor AI guides your final year
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <span className="text-2xl font-black text-indigo-600/30 dark:text-indigo-400/30">{s.step}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{s.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              id="cta-start-generating-btn"
              onClick={() => onNavigate("generator")}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
            >
              <span>Launch Idea Generator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Cpu,
  Clock,
  Users,
  Code2,
  Wand2,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Bot,
  ArrowRight,
} from "lucide-react";
import { GeneratorFormData, ProjectIdea } from "../types";
import { generateProjectsAPI } from "../services/api";
import { useProject } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import { ProjectCard } from "../components/ProjectCard";

interface GeneratorPageProps {
  onViewDetails: (project: ProjectIdea) => void;
  onAskMentor: (project: ProjectIdea) => void;
}

const PRESET_TEMPLATES = [
  {
    label: "Healthcare & OCR (CSE)",
    branch: "Computer Science & Engineering",
    skills: "React, Node.js, Python, OCR / Computer Vision",
    interests: "Healthcare, Medical Accessibility, Telemedicine",
    difficulty: "Intermediate",
    teamSize: "3 Members",
    duration: "3 Months",
    tech: "React, Express, Tesseract.js, MongoDB, Tailwind CSS",
    domain: "Full-Stack Web App",
  },
  {
    label: "Smart Agriculture AI (AI/DS)",
    branch: "AI & Data Science",
    skills: "Python, PyTorch, OpenCV, Flask, React",
    interests: "AgriTech, Crop Disease Diagnosis, Rural Tech",
    difficulty: "Intermediate",
    teamSize: "3-4 Members",
    duration: "6 Months",
    tech: "Python, FastAPI, TensorFlow/Keras, React, PostgreSQL",
    domain: "Machine Learning / Computer Vision",
  },
  {
    label: "Smart Campus IoT Energy (ECE/EEE)",
    branch: "Electronics & Communication",
    skills: "C++, ESP32 / Arduino, MQTT, Node.js, React",
    interests: "Smart Campus, Renewable Energy, Green Tech",
    difficulty: "Advanced",
    teamSize: "4 Members",
    duration: "6 Months",
    tech: "ESP32, MQTT Broker, React, Node.js, TimescaleDB",
    domain: "IoT / Embedded Systems",
  },
  {
    label: "FinTech Micro-Savings (IT/Web)",
    branch: "Information Technology",
    skills: "TypeScript, React, Node.js, PostgreSQL",
    interests: "FinTech, Student Budgeting, Fraud Detection",
    difficulty: "Beginner",
    teamSize: "2 Members",
    duration: "3 Months",
    tech: "React, Express, Prisma, PostgreSQL, Chart.js",
    domain: "Full-Stack Web App",
  },
];

export const GeneratorPage: React.FC<GeneratorPageProps> = ({
  onViewDetails,
  onAskMentor,
}) => {
  const { user } = useAuth();
  const { generatedProjects, setGeneratedProjects } = useProject();

  const [formData, setFormData] = useState<GeneratorFormData>({
    branch: user?.branch || "Computer Science & Engineering",
    skills: user?.skills?.join(", ") || "React, Node.js, Python, SQL",
    interests: user?.interests?.join(", ") || "Healthcare, Web Applications, AI",
    difficulty: "Intermediate",
    teamSize: "3 Members",
    duration: "3 Months",
    tech: user?.preferredTech?.join(", ") || "React, Express, PostgreSQL, Tailwind CSS",
    domain: "Full-Stack Web App",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const branches = [
    "Computer Science & Engineering",
    "Information Technology",
    "AI & Data Science",
    "Electronics & Communication (ECE)",
    "Electrical & Electronics (EEE)",
    "Mechanical Engineering",
    "Civil Engineering",
    "Biomedical Engineering",
    "Chemical Engineering",
  ];

  const domains = [
    "Full-Stack Web App",
    "Mobile App (Cross-Platform)",
    "Machine Learning / Computer Vision",
    "Natural Language Processing (NLP)",
    "IoT / Embedded Systems",
    "Cloud & DevOps Architecture",
    "Cybersecurity & Digital Forensics",
    "Blockchain / Decentralized App",
  ];

  const durations = [
    "1 Month (Mini Project / Sprint)",
    "3 Months (Semester Capstone)",
    "6 Months (Major Final-Year Project)",
    "1 Full Academic Year",
  ];

  const teamSizes = [
    "1 Member (Solo Thesis)",
    "2 Members (Pair Project)",
    "3 Members (Standard Team)",
    "4 Members (Collaborative Squad)",
    "5+ Members (Large Capstone)",
  ];

  const handleApplyPreset = (preset: (typeof PRESET_TEMPLATES)[0]) => {
    setFormData({
      branch: preset.branch,
      skills: preset.skills,
      interests: preset.interests,
      difficulty: preset.difficulty,
      teamSize: preset.teamSize,
      duration: preset.duration,
      tech: preset.tech,
      domain: preset.domain,
    });
  };

  const loadingStepsText = [
    "Consulting Gemini academic knowledge base...",
    "Validating engineering difficulty & semester scope...",
    "Structuring architecture, system modules & viva defenses...",
    "Finalizing 5 distinct capstone blueprints...",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1800);

    try {
      const projects = await generateProjectsAPI(formData);
      setGeneratedProjects(projects);
    } catch (err: any) {
      console.error("Failed to generate project ideas:", err);
      setError(
        err.message ||
          "An error occurred while generating project ideas. Please ensure your parameters are clear and retry."
      );
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  return (
    <div id="project-generator-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Preset Quick Picks */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2.5">
            <Sparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>AI Capstone Project Generator</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Input your engineering profile to generate defendable, practical final-year project blueprints.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Presets:
          </span>
          {PRESET_TEMPLATES.map((p, idx) => (
            <button
              key={idx}
              type="button"
              id={`preset-btn-${idx}`}
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form on the Left/Top, Suggestions or Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container: Define Scope */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Define Project Scope
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              8 Tailored Parameters
            </span>
          </div>

          <form id="project-generator-form" onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Academic Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                1. Academic Branch / Department *
              </label>
              <select
                id="generator-branch-select"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Target Domain */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                2. Target Project Domain *
              </label>
              <select
                id="generator-domain-select"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              >
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Difficulty Level Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                3. Difficulty Level Preference *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    id={`diff-level-btn-${level.toLowerCase()}`}
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      formData.difficulty === level
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                4. Known Skills & Libraries *
              </label>
              <input
                id="generator-skills-input"
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g. React, Node.js, Python, OpenCV, PostgreSQL"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {/* 5. Team Size & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  5. Team Size *
                </label>
                <select
                  id="generator-teamsize-select"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {teamSizes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  6. Semester Duration *
                </label>
                <select
                  id="generator-duration-select"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {durations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 7. Problem Domains / Interests */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                7. Problem Domains & Interests *
              </label>
              <input
                id="generator-interests-input"
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="e.g. Healthcare, Agriculture, EdTech, FinTech"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {/* 8. Preferred Technologies */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                8. Preferred Tech Stack
              </label>
              <input
                id="generator-tech-input"
                type="text"
                value={formData.tech}
                onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                placeholder="e.g. React, TypeScript, FastAPI, PostgreSQL"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {error && (
              <div className="p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="submit-generate-projects-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm mt-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Projects with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Project Ideas</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results / Right Side: Top AI Suggestions from Design HTML */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header of Suggestions */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {generatedProjects.length > 0 ? "Top AI Suggestions" : "Recommended Projects Blueprint"}
            </h3>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {generatedProjects.length > 0
                ? `Showing ${generatedProjects.length} best matches`
                : "Submit parameters to generate fresh ideas"}
            </div>
          </div>

          {/* Loading Progress State */}
          {isLoading && (
            <div className="p-8 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Synthesizing Capstone Projects
                </h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium animate-pulse">
                  {loadingStepsText[loadingStep]}
                </p>
              </div>
              <div className="w-full max-w-xs mx-auto bg-indigo-200 dark:bg-indigo-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-500"
                  style={{ width: `${((loadingStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Project List */}
          {!isLoading && generatedProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedProjects.map((project, idx) => (
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

          {/* Empty state when no projects generated yet */}
          {!isLoading && generatedProjects.length === 0 && (
            <div className="p-10 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Wand2 className="w-6 h-6" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Ready to discover your final-year project?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click a Quick Preset or customize the form fields on the left, then hit "Generate Project Ideas" to synthesize 5 complete project architectures.
                </p>
              </div>
            </div>
          )}

          {/* AI Mentor Tip Callout from Design HTML */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40 text-emerald-500">
              <Bot className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">AI Mentor Tip</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
                "Projects that combine clear algorithmic depth with tangible real-world application (e.g., healthcare OCR, IoT energy telemetry) receive the highest grades in external viva reviews."
              </p>
            </div>
            <button
              onClick={() => onAskMentor(generatedProjects[0] || ({} as any))}
              className="px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-colors shadow-sm"
            >
              Ask a Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

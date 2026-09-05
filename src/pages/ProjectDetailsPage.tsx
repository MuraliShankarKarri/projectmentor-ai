import React, { useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Bot,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  Target,
  FileText,
  Cpu,
  Share2,
  Copy,
  Lightbulb,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { ProjectIdea, ImprovementData } from "../types";
import { useProject } from "../context/ProjectContext";
import { improveProjectAPI } from "../services/api";

interface ProjectDetailsPageProps {
  project: ProjectIdea | null;
  onBack: () => void;
  onNavigateToRoadmap: (project: ProjectIdea) => void;
  onNavigateToMentor: (project: ProjectIdea) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({
  project,
  onBack,
  onNavigateToRoadmap,
  onNavigateToMentor,
}) => {
  const { saveProject, removeProject, isProjectSaved } = useProject();
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "tech" | "improvements">("overview");
  const [improvements, setImprovements] = useState<ImprovementData | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-slate-500">No project selected.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  const saved = isProjectSaved(project.id);

  const handleToggleSave = () => {
    if (saved) {
      removeProject(project.id);
    } else {
      saveProject(project);
    }
  };

  const handleImproveProject = async () => {
    setIsImproving(true);
    setActiveTab("improvements");
    try {
      const data = await improveProjectAPI(project);
      setImprovements(data);
    } catch (err) {
      console.error("Failed to fetch project improvements:", err);
    } finally {
      setIsImproving(false);
    }
  };

  const handleCopyMarkdown = () => {
    const md = `# ${project.title}
**Difficulty:** ${project.difficultyLevel} | **Duration:** ${project.estimatedDuration} | **Team:** ${project.teamSize || "3 Members"}
**Branch:** ${project.branch || "Engineering"} | **Domain:** ${project.domain || "Full-Stack"}

## Executive Summary
${project.shortDescription}

## Problem Statement
${project.problemStatement}

## Proposed Technical Solution & Objectives
${project.proposedSolution}

## Target Users & Stakeholders
${project.targetUsers}

## Key Functional Features
${project.mainFeatures?.map((f) => `- ${f}`).join("\n")}

## Advanced Innovation Features
${project.advancedFeatures?.map((f) => `- ${f}`).join("\n")}

## Recommended Technology Stack
${project.techStack?.map((t) => `- ${t}`).join("\n")}

## Expected Academic Outcome
${project.expectedOutcome}

## Scope for Future Enhancements
${project.futureImprovements}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="project-details-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          id="details-back-btn"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            id="copy-project-brief-btn"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Copied!" : "Export Brief"}</span>
          </button>

          <button
            id="details-save-project-btn"
            onClick={handleToggleSave}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              saved
                ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400"
            }`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{saved ? "Saved in Portfolio" : "Save Project"}</span>
          </button>
        </div>
      </div>

      {/* Main Project Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {project.difficultyLevel || "Intermediate"}
          </span>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {project.branch || "Computer Science"}
          </span>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {project.domain || "Full-Stack Web App"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          {project.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Key Constraints Ribbon */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{project.estimatedDuration || "3 Months"}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Semester Timeline</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{project.teamSize || "3 Members"}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Team Allocation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
            <Target className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {project.targetUsers || "General Public & Researchers"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Target Beneficiaries</p>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center gap-3">
          <button
            id="details-generate-roadmap-btn"
            onClick={() => onNavigateToRoadmap(project)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Generate Full 9-Phase Roadmap</span>
          </button>

          <button
            id="details-ask-mentor-btn"
            onClick={() => onNavigateToMentor(project)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Project Mentor</span>
          </button>

          <button
            id="details-improve-project-btn"
            onClick={handleImproveProject}
            disabled={isImproving}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>{isImproving ? "Analyzing Improvements..." : "Improve Project & Viva Prep"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          id="tab-btn-overview"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Overview & Objectives
        </button>
        <button
          id="tab-btn-features"
          onClick={() => setActiveTab("features")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "features"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Features & Deliverables
        </button>
        <button
          id="tab-btn-tech"
          onClick={() => setActiveTab("tech")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "tech"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Architecture & Tech Stack
        </button>
        <button
          id="tab-btn-improvements"
          onClick={() => setActiveTab("improvements")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "improvements"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Viva Defense & Upgrades
        </button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Problem Statement</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.problemStatement}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Proposed Technical Solution & Objectives</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.proposedSolution}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Expected Academic Outcome
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {project.expectedOutcome || "A functional prototype demonstrating key deliverables to university evaluators."}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Future Improvements & Scope
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {project.futureImprovements || "Integration with cloud microservices, IoT sensors, and mobile apps."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Features */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Core Functional Modules</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.mainFeatures?.map((f, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Advanced Innovation Modules (Grade A+ Enhancements)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.advancedFeatures?.map((f, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-purple-200/60 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Architecture & Tech */}
      {activeTab === "tech" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Full Technology Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Architectural Suggestion & Data Flow</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto space-y-2">
              <p className="text-indigo-400 font-bold">// Recommended High-Level Architecture Flow:</p>
              <p>1. Client Layer: Single-Page Application (React / Tailwind CSS) with state caching</p>
              <p>2. API Gateway: Express Node.js REST controllers with JWT token validation & rate limiting</p>
              <p>3. Service Layer: Asynchronous background worker for intensive AI / data processing</p>
              <p>4. Data Layer: Relational Schema (PostgreSQL/TimescaleDB) with indexed query constraints</p>
              <p>5. AI Proxy: Secure server-side Gemini 3.8 Flash model invocation via @google/genai SDK</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Viva Defense & Upgrades */}
      {activeTab === "improvements" && (
        <div className="space-y-6">
          {improvements ? (
            <>
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Anticipated Viva Voce Examination Questions</span>
                </h3>
                <div className="space-y-3">
                  {improvements.vivaQuestions?.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-xs space-y-1"
                    >
                      <p className="font-bold text-slate-900 dark:text-white">Q{idx + 1}: {q}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Examiner rationale: Verifies that the student understands foundational design tradeoffs rather than just pasting tutorial code.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Production Scalability Recommendations</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {improvements.scalabilityTips?.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {improvements.commercialization && (
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <p className="font-bold">Incubation & Commercialization Potential:</p>
                  <p>{improvements.commercialization}</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-3">
              <Award className="w-10 h-10 mx-auto text-amber-500" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Prepare for University Evaluators & Viva Voce
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Click below to have our senior faculty advisor synthesize anticipated oral defense questions, grading rubric tips, and industry scalability advice.
              </p>
              <button
                onClick={handleImproveProject}
                disabled={isImproving}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isImproving ? "Analyzing..." : "Analyze Viva Defense & Scalability"}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

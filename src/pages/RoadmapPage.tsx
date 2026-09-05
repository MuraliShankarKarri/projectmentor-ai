import React, { useState, useEffect } from "react";
import {
  Layers,
  Clock,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  Calendar,
  Award,
  RefreshCw,
  FolderGit2,
} from "lucide-react";
import { ProjectIdea, RoadmapPhase } from "../types";
import { useProject } from "../context/ProjectContext";
import { generateRoadmapAPI } from "../services/api";

interface RoadmapPageProps {
  project: ProjectIdea | null;
  onBack: () => void;
  onNavigateToMentor: (project: ProjectIdea) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  project,
  onBack,
  onNavigateToMentor,
}) => {
  const { activeRoadmap, setActiveRoadmap, updateTaskCompletion } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project && (!activeRoadmap || activeRoadmap.length === 0)) {
      handleFetchRoadmap();
    }
  }, [project?.id]);

  const handleFetchRoadmap = async () => {
    if (!project) return;
    setIsLoading(true);
    try {
      const phases = await generateRoadmapAPI(project);
      setActiveRoadmap(phases);
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-slate-500">Please select a project first to view its roadmap.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  // Calculate completion percentage
  let totalTasks = 0;
  let completedTasksCount = 0;

  activeRoadmap?.forEach((phase, pIdx) => {
    phase.tasks?.forEach((_, tIdx) => {
      totalTasks += 1;
      if (phase.completedTasks && phase.completedTasks[tIdx]) {
        completedTasksCount += 1;
      }
    });
  });

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const handleCopyRoadmap = () => {
    if (!activeRoadmap) return;
    const text = `# 9-Phase Development Roadmap: ${project.title}
Estimated Duration: ${project.estimatedDuration} | Team: ${project.teamSize || "3 Members"}

${activeRoadmap
  .map(
    (p, idx) => `### ${p.phase} (${p.estimatedTime})
Deliverables: ${p.deliverables || "Milestone Report"}
Tasks:
${p.tasks.map((t, tIdx) => `  - [${p.completedTasks?.[tIdx] ? "x" : " "}] ${t}`).join("\n")}
`
  )
  .join("\n")}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="roadmap-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="roadmap-back-btn"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            id="regenerate-roadmap-btn"
            onClick={handleFetchRoadmap}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Regenerate</span>
          </button>

          <button
            id="copy-roadmap-btn"
            onClick={handleCopyRoadmap}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Export Markdown"}</span>
          </button>
        </div>
      </div>

      {/* Header & Milestone Progress Bar */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>9-Phase Capstone Execution Blueprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Follow this structured timeline designed for final-year engineering guides, phase reviews, and oral defense submissions.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Capstone Milestone Completion</span>
            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
              {progressPercentage}% ({completedTasksCount}/{totalTasks} Tasks Done)
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 text-center rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Synthesizing 9-Phase Development Roadmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mapping out timeframes, architectural milestones, and university submission deliverables...
          </p>
        </div>
      )}

      {/* 9 Phase Timeline */}
      {!isLoading && activeRoadmap && (
        <div className="space-y-4">
          {activeRoadmap.map((phase, pIdx) => {
            const phaseTasks = phase.tasks || [];
            const completedInPhase = phaseTasks.filter((_, tIdx) => phase.completedTasks?.[tIdx]).length;
            const isPhaseFullyDone = phaseTasks.length > 0 && completedInPhase === phaseTasks.length;

            return (
              <div
                key={pIdx}
                id={`roadmap-phase-${pIdx}`}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                  isPhaseFullyDone
                    ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }`}
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isPhaseFullyDone
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                      }`}
                    >
                      {isPhaseFullyDone ? <CheckCircle2 className="w-4 h-4" /> : pIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {phase.phase}
                      </h3>
                      {phase.deliverables && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Deliverable: <span className="font-semibold text-slate-700 dark:text-slate-300">{phase.deliverables}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{phase.estimatedTime}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {completedInPhase}/{phaseTasks.length} tasks
                    </span>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {phaseTasks.map((task, tIdx) => {
                    const isDone = !!phase.completedTasks?.[tIdx];
                    return (
                      <div
                        key={tIdx}
                        onClick={() => updateTaskCompletion(pIdx, tIdx, !isDone)}
                        className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all flex items-start space-x-2.5 ${
                          isDone
                            ? "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
                            : "bg-slate-50/50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 focus:outline-none"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 hover:text-indigo-600" />
                          )}
                        </button>
                        <span className={`text-xs leading-relaxed ${isDone ? "line-through opacity-80" : ""}`}>
                          {task}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="text-xs font-bold text-slate-900 dark:text-white">Need architecture clarification on a phase?</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Consult the AI mentor for detailed code boilerplate, API schema, or division of labor.
          </p>
        </div>

        <button
          id="roadmap-consult-mentor-btn"
          onClick={() => onNavigateToMentor(project)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          Consult AI Mentor for this Phase
        </button>
      </div>
    </div>
  );
};

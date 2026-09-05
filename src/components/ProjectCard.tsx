import React from "react";
import {
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Bot,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { ProjectIdea } from "../types";
import { useProject } from "../context/ProjectContext";

interface ProjectCardProps {
  project: ProjectIdea;
  onViewDetails: (project: ProjectIdea) => void;
  onAskMentor?: (project: ProjectIdea) => void;
  isFeatured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onAskMentor,
  isFeatured = false,
}) => {
  const { saveProject, removeProject, isProjectSaved } = useProject();
  const saved = isProjectSaved(project.id);

  const getDifficultyPill = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "beginner":
        return "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800";
      case "advanced":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
      case "intermediate":
      default:
        return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
    }
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      removeProject(project.id);
    } else {
      saveProject(project);
    }
  };

  return (
    <div
      id={`project-card-${project.id}`}
      className={`relative group flex flex-col justify-between bg-white dark:bg-slate-900 p-5 rounded-2xl transition-all duration-200 shadow-sm ${
        isFeatured
          ? "border-2 border-indigo-500 shadow-indigo-500/10"
          : "border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
      }`}
    >
      {/* Floating HIGH RELEVANCE / FEATURED Badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
          HIGH RELEVANCE
        </div>
      )}

      <div>
        {/* Top Header with title and save button */}
        <div className="flex justify-between items-start mb-2 pt-0.5">
          <h4
            onClick={() => onViewDetails(project)}
            className="font-bold text-slate-900 dark:text-white pr-6 text-base hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2 leading-snug transition-colors"
          >
            {project.title}
          </h4>

          <button
            id={`bookmark-btn-${project.id}`}
            onClick={handleToggleSave}
            title={saved ? "Remove from saved projects" : "Save project"}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              saved
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950"
                : "text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400"
            }`}
          >
            {saved ? (
              <BookmarkCheck className="w-5 h-5 fill-indigo-600/20" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {project.shortDescription}
        </p>

        {/* Scope info (Duration & Team) */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.estimatedDuration || "3 Months"}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.teamSize || "3 Students"}</span>
          </span>
        </div>

        {/* Tech Stack Chips & Difficulty Tag */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {Array.isArray(project.techStack) &&
            project.techStack.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300 font-medium"
              >
                {tech}
              </span>
            ))}
          <span
            className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${getDifficultyPill(
              project.difficultyLevel
            )}`}
          >
            {project.difficultyLevel || "Intermediate"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          id={`view-details-btn-${project.id}`}
          onClick={() => onViewDetails(project)}
          className="flex-1 py-2 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-bold border border-indigo-100 dark:border-indigo-900/60 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all text-center"
        >
          View Full Blueprint
        </button>

        {onAskMentor && (
          <button
            id={`ask-mentor-card-btn-${project.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAskMentor(project);
            }}
            title="Ask AI Mentor about this project"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <Bot className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

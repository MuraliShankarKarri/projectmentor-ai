import React, { useState } from "react";
import {
  FolderGit2,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  ArrowRight,
  Bot,
  Layers,
  Clock,
  CheckCircle2,
  BookmarkX,
  Sparkles,
} from "lucide-react";
import { ProjectIdea } from "../types";
import { useProject } from "../context/ProjectContext";

interface MyProjectsPageProps {
  onNavigateToGenerator: () => void;
  onViewDetails: (project: ProjectIdea) => void;
  onNavigateToRoadmap: (project: ProjectIdea) => void;
  onNavigateToMentor: (project: ProjectIdea) => void;
}

export const MyProjectsPage: React.FC<MyProjectsPageProps> = ({
  onNavigateToGenerator,
  onViewDetails,
  onNavigateToRoadmap,
  onNavigateToMentor,
}) => {
  const { savedProjects, removeProject, updateProjectStatus } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProjects = savedProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiff = difficultyFilter === "All" || p.difficultyLevel === difficultyFilter;
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    return matchesSearch && matchesDiff && matchesStatus;
  });

  return (
    <div id="my-projects-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Capstone Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Saved Projects ({savedProjects.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your shortlisted final-year capstone ideas, track milestones, and launch mentorship sessions.
          </p>
        </div>

        <button
          id="myprojects-generate-new-btn"
          onClick={onNavigateToGenerator}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Generate New Projects</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="projects-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or technology..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Difficulty:</span>
          <select
            id="projects-difficulty-filter"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Status:</span>
          <select
            id="projects-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Idea">Idea</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <BookmarkX className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No saved projects match your filters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search terms or generate new personalized ideas with our AI synthesizer.
            </p>
          </div>
          <button
            onClick={onNavigateToGenerator}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New Projects</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`saved-project-card-${project.id}`}
              className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-2xs hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Header with status pill & delete button */}
                <div className="flex items-center justify-between">
                  <select
                    value={project.status || "Idea"}
                    onChange={(e) =>
                      updateProjectStatus(
                        project.id,
                        e.target.value as "Idea" | "In Progress" | "Completed"
                      )
                    }
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="Idea">💡 Idea</option>
                    <option value="In Progress">⏳ In Progress</option>
                    <option value="Completed">✅ Completed</option>
                  </select>

                  <button
                    id={`delete-project-${project.id}`}
                    onClick={() => removeProject(project.id)}
                    title="Remove from saved projects"
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onViewDetails(project)}
                  className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2"
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {project.shortDescription}
                </p>

                {/* Duration & Team Meta */}
                <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{project.estimatedDuration || "3 Months"}</span>
                  </span>
                  <span>•</span>
                  <span>{project.difficultyLevel}</span>
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.techStack?.slice(0, 4).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  id={`open-details-${project.id}`}
                  onClick={() => onViewDetails(project)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white text-center shadow-2xs transition-all"
                >
                  Details
                </button>

                <button
                  id={`open-roadmap-${project.id}`}
                  onClick={() => onNavigateToRoadmap(project)}
                  title="View 9-Phase Roadmap"
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                >
                  <Layers className="w-4 h-4" />
                </button>

                <button
                  id={`open-mentor-${project.id}`}
                  onClick={() => onNavigateToMentor(project)}
                  title="Chat with AI Mentor"
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

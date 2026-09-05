import { useState, useCallback } from "react";
import { ProjectIdea, GeneratorFormData } from "../types";
import { generateProjectsAPI, generateRoadmapAPI, improveProjectAPI } from "../services/api";
import { useProject } from "../context/ProjectContext";

export function useProjectMentor() {
  const {
    savedProjects,
    saveProject,
    removeProject,
    isProjectSaved,
    selectedProject,
    setSelectedProject,
    generatedProjects,
    setGeneratedProjects,
    activeRoadmap,
    setActiveRoadmap,
  } = useProject();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIdeas = useCallback(
    async (formData: GeneratorFormData) => {
      setIsGenerating(true);
      setError(null);
      try {
        const ideas = await generateProjectsAPI(formData);
        setGeneratedProjects(ideas);
        return ideas;
      } catch (err: any) {
        const msg = err.message || "Failed to generate project ideas";
        setError(msg);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [setGeneratedProjects]
  );

  const fetchRoadmap = useCallback(
    async (project: ProjectIdea) => {
      try {
        const phases = await generateRoadmapAPI(project);
        setActiveRoadmap(phases);
        return phases;
      } catch (err: any) {
        console.error("Failed to load roadmap:", err);
        throw err;
      }
    },
    [setActiveRoadmap]
  );

  const fetchImprovements = useCallback(async (project: ProjectIdea) => {
    try {
      return await improveProjectAPI(project);
    } catch (err: any) {
      console.error("Failed to load improvements:", err);
      throw err;
    }
  }, []);

  return {
    savedProjects,
    saveProject,
    removeProject,
    isProjectSaved,
    selectedProject,
    setSelectedProject,
    generatedProjects,
    isGenerating,
    error,
    generateIdeas,
    activeRoadmap,
    fetchRoadmap,
    fetchImprovements,
  };
}

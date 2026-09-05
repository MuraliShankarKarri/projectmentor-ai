import React, { createContext, useContext, useState, useEffect } from "react";
import { ProjectIdea, RoadmapPhase } from "../types";

interface ProjectContextType {
  savedProjects: ProjectIdea[];
  generatedProjects: ProjectIdea[];
  selectedProject: ProjectIdea | null;
  activeRoadmap: RoadmapPhase[] | null;
  saveProject: (project: ProjectIdea) => void;
  removeProject: (id: string) => void;
  isProjectSaved: (id: string) => boolean;
  setSelectedProject: (project: ProjectIdea | null) => void;
  setGeneratedProjects: (projects: ProjectIdea[]) => void;
  setActiveRoadmap: (phases: RoadmapPhase[] | null) => void;
  updateTaskCompletion: (phaseIdx: number, taskIdx: number, completed: boolean) => void;
  updateProjectStatus: (id: string, status: "Idea" | "In Progress" | "Completed") => void;
}

const INITIAL_SAVED_PROJECTS: ProjectIdea[] = [
  {
    id: "seed-proj-1",
    title: "MedSync: Privacy-Preserving Health Record Vault with OCR",
    shortDescription:
      "A digital health passport empowering patients to digitize handwritten medical prescriptions with local OCR and secure sharing.",
    problemStatement:
      "Patients struggle to organize disparate physical medical reports, handwritten doctor prescriptions, and past lab test history across clinics.",
    proposedSolution:
      "A secure web portal utilizing OCR text extraction to convert prescription images into structured reminders with time-limited QR access codes for doctors.",
    targetUsers: "Chronic patients, elderly individuals, primary care clinics, and pharmacies.",
    mainFeatures: [
      "Prescription image upload with automatic medicine dosage extraction",
      "Time-expiring QR code access for temporary physician inspection",
      "Medication schedule reminder dashboard",
      "Encrypted document storage with audit access logs",
    ],
    advancedFeatures: [
      "Drug-drug interaction warning alert system",
      "Multilingual voice readout for non-English literate patients",
      "Offline-capable PWA client for low-connectivity clinics",
    ],
    techStack: ["React", "Node.js", "Tesseract.js", "Express", "PostgreSQL", "Tailwind CSS"],
    difficultyLevel: "Intermediate",
    estimatedDuration: "3 Months",
    expectedOutcome:
      "A functional healthcare utility allowing patients to upload prescriptions and generate accurate medicine schedules.",
    futureImprovements:
      "Integration with FHIR/ABHA standard government healthcare exchange APIs.",
    branch: "Computer Science & Engineering",
    domain: "Healthcare & OCR",
    teamSize: "3 Members",
    status: "In Progress",
    savedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: "seed-proj-2",
    title: "Smart Campus Energy Grid & Waste Management Tracker",
    shortDescription:
      "An IoT telemetry platform monitoring real-time power consumption in university hostels and labs with solar efficiency tracking.",
    problemStatement:
      "Academic campuses waste up to 35% of daily electricity in vacant lecture halls and unmonitored air conditioning units.",
    proposedSolution:
      "A real-time telemetry dashboard ingesting IoT sensor data with automated anomaly alarms and departmental sustainability rankings.",
    targetUsers: "Campus facility managers, university administrators, and sustainability teams.",
    mainFeatures: [
      "Real-time watt-hour consumption feeds across blocks",
      "Automated alerts for energy surges and off-hour power usage",
      "Departmental green leaderboard and carbon offset metrics",
      "Exportable NAAC sustainability compliance reports",
    ],
    advancedFeatures: [
      "Predictive solar panel generation vs demand forecasting",
      "Automated relay cut-off signals for idle computer labs",
      "Interactive 3D campus building heatmaps",
    ],
    techStack: ["React", "Node.js", "MQTT / WebSockets", "TimescaleDB", "Chart.js", "Tailwind CSS"],
    difficultyLevel: "Advanced",
    estimatedDuration: "6 Months",
    expectedOutcome:
      "A live campus dashboard showing real-time wattage with 99% uptime and anomaly detection.",
    futureImprovements: "Integration with university smart meters and battery storage microgrids.",
    branch: "Computer Science & Engineering",
    domain: "IoT & Smart Campus",
    teamSize: "4 Members",
    status: "Idea",
    savedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
];

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedProjects, setSavedProjects] = useState<ProjectIdea[]>(() => {
    try {
      const saved = localStorage.getItem("pm_saved_projects");
      return saved ? JSON.parse(saved) : INITIAL_SAVED_PROJECTS;
    } catch {
      return INITIAL_SAVED_PROJECTS;
    }
  });

  const [generatedProjects, setGeneratedProjects] = useState<ProjectIdea[]>(() => {
    try {
      const stored = localStorage.getItem("pm_generated_projects");
      return stored ? JSON.parse(stored) : INITIAL_SAVED_PROJECTS;
    } catch {
      return INITIAL_SAVED_PROJECTS;
    }
  });

  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(() => {
    try {
      const stored = localStorage.getItem("pm_selected_project");
      return stored ? JSON.parse(stored) : INITIAL_SAVED_PROJECTS[0];
    } catch {
      return INITIAL_SAVED_PROJECTS[0];
    }
  });

  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapPhase[] | null>(() => {
    try {
      const stored = localStorage.getItem("pm_active_roadmap");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("pm_saved_projects", JSON.stringify(savedProjects));
  }, [savedProjects]);

  useEffect(() => {
    localStorage.setItem("pm_generated_projects", JSON.stringify(generatedProjects));
  }, [generatedProjects]);

  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem("pm_selected_project", JSON.stringify(selectedProject));
    }
  }, [selectedProject]);

  useEffect(() => {
    if (activeRoadmap) {
      localStorage.setItem("pm_active_roadmap", JSON.stringify(activeRoadmap));
    }
  }, [activeRoadmap]);

  const saveProject = (project: ProjectIdea) => {
    setSavedProjects((prev) => {
      const exists = prev.some((p) => p.id === project.id || p.title.toLowerCase() === project.title.toLowerCase());
      if (exists) {
        return prev.map((p) =>
          p.id === project.id || p.title.toLowerCase() === project.title.toLowerCase()
            ? { ...p, ...project }
            : p
        );
      }
      return [{ ...project, savedAt: new Date().toISOString(), status: project.status || "Idea" }, ...prev];
    });
  };

  const removeProject = (id: string) => {
    setSavedProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const isProjectSaved = (id: string): boolean => {
    return savedProjects.some((p) => p.id === id);
  };

  const updateTaskCompletion = (phaseIdx: number, taskIdx: number, completed: boolean) => {
    if (!activeRoadmap) return;
    const nextRoadmap = [...activeRoadmap];
    const targetPhase = { ...nextRoadmap[phaseIdx] };
    const completedTasks = { ...(targetPhase.completedTasks || {}) };
    completedTasks[taskIdx] = completed;
    targetPhase.completedTasks = completedTasks;
    nextRoadmap[phaseIdx] = targetPhase;
    setActiveRoadmap(nextRoadmap);
  };

  const updateProjectStatus = (id: string, status: "Idea" | "In Progress" | "Completed") => {
    setSavedProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject({ ...selectedProject, status });
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        savedProjects,
        generatedProjects,
        selectedProject,
        activeRoadmap,
        saveProject,
        removeProject,
        isProjectSaved,
        setSelectedProject,
        setGeneratedProjects,
        setActiveRoadmap,
        updateTaskCompletion,
        updateProjectStatus,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

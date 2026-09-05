import React, { createContext, useContext, useState, useEffect } from "react";
import { ProjectIdea, RoadmapPhase } from "../types";
import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
} from "../lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface ProjectContextType {
  savedProjects: ProjectIdea[];
  generatedProjects: ProjectIdea[];
  selectedProject: ProjectIdea | null;
  activeRoadmap: RoadmapPhase[] | null;
  saveProject: (project: ProjectIdea) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
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
      const saved = localStorage.getItem("pm_generated_projects");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapPhase[] | null>(null);

  // Synchronize with Firestore when user is authenticated
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) return;

      const path = `users/${fbUser.uid}/savedProjects`;
      const colRef = collection(db, "users", fbUser.uid, "savedProjects");

      const unsubSnapshot = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreProjects: ProjectIdea[] = [];
            snapshot.forEach((docSnap) => {
              const d = docSnap.data();
              firestoreProjects.push({
                id: docSnap.id,
                title: d.title || "Untitled Capstone",
                shortDescription: d.shortDescription || "",
                problemStatement: d.problemStatement || "",
                proposedSolution: d.proposedSolution || "",
                targetUsers: d.targetUsers || "University students, faculty advisors, and industry evaluators.",
                mainFeatures: Array.isArray(d.mainFeatures)
                  ? d.mainFeatures
                  : ["Automated processing engine", "Interactive user dashboard"],
                advancedFeatures: Array.isArray(d.advancedFeatures)
                  ? d.advancedFeatures
                  : ["Predictive intelligence model", "Real-time analytics integration"],
                techStack: Array.isArray(d.techStack) ? d.techStack : ["React", "Node.js"],
                difficultyLevel: d.difficultyLevel || "Intermediate",
                estimatedDuration: d.estimatedDuration || "3 Months",
                expectedOutcome: d.expectedOutcome || "A functional deployed capstone prototype.",
                futureImprovements:
                  d.futureImprovements || "Cloud multi-region clustering and mobile application.",
                branch: d.branch || "Computer Science",
                domain: d.domain || "Full-Stack Web App",
                savedAt: d.createdAt || new Date().toISOString(),
                status: "Idea",
              });
            });
            setSavedProjects(firestoreProjects);
            localStorage.setItem("pm_saved_projects", JSON.stringify(firestoreProjects));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, path);
        }
      );

      return () => unsubSnapshot();
    });

    return () => unsubAuth();
  }, []);

  // Save to local storage cache for offline resilience
  useEffect(() => {
    localStorage.setItem("pm_saved_projects", JSON.stringify(savedProjects));
  }, [savedProjects]);

  useEffect(() => {
    localStorage.setItem("pm_generated_projects", JSON.stringify(generatedProjects));
  }, [generatedProjects]);

  const saveProject = async (project: ProjectIdea) => {
    if (savedProjects.some((p) => p.id === project.id)) return;

    const newProject: ProjectIdea = {
      ...project,
      savedAt: new Date().toISOString(),
      status: project.status || "Idea",
    };

    setSavedProjects((prev) => [newProject, ...prev]);

    // Persist to Cloud Firestore if signed in
    if (auth.currentUser) {
      const path = `users/${auth.currentUser.uid}/savedProjects/${project.id}`;
      try {
        const docRef = doc(db, "users", auth.currentUser.uid, "savedProjects", project.id);
        await setDoc(docRef, {
          id: project.id,
          userId: auth.currentUser.uid,
          title: (project.title || "Untitled Project").slice(0, 200),
          shortDescription: (project.shortDescription || "").slice(0, 1000),
          problemStatement: (project.problemStatement || "").slice(0, 2000),
          proposedSolution: (project.proposedSolution || "").slice(0, 2000),
          difficultyLevel: (project.difficultyLevel || "Intermediate").slice(0, 50),
          estimatedDuration: (project.estimatedDuration || "3 Months").slice(0, 50),
          techStack: Array.isArray(project.techStack) ? project.techStack.slice(0, 20) : [],
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }
  };

  const removeProject = async (id: string) => {
    setSavedProjects((prev) => prev.filter((p) => p.id !== id));

    if (auth.currentUser) {
      const path = `users/${auth.currentUser.uid}/savedProjects/${id}`;
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "savedProjects", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  };

  const isProjectSaved = (id: string) => {
    return savedProjects.some((p) => p.id === id);
  };

  const updateTaskCompletion = (phaseIdx: number, taskIdx: number, completed: boolean) => {
    if (!activeRoadmap) return;
    const updated = [...activeRoadmap];
    if (updated[phaseIdx]) {
      const completedTasks = { ...(updated[phaseIdx].completedTasks || {}) };
      completedTasks[taskIdx] = completed;
      updated[phaseIdx] = {
        ...updated[phaseIdx],
        completedTasks,
      };
      setActiveRoadmap(updated);
    }
  };

  const updateProjectStatus = (id: string, status: "Idea" | "In Progress" | "Completed") => {
    setSavedProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
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

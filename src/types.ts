export interface ProjectIdea {
  id: string;
  title: string;
  shortDescription: string;
  problemStatement: string;
  proposedSolution: string;
  targetUsers: string;
  mainFeatures: string[];
  advancedFeatures: string[];
  techStack: string[];
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced" | string;
  estimatedDuration: string;
  expectedOutcome: string;
  futureImprovements: string;
  branch?: string;
  domain?: string;
  teamSize?: string;
  architectureSuggestion?: string;
  status?: "Idea" | "In Progress" | "Completed";
  savedAt?: string;
}

export interface RoadmapTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface RoadmapPhase {
  phase: string;
  estimatedTime: string;
  tasks: string[];
  deliverables?: string;
  completedTasks?: Record<number, boolean>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  branch: string;
  graduationYear: string;
  skills: string[];
  interests: string[];
  preferredTech: string[];
  collegeName?: string;
}

export interface GeneratorFormData {
  branch: string;
  skills: string;
  interests: string;
  difficulty: string;
  teamSize: string;
  duration: string;
  tech: string;
  domain: string;
}

export interface ImprovementData {
  scalabilityTips: string[];
  vivaQuestions: string[];
  commercialization: string;
}

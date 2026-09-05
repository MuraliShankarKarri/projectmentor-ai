import { GeneratorFormData, ProjectIdea, RoadmapPhase, ImprovementData } from "../types";

export async function generateProjectsAPI(formData: GeneratorFormData): Promise<ProjectIdea[]> {
  try {
    const response = await fetch("/api/generate-projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid response structure from server");
    }

    return data.map((item, index) => ({
      ...item,
      id: item.id || `gen-${Date.now()}-${index}`,
      branch: item.branch || formData.branch,
      domain: item.domain || formData.domain,
      teamSize: item.teamSize || formData.teamSize,
      difficultyLevel: item.difficultyLevel || formData.difficulty,
      estimatedDuration: item.estimatedDuration || formData.duration,
      status: "Idea",
    }));
  } catch (error) {
    console.error("API error in generateProjectsAPI:", error);
    throw error;
  }
}

export async function sendMentorMessageAPI(
  message: string,
  project?: ProjectIdea | null,
  history: { role: string; text: string }[] = []
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        project,
        history,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.text || "I have received your query. How else may I assist with your project?";
  } catch (error) {
    console.error("API error in sendMentorMessageAPI:", error);
    throw error;
  }
}

export async function generateRoadmapAPI(project: ProjectIdea): Promise<RoadmapPhase[]> {
  try {
    const response = await fetch("/api/generate-roadmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("API error in generateRoadmapAPI:", error);
    throw error;
  }
}

export async function improveProjectAPI(project: ProjectIdea): Promise<ImprovementData> {
  try {
    const response = await fetch("/api/improve-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API error in improveProjectAPI:", error);
    throw error;
  }
}

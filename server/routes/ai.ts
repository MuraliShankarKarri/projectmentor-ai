import { Router, Request, Response } from "express";
import {
  getGenAIClient,
  getFallbackProjects,
  getStandardRoadmapPhases,
} from "../services/gemini";

export const aiRouter = Router();

/**
 * POST /api/generate-projects
 * Synthesizes 5 tailored final-year engineering projects with full architecture.
 */
aiRouter.post("/generate-projects", async (req: Request, res: Response) => {
  const {
    branch = "Computer Science & Engineering",
    skills = "React, Node.js, Python, SQL",
    interests = "Healthcare, AI, Web Applications",
    difficulty = "Intermediate",
    teamSize = "3 Members",
    duration = "3 Months",
    tech = "React, Express, PostgreSQL, Tailwind CSS",
    domain = "Full-Stack Web App",
  } = req.body || {};

  const ai = getGenAIClient();
  const fallbacks = getFallbackProjects({
    branch,
    skills,
    interests,
    difficulty,
    teamSize,
    duration,
    tech,
    domain,
  });

  if (!ai) {
    return res.json(fallbacks);
  }

  const prompt = `You are a senior university computer science and engineering professor, project coordinator, and research mentor.
Your task is to generate exactly 5 realistic, innovative, practical, and highly defendable final-year engineering project ideas for college students.

Student Constraints:
- Academic Branch: ${branch}
- Known Skills & Libraries: ${skills}
- Interests & Problem Domains: ${interests}
- Difficulty Level: ${difficulty}
- Team Size: ${teamSize}
- Project Duration: ${duration}
- Preferred Technologies: ${tech || "Modern standard open-source tools"}
- Target Project Domain: ${domain || "Full-Stack Web Application"}

Requirements:
1. Ideas must NOT be generic clones (no basic calculators or toy to-do apps). They must solve real-world problems with viable datasets, clear user personas, and demonstrable outcomes.
2. The complexity must match "${difficulty}" level and be achievable within "${duration}" by "${teamSize}".
3. Provide realistic tech stacks (Frontend, Backend, Database, AI/ML libraries, Cloud hosting).
4. Return ONLY a valid JSON array of 5 objects matching the specified schema. Do not wrap in markdown \`\`\`json code fences.

JSON Schema for each object:
{
  "id": "unique string (e.g. proj-1, proj-2...)",
  "title": "Clear, professional project title",
  "shortDescription": "2-3 sentence overview of what it does",
  "problemStatement": "Specific real-world bottleneck or academic challenge being solved",
  "proposedSolution": "Architectural and functional solution",
  "targetUsers": "Target demographic, university stakeholders, or industry sector",
  "mainFeatures": ["array of 4 key baseline deliverables"],
  "advancedFeatures": ["array of 3 advanced features that impress external examiners"],
  "techStack": ["array of technologies: e.g. React, Node.js, PostgreSQL, etc."],
  "difficultyLevel": "${difficulty}",
  "estimatedDuration": "${duration}",
  "expectedOutcome": "Measurable end-state at final viva presentation",
  "futureImprovements": "Potential roadmap post-graduation or patent/research scope",
  "branch": "${branch}",
  "domain": "${domain}"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const cleanJson = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleanJson);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json(parsed);
    }
    return res.json(fallbacks);
  } catch (error) {
    console.error("Gemini project generation error:", error);
    return res.json(fallbacks);
  }
});

/**
 * POST /api/generate-roadmap
 * Generates a structured 9-phase development roadmap for a selected project.
 */
aiRouter.post("/generate-roadmap", async (req: Request, res: Response) => {
  const { project } = req.body || {};
  if (!project || !project.title) {
    return res.status(400).json({ error: "Project data is required" });
  }

  const ai = getGenAIClient();
  const standardPhases = getStandardRoadmapPhases();

  if (!ai) {
    return res.json(standardPhases);
  }

  const prompt = `Create a comprehensive, academic-grade 9-phase development roadmap for this final-year college project:
Project Title: ${project.title}
Short Description: ${project.shortDescription}
Tech Stack: ${Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack}
Duration: ${project.estimatedDuration || "3-6 Months"}

The roadmap MUST be divided into these exact 9 phases:
1. Requirement Analysis
2. System Design
3. UI Development
4. Backend Development
5. Database
6. AI Integration
7. Testing
8. Deployment
9. Documentation

Return ONLY a valid JSON array of 9 objects. Do not include markdown \`\`\`json tags.
Each object must match this schema:
{
  "phase": "string (e.g. Phase 1: Requirement Analysis)",
  "estimatedTime": "string (e.g. 2 Weeks)",
  "tasks": ["array of 4 specific actionable technical tasks for this project"],
  "deliverables": "string (what the student can submit to faculty guide)"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const cleanJson = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleanJson);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json(parsed);
    }
    return res.json(standardPhases);
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return res.json(standardPhases);
  }
});

/**
 * POST /api/improve-project
 * Provides viva defense tips, scalability suggestions, and publication guidance.
 */
aiRouter.post("/improve-project", async (req: Request, res: Response) => {
  const { project } = req.body || {};
  if (!project || !project.title) {
    return res.status(400).json({ error: "Project data required" });
  }

  const ai = getGenAIClient();

  const standardImprovements = {
    scalabilityTips: [
      "Implement Redis caching for frequently fetched read queries",
      "Adopt asynchronous message queues (RabbitMQ/BullMQ) for heavy AI tasks",
      "Break monolithic controllers into domain-driven micro-services if team size allows",
    ],
    vivaQuestions: [
      "Why did you choose this tech stack over traditional alternatives?",
      "How does your solution guarantee data consistency during high concurrent traffic?",
      "What are the primary security vulnerabilities in your architecture, and how did you mitigate them?",
      "What is the mathematical or computational complexity of your core algorithm?",
    ],
    commercialization:
      "This project can be pitched as a B2B SaaS tool or submitted to university incubator grants.",
  };

  if (!ai) {
    return res.json(standardImprovements);
  }

  const prompt = `As a senior engineering viva examiner and project advisor, analyze this college final-year project and provide critical improvements to help students secure an 'A+' grade:
Title: ${project.title}
Problem: ${project.problemStatement}
Tech Stack: ${Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack}

Return ONLY valid JSON with:
{
  "scalabilityTips": ["3 technical architectural suggestions to make it industry-grade"],
  "vivaQuestions": ["4 tough questions examiners will ask during oral defense with brief model answer hints"],
  "commercialization": "1-2 sentences on patent, startup, or research paper publication potential"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const cleanJson = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("Improve project error:", error);
    return res.json(standardImprovements);
  }
});

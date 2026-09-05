import { Router, Request, Response } from "express";
import { getGenAIClient } from "../services/gemini";

export const mentorRouter = Router();

/**
 * Handle mentor chat message
 */
async function handleMentorChat(req: Request, res: Response) {
  const { message, project, history = [] } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message string required" });
  }

  const ai = getGenAIClient();

  if (!ai) {
    const demoReply = `[Demo Mentor Mode] I have analyzed your question regarding "${message.slice(
      0,
      50
    )}...". For a final-year project of this nature, prioritize clear module separation (e.g., Member 1: API & DB, Member 2: Frontend & UX, Member 3: ML Pipeline & Deployment). Keep all endpoints documented with Swagger and configure free hosting on Cloud Run or Render.`;
    return res.json({ reply: demoReply, text: demoReply });
  }

  const projectContext = project
    ? `Current Project Context:
Title: ${project.title}
Problem Statement: ${project.problemStatement || project.shortDescription}
Tech Stack: ${Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack}
Estimated Duration: ${project.estimatedDuration}
Difficulty: ${project.difficultyLevel}`
    : "No specific project selected. Provide general final-year engineering project advice.";

  const systemInstruction = `You are a supportive, highly experienced senior Computer Science & Engineering professor, head of department, and project viva examiner.
You are mentoring college students on their final-year undergraduate capstone project.
Be encouraging, practical, and provide actionable technical guidance.
Advise them on:
1. Architectural decisions & tech stack trade-offs (e.g. PostgreSQL vs MongoDB, Redis caching, microservices vs monolith).
2. Fair team module division across teammates based on team size.
3. Free-tier deployment options (Cloud Run, Render, Vercel, Supabase, Neon) so students don't spend money.
4. Viva defense cross-examination preparation: what external university examiners test and how to explain algorithmic complexity or database normalization.
5. IEEE standard formatting for documentation reports and research papers.

${projectContext}

Provide clear, formatted markdown responses with bullet points where appropriate. Keep explanations direct and academically rigorous.`;

  try {
    const formattedContents: any[] = [];

    // Append previous dialogue turns if provided
    if (Array.isArray(history)) {
      history.slice(-6).forEach((h: any) => {
        formattedContents.push({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.text }],
        });
      });
    }

    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "I am ready to help with your project questions.";
    return res.json({ reply, text: reply });
  } catch (error: any) {
    console.error("Mentor chat error:", error);
    const fallbackMsg =
      "I encountered a momentary delay connecting to Gemini. As a guideline: always ensure your architecture is modular with clear REST contracts, and rehearse your viva demo in an incognito window.";
    return res.json({ reply: fallbackMsg, text: fallbackMsg });
  }
}

// Support both endpoint routes
mentorRouter.post("/mentor-chat", handleMentorChat);
mentorRouter.post("/chat", handleMentorChat);

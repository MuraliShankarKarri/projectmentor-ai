import { Router, Request, Response } from "express";

export const projectsRouter = Router();

/**
 * GET /api/projects/health
 * Health status and system capability verification.
 */
projectsRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "ProjectMentor AI",
    version: "2.0.0",
    aiEngine: "Gemini 3.8 Flash",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/projects/presets
 * Returns curated high-value engineering capstone presets.
 */
projectsRouter.get("/presets", (_req: Request, res: Response) => {
  res.json([
    {
      id: "preset-cse-ocr",
      label: "Healthcare & Prescription OCR (CSE)",
      branch: "Computer Science & Engineering",
      skills: "React, Node.js, Python, OCR / Computer Vision",
      interests: "Healthcare, Medical Accessibility, Telemedicine",
      difficulty: "Intermediate",
      teamSize: "3 Members",
      duration: "3 Months",
      tech: "React, Express, Tesseract.js, MongoDB, Tailwind CSS",
      domain: "Full-Stack Web App",
    },
    {
      id: "preset-ai-agri",
      label: "Smart Agriculture AI & Disease Diagnosis (AI/DS)",
      branch: "AI & Data Science",
      skills: "Python, PyTorch, OpenCV, Flask, React",
      interests: "AgriTech, Crop Disease Diagnosis, Rural Tech",
      difficulty: "Intermediate",
      teamSize: "3-4 Members",
      duration: "6 Months",
      tech: "Python, FastAPI, TensorFlow/Keras, React, PostgreSQL",
      domain: "Machine Learning / Computer Vision",
    },
    {
      id: "preset-ece-iot",
      label: "Smart Campus IoT Energy & Power Allocator (ECE/EEE)",
      branch: "Electronics & Communication",
      skills: "C++, ESP32 / Arduino, MQTT, Node.js, React",
      interests: "Smart Campus, Renewable Energy, Green Tech",
      difficulty: "Advanced",
      teamSize: "4 Members",
      duration: "6 Months",
      tech: "ESP32, MQTT Broker, React, Node.js, TimescaleDB",
      domain: "IoT / Embedded Systems",
    },
    {
      id: "preset-it-fintech",
      label: "FinTech Micro-Savings & Shared Budgeting (IT/Web)",
      branch: "Information Technology",
      skills: "TypeScript, React, Node.js, PostgreSQL",
      interests: "FinTech, Student Budgeting, Fraud Detection",
      difficulty: "Beginner",
      teamSize: "2 Members",
      duration: "3 Months",
      tech: "React, Express, Prisma, PostgreSQL, Chart.js",
      domain: "Full-Stack Web App",
    },
  ]);
});

import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { aiRouter } from "./server/routes/ai";
import { mentorRouter } from "./server/routes/mentor";
import { projectsRouter } from "./server/routes/projects";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Mount modular API routers
app.use("/api", aiRouter);
app.use("/api", mentorRouter);
app.use("/api", projectsRouter);

// Health check route
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", app: "ProjectMentor AI" });
});

// Setup Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ProjectMentor AI] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

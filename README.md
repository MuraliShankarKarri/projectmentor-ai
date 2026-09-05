# ProjectMentor AI 🎓

An AI-powered engineering capstone platform designed specifically for final-year undergraduate students. ProjectMentor AI synthesizes practical, branch-specific, and academically defendable project ideas, comprehensive 9-phase development roadmaps, and provides continuous AI mentorship for architecture decisions, team workload division, and oral viva defense.

---

## 📁 Project Architecture & Directory Tree

The platform is architected as a full-stack web application with modular separation of concerns across client and server layers:

```
projectmentor-ai/
│
├── client/ (or /src in unified Vite+Express deployment)
│   ├── src/
│   │   ├── components/       # Reusable UI components (Sidebar, Navbar, ProjectCard, etc.)
│   │   ├── pages/            # View views (Dashboard, Generator, Roadmap, MentorChat, etc.)
│   │   ├── services/         # Client-side API proxy services (api.ts)
│   │   ├── hooks/            # Custom React hooks (useProjectMentor, useDarkMode)
│   │   ├── context/          # State providers (ProjectContext, AuthContext)
│   │   ├── App.tsx           # Primary routing and application shell
│   │   ├── main.tsx          # Client React entry point
│   │   └── types.ts          # TypeScript interfaces & domain schemas
│   │
│   └── package.json
│
├── server/
│   ├── routes/
│   │   ├── ai.ts             # AI generation endpoints (/api/generate-projects, /api/generate-roadmap)
│   │   ├── projects.ts       # Health status & capstone preset catalogs
│   │   └── mentor.ts         # Real-time viva mentor chat route (/api/mentor-chat)
│   │
│   ├── services/
│   │   └── gemini.ts         # Google Gen AI SDK client & fallback knowledge generator
│   │
│   ├── config/
│   │   └── firebase.ts       # Firebase Authentication & Firestore configuration
│   │
│   ├── server.ts             # Node.js/Express entry point with Vite middleware integration
│   └── package.json
│
├── .env                      # Environment secrets (GEMINI_API_KEY, PORT)
├── .env.example              # Template documentation of required environment variables
├── .gitignore                # Git exclusions
├── README.md                 # Complete documentation
└── package.json              # Monorepo build and development scripts
```

---

## ⚡ Key Features

1. **Context-Aware Project Generator**:
   - Synthesizes 5 tailored final-year engineering projects based on academic branch, known skills, team size, duration, difficulty preference, and target domain.
   - Outputs complete blueprints with problem statements, proposed solutions, target user personas, tech stacks, and expected viva outcomes.

2. **9-Phase Engineering Development Roadmap**:
   - Structured milestone breakdown:
     - `Phase 1`: Requirement Analysis (SRS & Literature Survey)
     - `Phase 2`: System Design (UML, ER Diagrams & Architecture)
     - `Phase 3`: UI/UX Development (Prototypes & Accessible Components)
     - `Phase 4`: Backend Development (Express API & Middleware)
     - `Phase 5`: Database & Persistence (Schema & Query Optimization)
     - `Phase 6`: AI & Core Integration (Gemini / ML Pipeline)
     - `Phase 7`: Testing & QA (Unit Tests & Integration)
     - `Phase 8`: Deployment & Cloud Hosting
     - `Phase 9`: Documentation & Viva Preparation (IEEE Report & Slides)
   - Interactive task checklists with percentage completion tracking.

3. **Senior Faculty & Viva Voce Advisor**:
   - Interactive chat workspace grounded in your active project context.
   - Practical advice on modular team role division, relational vs. NoSQL database selection, free-tier hosting configurations, and anticipated external examiner cross-examination questions.

4. **"Professional Polish" Workspace**:
   - High-contrast sidebar navigation (`bg-slate-900`), responsive mobile off-canvas drawer, live `Gemini Pro Online` indicator, and persistent dark/light theme switching.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide Icons, Motion |
| **Backend** | Node.js, Express 4, TypeScript, tsx, esbuild |
| **AI Integration** | Google GenAI SDK (`@google/genai`), Gemini 3.8 Flash |
| **Persistence** | LocalStorage state cache, Firebase Authentication & Firestore readiness |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x+
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### 1. Installation

Clone the repository and install all dependencies:

```bash
git clone https://github.com/your-org/projectmentor-ai.git
cd projectmentor-ai
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Gemini API Key (Server-side secret, never exposed to client)
GEMINI_API_KEY=your_gemini_api_key_here

# Application Port (Defaults to 3000)
PORT=3000
```

### 3. Running in Development Mode

Starts the Express server with embedded Vite middleware for hot-reloading:

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

### 4. Production Build & Start

To compile both client assets and server bundle for production deployment:

```bash
npm run build
npm start
```

---

## 📡 API Endpoints Reference

### AI Routes (`server/routes/ai.ts`)

- **`POST /api/generate-projects`**
  - **Payload**:
    ```json
    {
      "branch": "Computer Science & Engineering",
      "skills": "React, Node.js, Python, PostgreSQL",
      "interests": "Healthcare, Telemedicine",
      "difficulty": "Intermediate",
      "teamSize": "3 Members",
      "duration": "3 Months",
      "tech": "React, Express, PostgreSQL",
      "domain": "Full-Stack Web App"
    }
    ```
  - **Response**: Array of 5 structured project objects.

- **`POST /api/generate-roadmap`**
  - **Payload**: `{ "project": ProjectIdea }`
  - **Response**: Array of 9 structured phase objects with tasks and deliverables.

- **`POST /api/improve-project`**
  - **Payload**: `{ "project": ProjectIdea }`
  - **Response**: `{ "scalabilityTips": [], "vivaQuestions": [], "commercialization": "" }`

### Mentor Routes (`server/routes/mentor.ts`)

- **`POST /api/mentor-chat`**
  - **Payload**:
    ```json
    {
      "message": "Which database is best for our healthcare OCR project?",
      "project": ProjectIdea,
      "history": [ { "role": "user", "text": "..." }, { "role": "assistant", "text": "..." } ]
    }
    ```
  - **Response**: `{ "reply": "markdown advice from senior faculty guide" }`

### Project Routes (`server/routes/projects.ts`)

- **`GET /api/projects/health`**: Health status check.
- **`GET /api/projects/presets`**: Curated engineering domain templates.

---

## 🌐 Deployment Guidelines

- **Google Cloud Run / Container Platforms**:
  Containerize the repository with Docker. Node executes `dist/server.cjs` on port 3000.
- **Split Client & Server (Optional)**:
  - Deploy `/client` to Vercel or Cloudflare Pages with `VITE_API_URL` pointing to the backend.
  - Deploy `/server` to Render, Railway, or Google Cloud Run.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

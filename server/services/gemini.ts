import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Lazy initialization of the Gemini GenAI client.
 * Uses the modern @google/genai TypeScript SDK.
 */
let aiClient: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI | null {
  if (aiClient) {
    return aiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  return aiClient;
}

/**
 * Fallback generator for realistic project ideas if API key is not configured or rate-limited.
 */
export function getFallbackProjects(params: {
  branch?: string;
  skills?: string;
  interests?: string;
  difficulty?: string;
  teamSize?: string;
  duration?: string;
  tech?: string;
  domain?: string;
}) {
  const branch = params.branch || "Computer Science & Engineering";
  const domain = params.domain || "Full-Stack Web App";

  return [
    {
      id: "proj-" + Date.now() + "-1",
      title: "Smart Campus Resource & High-Compute Lab Allocator",
      shortDescription:
        "An AI-optimized scheduling system for college laboratories, high-compute GPU nodes, and seminar halls.",
      problemStatement:
        "College research labs and compute clusters face frequent scheduling conflicts, unmonitored equipment usage, and manual paper-based approval bottlenecks.",
      proposedSolution:
        "A centralized platform integrating conflict-free algorithmic scheduling, automated student attendance logging via QR/NFC, and GPU compute queue monitoring.",
      targetUsers: "University students, lab assistants, faculty coordinators, and department heads.",
      mainFeatures: [
        "Interactive real-time lab calendar and slot reservation",
        "Role-based authorization (Student, Faculty, Lab Admin)",
        "Equipment maintenance logging and notification system",
        "Automated booking approvals based on student course enrollment",
      ],
      advancedFeatures: [
        "Predictive peak-hour usage analytics using historical data",
        "Dynamic priority queue allocation for final-year thesis researchers",
        "Telegram/Email automated reminders for upcoming reserved slots",
      ],
      techStack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
      difficultyLevel: params.difficulty || "Intermediate",
      estimatedDuration: params.duration || "3 Months",
      expectedOutcome:
        "A deployed web application capable of managing 500+ daily reservations with zero double-booking conflicts.",
      futureImprovements:
        "Integration with IoT smart door access locks and automated power shut-off for idle workstations.",
      branch,
      domain,
    },
    {
      id: "proj-" + Date.now() + "-2",
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
      techStack: ["React", "Node.js", "Tesseract.js / Cloud Vision", "MongoDB", "Express", "Tailwind CSS"],
      difficultyLevel: params.difficulty || "Intermediate",
      estimatedDuration: params.duration || "3 Months",
      expectedOutcome:
        "A functional healthcare utility allowing patients to upload prescriptions and generate accurate medicine schedules.",
      futureImprovements:
        "Integration with FHIR/ABHA standard government healthcare exchange APIs.",
      branch,
      domain,
    },
    {
      id: "proj-" + Date.now() + "-3",
      title: "EcoTrack: Smart Campus Carbon Footprint & Energy Dashboard",
      shortDescription:
        "An IoT & analytics platform tracking energy consumption across college departments with conservation recommendations.",
      problemStatement:
        "Universities incur massive energy bills and carbon emissions due to unmonitored air conditioning, lighting, and computing clusters in empty rooms.",
      proposedSolution:
        "A telemetry ingestion pipeline and analytical dashboard displaying departmental electricity metrics with actionable conservation insights.",
      targetUsers: "Campus facility managers, university sustainability committees, and green campus clubs.",
      mainFeatures: [
        "Live energy metric feeds by building and academic block",
        "Energy consumption anomaly detection alerts",
        "Departmental green leaderboard and gamified conservation targets",
        "Exportable sustainability audit reports for NAAC/ABET accreditation",
      ],
      advancedFeatures: [
        "Solar generation vs campus consumption offset modeling",
        "Automated recommendations for optimal HVAC schedule setpoints",
        "Cost forecast simulation based on utility tariff tiers",
      ],
      techStack: ["React", "Node.js", "Express", "TimescaleDB / PostgreSQL", "Chart.js", "Tailwind CSS"],
      difficultyLevel: params.difficulty || "Advanced",
      estimatedDuration: params.duration || "6 Months",
      expectedOutcome:
        "A verified analytics system presenting live and simulated energy telemetry with automated anomaly warnings.",
      futureImprovements:
        "Direct connection to BACnet/Modbus smart energy meters and automated building control relays.",
      branch,
      domain,
    },
    {
      id: "proj-" + Date.now() + "-4",
      title: "AgriSense: Computer Vision Crop Disease & Yield Estimator",
      shortDescription:
        "An edge AI mobile application that identifies plant leaf pathogens and advises local organic remedies.",
      problemStatement:
        "Smallholder farmers face severe crop losses because agricultural extension officers cannot inspect remote farm plots promptly during pest outbreaks.",
      proposedSolution:
        "A computer vision diagnosis model running lightweight inference on smartphone photos of diseased plant leaves, producing immediate treatment guides.",
      targetUsers: "Agronomists, smallholder farmers, rural farming cooperatives, and agriculture students.",
      mainFeatures: [
        "Camera-based leaf symptom snapshot & disease classification",
        "Offline-capable disease reference catalog with local language audio",
        "Weather forecast alerts for spray timing",
        "Geo-tagged outbreak mapping for agricultural officers",
      ],
      advancedFeatures: [
        "Confidence score breakdown with second-opinion suggestions",
        "Pesticide dosage calculator based on farm acre dimensions",
        "Community forum for neighboring farmers to share verified pest alerts",
      ],
      techStack: ["React / React Native", "Python / FastAPI", "PyTorch / TensorFlow", "SQLite / PostgreSQL"],
      difficultyLevel: params.difficulty || "Intermediate",
      estimatedDuration: params.duration || "3-6 Months",
      expectedOutcome:
        "A working model delivering >88% diagnostic accuracy across 15 common regional crop diseases.",
      futureImprovements:
        "Drone multispectral imagery ingestion for macro-field health mapping.",
      branch,
      domain,
    },
    {
      id: "proj-" + Date.now() + "-5",
      title: "FinWise: Student Peer Micro-Savings & Expense Analyzer",
      shortDescription:
        "A financial literacy and peer micro-group savings portal designed specifically for college students.",
      problemStatement:
        "College undergraduates often struggle with financial management, unpredictable textbook/hostel expenses, and lack accessible collaborative budgeting tools.",
      proposedSolution:
        "A peer budgeting web application featuring automated expense categorization, shared flatmate split bills, and goal-oriented savings vaults.",
      targetUsers: "College students, hostel flatmates, campus clubs, and early-career graduates.",
      mainFeatures: [
        "Automatic expense category breakdown with monthly spending limits",
        "Group bill splitting with debt simplification algorithms",
        "Shared savings jars for semester trips or club projects",
        "Interactive analytics charts tracking personal cash flow",
      ],
      advancedFeatures: [
        "AI financial advisor suggesting personalized cost reductions",
        "Exportable PDF summaries for parent allowance reporting",
        "Gamified savings streaks and financial trivia badges",
      ],
      techStack: ["React", "Express", "Node.js", "PostgreSQL / Supabase", "Chart.js", "Tailwind CSS"],
      difficultyLevel: params.difficulty || "Beginner",
      estimatedDuration: params.duration || "1-3 Months",
      expectedOutcome:
        "A functional web app enabling students to manage group splits and hit weekly personal saving goals.",
      futureImprovements:
        "Direct integration with Open Banking APIs (Plaid / UPI auto-debit).",
      branch,
      domain,
    },
  ];
}

/**
 * Standard fallback roadmap with 9 engineering phases.
 */
export function getStandardRoadmapPhases() {
  return [
    {
      phase: "Phase 1: Requirement Analysis",
      estimatedTime: "2 Weeks",
      tasks: [
        "Conduct stakeholder interviews and user persona modeling",
        "Document functional and non-functional requirements (SRS document)",
        "Analyze existing market solutions and literature survey for project synopsis",
        "Finalize project scope boundaries and deliverables checklist",
      ],
      deliverables: "Software Requirements Specification (SRS) & Literature Survey Report",
    },
    {
      phase: "Phase 2: System Design",
      estimatedTime: "2 Weeks",
      tasks: [
        "Design UML class diagrams, ER diagrams, and sequence flows",
        "Architect High-Level Design (HLD) and Low-Level Design (LLD)",
        "Define RESTful API contracts and JSON payload schemas",
        "Select tech stack libraries, state management, and ORM tools",
      ],
      deliverables: "System Architecture Document & Database Schema Blueprint",
    },
    {
      phase: "Phase 3: UI/UX Development",
      estimatedTime: "3 Weeks",
      tasks: [
        "Create responsive wireframes and low-fidelity prototypes",
        "Implement student-friendly accessible design system using Tailwind CSS",
        "Build key interactive views (Dashboard, Form inputs, Details cards)",
        "Handle empty states, loading skeletons, and error toasts",
      ],
      deliverables: "Interactive Frontend Prototype & Component Library",
    },
    {
      phase: "Phase 4: Backend Development",
      estimatedTime: "3 Weeks",
      tasks: [
        "Set up Node.js/Express server scaffolding and middleware layers",
        "Implement secure authentication and token session authorization",
        "Develop core CRUD business logic controllers and routes",
        "Add input sanitization and rate limiting security guards",
      ],
      deliverables: "Tested Backend APIs with Swagger/Postman Documentation",
    },
    {
      phase: "Phase 5: Database & Persistence",
      estimatedTime: "2 Weeks",
      tasks: [
        "Provision database instances and configure migration scripts",
        "Establish relational indexes, foreign keys, and security rules",
        "Implement database connection pooling and query optimization",
        "Seed database with realistic initial test data for demonstration",
      ],
      deliverables: "Production-ready Database Cluster with Automated Backups",
    },
    {
      phase: "Phase 6: AI & Core Integration",
      estimatedTime: "2-3 Weeks",
      tasks: [
        "Connect Gemini API / ML models via secure server-side proxy routes",
        "Implement prompt templates, structured output parsing, and fallbacks",
        "Wire frontend asynchronous calls with real-time UI state updates",
        "Optimize API latency and handle model quota edge cases",
      ],
      deliverables: "End-to-end Integrated AI Workflow and Feature Modules",
    },
    {
      phase: "Phase 7: Testing & Quality Assurance",
      estimatedTime: "2 Weeks",
      tasks: [
        "Write unit tests for core helper functions and validation routines",
        "Perform integration testing across all client-server endpoints",
        "Conduct usability testing with classmate peer reviewers",
        "Fix edge cases, unresponsive views, and edge failure modes",
      ],
      deliverables: "Test Coverage Summary & Bug Fix Verification Matrix",
    },
    {
      phase: "Phase 8: Deployment & Hosting",
      estimatedTime: "1 Week",
      tasks: [
        "Containerize application using Docker or Cloud deployment configurations",
        "Configure production environment variables and SSL certificates",
        "Deploy client and server to Cloud Run, Vercel, or Render",
        "Perform smoke tests on the live public URL",
      ],
      deliverables: "Live Production URL accessible on mobile and desktop",
    },
    {
      phase: "Phase 9: Documentation & Viva Preparation",
      estimatedTime: "2 Weeks",
      tasks: [
        "Format IEEE / University standard final project dissertation report",
        "Prepare 15-slide PowerPoint deck highlighting problem, demo, and metrics",
        "Record 3-minute high-definition video walkthrough backup for live demo",
        "Rehearse potential examiner cross-examination questions and architecture justification",
      ],
      deliverables: "Hard-bound Project Report, Slide Deck, & Viva Defense Guide",
    },
  ];
}

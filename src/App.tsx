import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider, useProject } from "./context/ProjectContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AppHeader } from "./components/AppHeader";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { GeneratorPage } from "./pages/GeneratorPage";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage";
import { MentorChatPage } from "./pages/MentorChatPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { MyProjectsPage } from "./pages/MyProjectsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProjectIdea } from "./types";

function MainAppContent() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("pm_theme") === "dark";
    } catch {
      return false;
    }
  });

  const { selectedProject, setSelectedProject, setActiveRoadmap } = useProject();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("pm_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("pm_theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetails = (project: ProjectIdea) => {
    setSelectedProject(project);
    setCurrentPage("project-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAskMentor = (project: ProjectIdea) => {
    setSelectedProject(project);
    setCurrentPage("mentor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToRoadmap = (project: ProjectIdea) => {
    setSelectedProject(project);
    setActiveRoadmap(null); // Will trigger generation for selected project
    setCurrentPage("roadmap");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isWorkspace = currentPage !== "landing";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      {isWorkspace ? (
        /* Professional Polish Workspace Layout: Sidebar on left + Header on top + Content */
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <AppHeader
              currentPage={currentPage}
              onOpenMobileMenu={() => setMobileSidebarOpen(true)}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
            />

            <main className="flex-1 pb-10">
              {currentPage === "dashboard" && (
                <Dashboard
                  onNavigate={handleNavigate}
                  onViewDetails={handleViewDetails}
                  onAskMentor={handleAskMentor}
                />
              )}

              {currentPage === "generator" && (
                <GeneratorPage
                  onViewDetails={handleViewDetails}
                  onAskMentor={handleAskMentor}
                />
              )}

              {currentPage === "project-details" && (
                <ProjectDetailsPage
                  project={selectedProject}
                  onBack={() => handleNavigate("generator")}
                  onNavigateToRoadmap={handleNavigateToRoadmap}
                  onNavigateToMentor={handleAskMentor}
                />
              )}

              {currentPage === "roadmap" && (
                <RoadmapPage
                  project={selectedProject}
                  onBack={() => handleNavigate("project-details")}
                  onNavigateToMentor={handleAskMentor}
                />
              )}

              {currentPage === "mentor" && (
                <MentorChatPage initialProject={selectedProject} />
              )}

              {currentPage === "my-projects" && (
                <MyProjectsPage
                  onNavigateToGenerator={() => handleNavigate("generator")}
                  onViewDetails={handleViewDetails}
                  onNavigateToRoadmap={handleNavigateToRoadmap}
                  onNavigateToMentor={handleAskMentor}
                />
              )}

              {currentPage === "profile" && <ProfilePage />}
            </main>

            <Footer onNavigate={handleNavigate} />
          </div>
        </div>
      ) : (
        /* Landing Page Layout with Top Navbar & Full-Width Sections */
        <div className="flex flex-col min-h-screen">
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />

          <main className="flex-1">
            <LandingPage
              onNavigate={handleNavigate}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </main>

          <Footer onNavigate={handleNavigate} />
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <MainAppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;

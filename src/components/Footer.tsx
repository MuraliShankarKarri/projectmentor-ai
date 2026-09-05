import React from "react";
import { GraduationCap, ShieldCheck, Cpu, Code2, BookOpen, Layers } from "lucide-react";

export const Footer: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer id="app-footer" className="border-t transition-colors duration-200 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">ProjectMentor AI</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Empowering final-year engineering and technology undergraduates to conceptualize, architect, and defend capstone projects with academic excellence.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Realistic & Defendable College Project Engine</span>
            </div>
          </div>

          {/* Col 2: Engineering Branches Supported */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Engineering Disciplines
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>Computer Science & Engineering (CSE)</li>
              <li>Information Technology (IT)</li>
              <li>AI & Machine Learning (AIML / DS)</li>
              <li>Electronics & Communication (ECE)</li>
              <li>Electrical & Embedded Systems (EEE)</li>
              <li>Mechanical & Mechatronics</li>
            </ul>
          </div>

          {/* Col 3: Academic Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Project Milestones
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>Literature Survey & Problem Formulation</li>
              <li>Software Requirements Specification (SRS)</li>
              <li>System Architecture & ER Diagrams</li>
              <li>Algorithm Complexity & Optimization</li>
              <li>University Viva Voce Oral Defense</li>
              <li>IEEE Conference Paper Formatting</li>
            </ul>
          </div>

          {/* Col 4: Platform Security & Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Technical Standards
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start space-x-2">
                <Cpu className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <span>Powered by Gemini 3.8 Flash via secure server-side proxy</span>
              </div>
              <div className="flex items-start space-x-2">
                <Code2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <span>Structured JSON data schemas & practical timelines</span>
              </div>
              <div className="flex items-start space-x-2">
                <Layers className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <span>9-Phase modular roadmap aligned with ABET/NAAC rubrics</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ProjectMentor AI. Designed for undergraduate university engineers.</p>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All systems active</span>
            </span>
            <span>Version 2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

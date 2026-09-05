import React, { createContext, useContext, useState, useEffect } from "react";
import { StudentProfile } from "../types";

interface AuthContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (profile: Partial<StudentProfile>, pass: string) => Promise<boolean>;
  loginAsDemoStudent: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
}

const DEFAULT_DEMO_USER: StudentProfile = {
  id: "student-demo-2026",
  name: "Ananya Sharma",
  email: "ananya.sharma@paruluniversity.ac.in",
  branch: "Computer Science & Engineering",
  graduationYear: "2026",
  collegeName: "Parul University",
  skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker"],
  interests: ["Artificial Intelligence", "Healthcare Tech", "Cloud Computing"],
  preferredTech: ["React", "Tailwind CSS", "FastAPI", "Firebase", "Gemini API"],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem("pm_student_user");
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("pm_student_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pm_student_user");
    }
  }, [user]);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const namePart = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    const newUser: StudentProfile = {
      id: "usr-" + Date.now(),
      name: formattedName || "Student Scholar",
      email,
      branch: "Computer Science & Engineering",
      graduationYear: "2026",
      collegeName: "Engineering Institute",
      skills: ["React", "Node.js", "Python"],
      interests: ["AI & Data Science", "Web Development"],
      preferredTech: ["React", "Express", "MongoDB"],
    };
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const register = async (profileData: Partial<StudentProfile>, _pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const newUser: StudentProfile = {
      id: "usr-" + Date.now(),
      name: profileData.name || "Engineering Student",
      email: profileData.email || "student@university.edu",
      branch: profileData.branch || "Computer Science",
      graduationYear: profileData.graduationYear || "2026",
      collegeName: profileData.collegeName || "Engineering Institute",
      skills: profileData.skills || ["Python", "JavaScript"],
      interests: profileData.interests || ["Full Stack", "Machine Learning"],
      preferredTech: profileData.preferredTech || ["React", "Node.js"],
    };
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const loginAsDemoStudent = () => {
    setUser(DEFAULT_DEMO_USER);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setUser({
      id: "google-usr-" + Date.now(),
      name: "Parul Tech Scholar",
      email: "2503031460676@paruluniversity.ac.in",
      branch: "Computer Science & Engineering",
      graduationYear: "2026",
      collegeName: "Parul University",
      skills: ["React", "Python", "Cloud Architecture", "FastAPI"],
      interests: ["AI Systems", "EdTech Innovations", "FinTech Security"],
      preferredTech: ["TypeScript", "Next.js", "PostgreSQL", "Gemini 3.8"],
    });
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginAsDemoStudent,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

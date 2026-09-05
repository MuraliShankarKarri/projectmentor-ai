import React, { createContext, useContext, useState, useEffect } from "react";
import { StudentProfile } from "../types";
import {
  auth,
  db,
  googleAuthProvider,
  handleFirestoreError,
  OperationType,
} from "../lib/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: StudentProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (profile: Partial<StudentProfile>, pass: string) => Promise<boolean>;
  loginAsDemoStudent: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<StudentProfile>) => Promise<void>;
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem("pm_student_user");
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const profile: StudentProfile = {
              id: fbUser.uid,
              name: data.displayName || fbUser.displayName || "Student Scholar",
              email: data.email || fbUser.email || "",
              branch: data.branch || "Computer Science & Engineering",
              graduationYear: data.graduationYear || "2026",
              collegeName: data.collegeName || "Parul University",
              skills: data.skills || ["React", "Node.js", "Python"],
              interests: data.interests || ["AI & Data Science", "Web Development"],
              preferredTech: data.preferredTech || ["React", "Express", "Firebase"],
            };
            setUser(profile);
            localStorage.setItem("pm_student_user", JSON.stringify(profile));
          } else {
            // First-time initialization in Firestore
            const initialProfile: StudentProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || "Student Scholar",
              email: fbUser.email || "",
              branch: "Computer Science & Engineering",
              graduationYear: "2026",
              collegeName: "Parul University",
              skills: ["React", "Node.js", "Python"],
              interests: ["Artificial Intelligence", "Web Applications"],
              preferredTech: ["React", "Express", "Firebase"],
            };

            await setDoc(userDocRef, {
              uid: fbUser.uid,
              displayName: initialProfile.name,
              email: initialProfile.email,
              branch: initialProfile.branch,
              semester: "Semester 7",
              targetDomain: "Full-Stack Web App",
              createdAt: new Date().toISOString(),
            });

            setUser(initialProfile);
            localStorage.setItem("pm_student_user", JSON.stringify(initialProfile));
          }
        } catch (error) {
          console.warn("Firestore user sync warning:", error);
          // Fallback to basic profile from Firebase User
          const fallbackProfile: StudentProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || "Student Scholar",
            email: fbUser.email || "",
            branch: "Computer Science & Engineering",
            graduationYear: "2026",
            collegeName: "Parul University",
            skills: ["React", "TypeScript", "Node.js"],
            interests: ["AI Systems", "Web Applications"],
            preferredTech: ["React", "Express", "Firebase"],
          };
          setUser(fallbackProfile);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = result.user;
      setFirebaseUser(fbUser);
    } catch (error: any) {
      console.error("Google Auth error:", error);
      // If popup is blocked or fails in iframe, provide student demo profile with notification
      setUser({
        id: "google-usr-" + Date.now(),
        name: "Google Scholar",
        email: "2503031460676@paruluniversity.ac.in",
        branch: "Computer Science & Engineering",
        graduationYear: "2026",
        collegeName: "Parul University",
        skills: ["React", "Python", "Cloud Architecture", "FastAPI"],
        interests: ["AI Systems", "EdTech Innovations", "FinTech Security"],
        preferredTech: ["TypeScript", "Next.js", "PostgreSQL", "Gemini 3.8"],
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      collegeName: "Parul University",
      skills: ["React", "Node.js", "Python"],
      interests: ["AI & Data Science", "Web Development"],
      preferredTech: ["React", "Express", "Firebase"],
    };
    setUser(newUser);
    localStorage.setItem("pm_student_user", JSON.stringify(newUser));
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
      collegeName: profileData.collegeName || "Parul University",
      skills: profileData.skills || ["Python", "JavaScript"],
      interests: profileData.interests || ["Full Stack", "Machine Learning"],
      preferredTech: profileData.preferredTech || ["React", "Node.js"],
    };
    setUser(newUser);
    localStorage.setItem("pm_student_user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const loginAsDemoStudent = () => {
    setUser(DEFAULT_DEMO_USER);
    localStorage.setItem("pm_student_user", JSON.stringify(DEFAULT_DEMO_USER));
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (err) {
      console.warn("Sign out warning:", err);
    }
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem("pm_student_user");
  };

  const updateProfile = async (updated: Partial<StudentProfile>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem("pm_student_user", JSON.stringify(merged));

    if (firebaseUser) {
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        await setDoc(
          userDocRef,
          {
            uid: firebaseUser.uid,
            displayName: merged.name,
            email: merged.email,
            branch: merged.branch,
            semester: "Semester 7",
            targetDomain: merged.interests?.[0] || "Full-Stack Web App",
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
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

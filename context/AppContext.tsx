"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, User, INITIAL_COURSES, Review } from '@/lib/data';
import { auth, db, APP_ID } from '@/lib/firebase';
import { 
  signInAnonymously, 
  signInWithCustomToken, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  updateDoc
} from 'firebase/firestore';

export interface Enrollment {
  courseId: number;
  userId: string;
  progress: number; 
  currentModuleIdx: number; 
  completedTasks: number[]; 
  lastAccessed: number;
}

interface AppContextType {
  user: User | null;
  courses: Course[];
  enrolledCourses: Course[]; 
  enrollments: Enrollment[]; 
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string, role: 'admin' | 'student') => Promise<void>;
  logout: () => void;
  enroll: (course: Course) => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
  updateProgress: (courseId: number, moduleIdx: number) => Promise<void>;
  addReview: (courseId: number, rating: number, comment: string) => Promise<void>;
  isEnrolled: (courseId: number) => boolean;
  loading: boolean;
  authError: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = (window as any).__initial_auth_token;
      if (token) {
        await signInWithCustomToken(auth, token);
      } 
      // else {
      //   if (!auth.currentUser) {
      //      await signInAnonymously(auth);
      //   }
      // }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setFbUser(u);
      
      if (u && !u.isAnonymous) {
        try {
          const userDocRef = doc(db, 'artifacts', APP_ID, 'users', u.uid, 'profile', 'info');
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({ ...userData, uid: u.uid });
          } else {
            setUser({ 
              name: u.displayName || 'User', 
              email: u.email || '', 
              role: 'student', 
              uid: u.uid 
            });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'courses'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCourses = snapshot.docs.map(doc => doc.data() as Course);
      
      if (fetchedCourses.length === 0) {
        INITIAL_COURSES.forEach(c => {
           setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'courses', c.id.toString()), c);
        });
      } else {
        setCourses(fetchedCourses.sort((a, b) => a.id - b.id));
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!fbUser) {
        setEnrollments([]);
        return;
    }

    const q = query(collection(db, 'artifacts', APP_ID, 'users', fbUser.uid, 'enrollments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEnrollments = snapshot.docs.map(doc => doc.data() as Enrollment);
      setEnrollments(fetchedEnrollments);
    }, (error) => console.error("Error fetching enrollments", error));
    
    return () => unsubscribe();
  }, [fbUser]);


  const loginWithEmail = async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    }
  };

  const registerWithEmail = async (name: string, email: string, password: string, role: 'admin' | 'student') => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      const userDocRef = doc(db, 'artifacts', APP_ID, 'users', userCredential.user.uid, 'profile', 'info');
      await setDoc(userDocRef, {
        name,
        email,
        role,
        uid: userCredential.user.uid
      });
      
      setUser({ name, email, role, uid: userCredential.user.uid });
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setSearchQuery("");
    // await signInAnonymously(auth); 
  };

  const enroll = async (course: Course) => {
    if (!fbUser) return;
    
    const enrollment: Enrollment = {
        courseId: course.id,
        userId: fbUser.uid,
        progress: 0,
        currentModuleIdx: 0,
        completedTasks: [],
        lastAccessed: Date.now()
    };

    // 1. Create Enrollment
    await setDoc(
        doc(db, 'artifacts', APP_ID, 'users', fbUser.uid, 'enrollments', course.id.toString()),
        enrollment
    );

    // 2. Increment Student Count on Course
    const courseRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'courses', course.id.toString());
    const newCount = (course.enrollmentCount || 0) + 1;
    await updateDoc(courseRef, {
        enrollmentCount: newCount,
        students: newCount > 1000 ? `${(newCount/1000).toFixed(1)}k` : newCount.toString()
    });
  };

  const updateProgress = async (courseId: number, moduleIdx: number) => {
      if (!fbUser) return;
      const course = courses.find(c => c.id === courseId);
      const totalModules = course?.syllabus.length || 1;
      
      // Fix: Ensure we don't exceed 100%
      const progress = Math.min(100, Math.round(((moduleIdx + 1) / totalModules) * 100));

      const ref = doc(db, 'artifacts', APP_ID, 'users', fbUser.uid, 'enrollments', courseId.toString());
      await updateDoc(ref, {
          currentModuleIdx: moduleIdx,
          lastAccessed: Date.now(),
          progress
      });
  };

  const addReview = async (courseId: number, rating: number, comment: string) => {
    if (!fbUser || !user) return;
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const newReview: Review = {
        userId: fbUser.uid,
        userName: user.name,
        rating,
        comment,
        date: new Date().toISOString()
    };

    const updatedReviews = [...(course.reviewsList || []), newReview];
    
    // Recalculate Average
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    const courseRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'courses', courseId.toString());
    await updateDoc(courseRef, {
        reviewsList: updatedReviews,
        rating: avgRating,
        reviews: `${updatedReviews.length} reviews`
    });
  };

  const addCourse = async (course: Course) => {
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'courses', course.id.toString()), course);
  };

  const updateCourse = async (course: Course) => {
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'courses', course.id.toString()), course);
  };

  const deleteCourse = async (id: number) => {
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'courses', id.toString()));
  };

  const isEnrolled = (courseId: number) => {
    return enrollments.some((e) => e.courseId === courseId);
  };

  const enrolledCoursesList = enrollments
    .map(e => courses.find(c => c.id === e.courseId))
    .filter((c): c is Course => !!c);

  return (
    <AppContext.Provider value={{ 
      user, courses, enrolledCourses: enrolledCoursesList, enrollments,
      searchQuery, setSearchQuery, 
      loginWithEmail, registerWithEmail, logout, 
      enroll, isEnrolled,
      addCourse, updateCourse, deleteCourse, updateProgress, addReview,
      loading, authError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
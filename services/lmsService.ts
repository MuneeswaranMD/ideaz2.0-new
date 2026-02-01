
import { db } from "../lib/firebase";
import {
    collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
    query, where, getDoc, serverTimestamp, Timestamp, orderBy
} from "firebase/firestore";


// --- Types ---
export interface Course {
    id?: string;
    title: string;
    description: string;
    thumbnail?: string;
    price?: number;
    instructorId?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface Module {
    id?: string;
    courseId: string;
    order: number;
}

export interface School {
    id?: string;
    name: string;
    address: string;
    contactEmail: string;
    contactPhone?: string;
    adminName: string;
    createdAt?: Timestamp;
}

export interface Lesson {
    id?: string;
    moduleId: string;
    courseId: string; // Denormalized for easier querying
    title: string;
    videoUrl?: string; // YouTube or other
    transcript?: string;
    content?: string; // Markdown content
    order: number;
}

export interface Note {
    id?: string;
    lessonId: string;
    userId: string; // The student
    content: string;
    timestamp: string; // Timestamp of video
    createdAt?: Timestamp;
}

export interface Assessment {
    id?: string;
    courseId: string;
    title: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
}

export interface UserProfile {
    uid: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
    enrolledCourses?: string[];

}

export interface LiveClass {
    id?: string;
    title: string;
    meetingUrl: string;
    startTime: string; // ISO string for easier datetime picker handling or Timestamp
    status: 'scheduled' | 'live' | 'completed';
    courseId?: string;
}

export interface AssessmentResult {
    id?: string;
    userId: string;
    assessmentId: string;
    score: number;
    total: number;
    timestamp: Timestamp;
}

// --- Courses API ---
export const getCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
};

export const getCourse = async (id: string) => {
    const docRef = doc(db, "courses", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Course : null;
};

export const createCourse = async (course: Course) => {
    const docRef = await addDoc(collection(db, "courses"), {
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
};

export const updateCourse = async (id: string, updates: Partial<Course>) => {
    const docRef = doc(db, "courses", id);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
};

export const deleteCourse = async (id: string) => {
    await deleteDoc(doc(db, "courses", id));
};

// --- Modules API ---
export const getModules = async (courseId: string) => {
    const q = query(collection(db, "modules"), where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module)).sort((a, b) => a.order - b.order);
};

export const createModule = async (module: Module) => {
    const docRef = await addDoc(collection(db, "modules"), module);
    return docRef.id;
};

export const updateModule = async (id: string, updates: Partial<Module>) => {
    const docRef = doc(db, "modules", id);
    await updateDoc(docRef, updates);
};

export const deleteModule = async (id: string) => {
    await deleteDoc(doc(db, "modules", id));
};

// --- Lessons API ---
export const getLessons = async (moduleId: string) => {
    const q = query(collection(db, "lessons"), where("moduleId", "==", moduleId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson)).sort((a, b) => a.order - b.order);
};

// --- Schools API ---
export const getSchools = async () => {
    const querySnapshot = await getDocs(collection(db, "schools"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as School));
};

export const createSchool = async (school: School) => {
    const docRef = await addDoc(collection(db, "schools"), {
        ...school,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const updateSchool = async (id: string, updates: Partial<School>) => {
    await updateDoc(doc(db, "schools", id), updates);
};

export const deleteSchool = async (id: string) => {
    await deleteDoc(doc(db, "schools", id));
};

export const createLesson = async (lesson: Lesson) => {
    const docRef = await addDoc(collection(db, "lessons"), lesson);
    return docRef.id;
};

export const updateLesson = async (id: string, updates: Partial<Lesson>) => {
    const docRef = doc(db, "lessons", id);
    await updateDoc(docRef, updates);
};

export const deleteLesson = async (id: string) => {
    await deleteDoc(doc(db, "lessons", id));
};

export const getLesson = async (id: string) => {
    const docRef = doc(db, "lessons", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Lesson : null;
};

// --- Notes API ---
// GET /api/notes/:lessonId
export const getNotes = async (lessonId: string, userId?: string) => {
    // If userId is provided, fetch only that user's notes for the lesson
    let q;
    if (userId) {
        q = query(
            collection(db, "notes"),
            where("lessonId", "==", lessonId),
            where("userId", "==", userId)
        );
    } else {
        // Fallback or Admin view: get all notes for the lesson
        q = query(collection(db, "notes"), where("lessonId", "==", lessonId));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
};

// POST /api/notes
export const createNote = async (note: Note) => {
    const docRef = await addDoc(collection(db, "notes"), {
        ...note,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

// DELETE /api/notes/:id
export const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
};

// --- Users (Students) API ---
export const getStudents = async () => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
};

// --- AI Tutor Helper ---
// This is to simulate "GET /api/notes/:lessonId" if the AI needs it
export const getLessonNotes = async (lessonId: string) => {
    // In a real app, 'notes' might correspond to the *content* of the lesson to feed the AI, 
    // OR student's personal notes. The prompt implies feeding "Lesson Notes" to the AI.
    // We'll fetch the lesson content.
    const l = await getDoc(doc(db, "lessons", lessonId));
    if (l.exists()) {
        const data = l.data() as Lesson;
        return data.content || data.transcript || "";
    }
    return "";
};

// --- Assessments API ---
// POST /api/assessments
export const createAssessment = async (assessment: Assessment) => {
    const docRef = await addDoc(collection(db, "assessments"), assessment);
    return docRef.id;
};

// GET /api/assessments/:courseId
export const getAssessments = async (courseId: string) => {
    const q = query(collection(db, "assessments"), where("courseId", "==", courseId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assessment));
};

// POST /api/submit-assessment
export const submitAssessmentResults = async (result: AssessmentResult) => {
    const docRef = await addDoc(collection(db, "assessment_results"), {
        ...result,
        timestamp: serverTimestamp()
    });
    return docRef.id;
};

// GET /api/results/:userId
export const getStudentResults = async (userId: string) => {
    const q = query(collection(db, "assessment_results"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssessmentResult));
};

// --- Live Classes API ---
// POST /api/live
export const createLiveClass = async (liveClass: LiveClass) => {
    const docRef = await addDoc(collection(db, "live_classes"), {
        ...liveClass,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

// GET /api/live
export const getLiveClasses = async () => {
    const q = query(collection(db, "live_classes"), orderBy("startTime", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LiveClass));
};

// PUT /api/live/:id
export const updateLiveClass = async (id: string, updates: Partial<LiveClass>) => {
    await updateDoc(doc(db, "live_classes", id), updates);
};

// DELETE
export const deleteLiveClass = async (id: string) => {
    await deleteDoc(doc(db, "live_classes", id));
};

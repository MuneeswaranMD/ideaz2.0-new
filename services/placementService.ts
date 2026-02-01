
import { db } from "../lib/firebase";
import {
    collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
    query, where, serverTimestamp, Timestamp, orderBy
} from "firebase/firestore";

// --- Types ---
export interface Job {
    id?: string;
    title: string;
    company: string;
    location: string; // e.g. "Remote", "Bangalore"
    type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
    salary?: string;
    description: string;
    requirements?: string[];
    postedAt?: Timestamp;
    status: 'open' | 'closed';
}

export interface JobApplication {
    id?: string;
    jobId: string;
    userId: string;
    applicantName: string;
    email: string;
    resumeUrl?: string; // URL from Storage
    status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
    appliedAt: Timestamp;
}

// --- Jobs API ---
// POST /api/jobs
export const createJob = async (job: Job) => {
    const docRef = await addDoc(collection(db, "jobs"), {
        ...job,
        postedAt: serverTimestamp(),
        status: 'open'
    });
    return docRef.id;
};

// GET /api/jobs
export const getJobs = async () => {
    // Determine ordering. If simple query fails due to index, remove orderBy.
    const q = query(collection(db, "jobs"), orderBy("postedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
};

export const updateJob = async (id: string, updates: Partial<Job>) => {
    await updateDoc(doc(db, "jobs", id), updates);
};

export const deleteJob = async (id: string) => {
    await deleteDoc(doc(db, "jobs", id));
};

// --- Applications API ---
// POST /api/apply
export const applyForJob = async (application: JobApplication) => {
    const docRef = await addDoc(collection(db, "applications"), {
        ...application,
        appliedAt: serverTimestamp(),
        status: 'applied'
    });
    return docRef.id;
};

// GET /api/applications (Admin View)
export const getApplications = async () => {
    const q = query(collection(db, "applications"), orderBy("appliedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
};

// GET /api/applications/:jobId
export const getJobApplications = async (jobId: string) => {
    const q = query(collection(db, "applications"), where("jobId", "==", jobId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
};

export const updateApplicationStatus = async (id: string, status: JobApplication['status']) => {
    await updateDoc(doc(db, "applications", id), { status });
};

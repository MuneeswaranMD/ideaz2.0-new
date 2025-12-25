
/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const getDynamicKnowledge = async () => {
    try {
        const docRef = doc(db, 'settings', 'ai_knowledge');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().content;
        }
    } catch (error) {
        console.error("Error fetching AI knowledge:", error);
    }
    return "";
};

const ALL_PROJECTS = [
    { title: "Academic Portfolio", type: "Static Website", tech: "HTML/CSS", keywords: ["professor", "academic", "research", "portfolio"] },
    { title: "Retrostylings", type: "E-Commerce", tech: "React/Next.js", keywords: ["shopping", "ecommerce", "fashion", "online store"] },
    { title: "PharmaCore UI", type: "UI/UX Design", tech: "Figma", keywords: ["pharmacy", "medical", "software", "dashboard"] },
    { title: "ShopLive Mobile", type: "Mobile App Design", tech: "Flutter", keywords: ["mobile", "app", "live stream", "commerce"] },
    { title: "TravelMate App", type: "UI/UX Design", tech: "Figma", keywords: ["tours", "guide", "travel", "interactive"] },
    { title: "Modern Business Portal", type: "WordPress Website", tech: "PHP", keywords: ["wordpress", "cms", "corporate", "branding"] },
    { title: "Growth Catalyst", type: "Static Website", tech: "Vite", keywords: ["marketing", "agency", "landing page", "leads"] }
];

const FREE_FEATURES = [
    { title: "Free Consultation", desc: "A 30-minute strategic session to discuss your digital goals." },
    { title: "Web Health Audit", desc: "A basic scan of your current website for speed and SEO issues." },
    { title: "Project Roadmap", desc: "A high-level execution plan created specifically for your business idea." },
];

const getRelevantContext = async (userQuery: string) => {
    const lowerQuery = userQuery.toLowerCase();

    // Stage 1: Retrieval
    const matches = ALL_PROJECTS.filter(p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.keywords.some(k => lowerQuery.includes(k)) ||
        p.type.toLowerCase().includes(lowerQuery)
    );

    let context = "";

    // Check for "free" or "trial" keywords
    if (lowerQuery.includes("free") || lowerQuery.includes("trial") || lowerQuery.includes("cost")) {
        context += "\n[FREE TIER FEATURES AVAILABLE]\n" + FREE_FEATURES.map(f => `- ${f.title}: ${f.desc}`).join('\n');
    }

    if (matches.length > 0) {
        context += "\n[RETRIEVED PORTFOLIO CONTEXT]\n" + matches.map(m => `- ${m.title} (${m.type}): Tech: ${m.tech}`).join('\n');
    }

    const dynamicKnowledge = await getDynamicKnowledge();
    if (dynamicKnowledge) {
        context += `\n[RETRIEVED TRAINED KNOWLEDGE]\n${dynamicKnowledge}`;
    }

    return context;
};

const getRecentQuotations = async () => {
    try {
        const q = query(collection(db, 'quotations'), orderBy('timestamp', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return `Client: ${data.clientName}, Project: ${data.projectType}`;
        }).join('\n');
    } catch (error) {
        console.error("Error fetching recent quotes:", error);
    }
    return "";
};

const STATIC_KNOWLEDGE = `
- Agency Name: Averqon Agency
- Tagline: We Build, You Grow.
- Services: Web Development, UI/UX & Branding, Digital Marketing.
- Core Offer: We have a "Free Tier" for new clients (Consultation, Audit, Roadmap).
- Team Leader: Muneeswaran
`;

export const getAIResponse = async (userMessage: string, chatHistory: { role: 'user' | 'model', parts: string }[]) => {
    // RAG: Retrieval Step
    const searchContext = await getRelevantContext(userMessage);
    const recentQuotes = await getRecentQuotations();

    const SYSTEM_PROMPT = `
You are "Ella", the official AI guide for Averqon Agency.
You use RAG to stay accurate about Averqon's business.

RETRIEVED DATA (MANDATORY TO USE):
${searchContext || "No specific matches. Focus on general services and Free Consultation."}

BUSINESS DATA & HISTORY:
${recentQuotes || "No recent public quotes."}

STATIC BRANDING INFO:
${STATIC_KNOWLEDGE}

GUIDELINES:
1. Promote the "Free Tier" (Consultation, Audit, etc.) when users ask about price or starting out.
2. Be professional, premium, and concise.
3. If they want to start, ask for their Email and project type.
`;

    if (!genAI) {
        return "Ella is currently in 'Offline Mode'. Please ensure the API key is set in .env.local.";
    }

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let lastError = "";

    for (const modelName of modelsToTry) {
        try {
            console.log(`Ella: Attempting connection with ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            // Minimal prompt for testing
            const prompt = `Context: ${searchContext}\n\nVisitor says: ${userMessage}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            console.log(`Ella: Success with ${modelName}!`);
            return response.text();
        } catch (error: any) {
            console.warn(`Ella: ${modelName} failed.`, error.message);
            lastError = error.message;
            if (!error.message?.includes("404")) {
                // If it's a 403 or other error, don't bother trying other models
                break;
            }
        }
    }

    return `Ella is having trouble connecting to her brain. (Last Error: ${lastError}). This usually means the API key is restricted or the models are not enabled in your region yet.`;
};

export const saveChatLead = async (leadData: { name: string; email: string; service: string; message: string }) => {
    try {
        await addDoc(collection(db, 'chat_leads'), {
            ...leadData,
            timestamp: serverTimestamp(),
            source: 'Averqon AI Chat'
        });
        return true;
    } catch (error) {
        console.error("Error saving lead:", error);
        return false;
    }
};

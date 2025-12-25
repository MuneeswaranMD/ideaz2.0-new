
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

const getRecentQuotations = async () => {
    try {
        const q = query(collection(db, 'quotations'), orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return `Client: ${data.clientName}, Project: ${data.projectType}, Status: ${data.status}`;
        }).join('\n');
    } catch (error) {
        console.error("Error fetching recent quotes:", error);
    }
    return "";
};

const STATIC_KNOWLEDGE = `
- Agency Name: Averqon Agency
- Tagline: We Build, You Grow.
- Location: Coimbatore, India (Digital Solutions Hub)
- Contact: Phone (+91 99887 76655), Email (solutions@averqon.com)
- Services: Web Development (React/Next.js/WordPress), UI/UX & Branding, Digital Marketing.
- History: Founded 2020, Relaunched as 2.0 in 2024.
- Core Team Leader: Muneeswaran
`;

export const getAIResponse = async (userMessage: string, chatHistory: { role: 'user' | 'model', parts: string }[]) => {
    const dynamicKnowledge = await getDynamicKnowledge();
    const recentQuotes = await getRecentQuotations();

    const SYSTEM_PROMPT = `
You are "Averqon AI", the official virtual assistant for Averqon Agency.
Your goal is to help visitors understand our services and manage business data.

KNOWLEDGE BASE (CORE):
${STATIC_KNOWLEDGE}

DYNAMIC KNOWLEDGE (FROM CRM TRAINING):
${dynamicKnowledge || "No specific dynamic context provided."}

RECENT BUSINESS ACTIVITY (QUOTATIONS):
${recentQuotes || "No recent public quotations recorded."}

GUIDELINES:
- Be professional, premium, and helpful.
- For quotations: helping users estimate costs. (Web from ₹8,500, E-comm from ₹25,000+).
- You are aware of recent client projects listed above.
- Collect lead info (Name, Email) if the interest is high.
`;

    if (!genAI) {
        return "I'm currently in 'Offline Mode'. Please provide a Gemini API key to enable full AI capabilities. How else can I help you today?";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Understood. I am Averqon AI, ready to assist." }] },
                ...chatHistory.map(h => ({ role: h.role, parts: [{ text: h.parts }] }))
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        return "I encountered a slight technical glitch. Feel free to try again or contact us directly!";
    }
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

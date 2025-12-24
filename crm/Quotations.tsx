
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import {
    Wand2,
    User,
    Briefcase,
    IndianRupee,
    CheckCircle,
    FileText,
    Download,
    Trash2,
    Copy,
    Sparkles,
    Zap,
    Send,
    Eye,
    ChevronRight,
    Loader2,
    Printer
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Quotations: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [quotations, setQuotations] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        clientName: '',
        projectType: '',
        description: '',
        requirements: '',
        budgetRange: 'Medium'
    });
    const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [viewingQuotation, setViewingQuotation] = useState<any>(null);

    useEffect(() => {
        const q = query(collection(db, 'quotations'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().timestamp?.toDate().toLocaleDateString() || 'Just now'
            }));
            setQuotations(items);
        });
        return () => unsubscribe();
    }, []);

    const simulateAIGeneration = async () => {
        setGenerating(true);
        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 3000));

        const date = new Date().toLocaleDateString();
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);
        const validDate = validUntil.toLocaleDateString();
        const quoteRef = `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const preview = `
QUOTATION
Date: ${date}
Quote Ref: ${quoteRef}
Valid Until: ${validDate}

FROM:
Averqon Agency
Digital Solutions Hub, India
Phone: +91 99887 76655
Email: solutions@averqon.com
Website: www.averqon.com

TO:
${formData.clientName}
Project Stakeholder
${formData.clientName} Business Entity

PROJECT: ${formData.projectType}

# SERVICE DESCRIPTION | TYPE | AMOUNT (INR)
01 ${formData.projectType} Implementation • Full strategy & setup based on: ${formData.description.substring(0, 60)}... | One-Time | ₹ 8,500.00
02 Monthly Optimization • Ongoing management and ${formData.requirements.substring(0, 40)}... | Monthly | ₹ 3,500.00
03 Optional: Annual Maintenance Package • Complete 12-month support at discounted rate | Optional | ₹ 35,000.00

TOTAL ESTIMATE
Subtotal: ₹ 12,000.00
Discount (Introductory): ₹ 1,500.00
Total Amount: ₹ 10,500.00
(Note: The total above includes One-Time Setup + 1st Month Maintenance. GST is extra.)

TERMS & CONDITIONS
Payment Terms: 50% advance to start work, 50% upon completion.
Timeline: Initial delivery takes 7–10 working days.
Client Inputs: Client must provide accurate details and feedback within 48 hours.

ACCEPTANCE
By signing below, you agree to the pricing and scope of work outlined above.

_____________________________      _____________________________
Authorized Signature               Client Signature
(Averqon Agency)                   Date: _______________________
        `.trim();

        setGeneratedPreview(preview);
        setGenerating(false);
    };

    const handleSave = async () => {
        if (!generatedPreview) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'quotations'), {
                ...formData,
                content: generatedPreview,
                timestamp: serverTimestamp(),
                status: 'Draft'
            });
            setSuccess(true);
            setGeneratedPreview(null);
            setFormData({
                clientName: '',
                projectType: '',
                description: '',
                requirements: '',
                budgetRange: 'Medium'
            });
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving quotation:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteQuotation = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'quotations', id));
        } catch (error) {
            console.error("Error deleting quotation:", error);
        }
    };

    const handleDownloadPDF = (data: any, content: string) => {
        const doc = new jsPDF() as any;

        // Colors & Config
        const accentColor = [79, 70, 229]; // Indigo
        const darkColor = [17, 24, 39]; // Gray-900
        const lightGray = [243, 244, 246]; // Gray-100

        // Design Sidebar
        doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.rect(0, 0, 15, 297, 'F');

        // Header
        doc.setFontSize(32);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('QUOTATION', 25, 30);

        // Metadata Extraction (Simple regex to find values in text)
        const getMeta = (key: string) => {
            const match = content.match(new RegExp(`${key}:\\s*(.*)`, 'i'));
            return match ? match[1].trim() : '';
        };

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text('REFERENCE', 190, 20, { align: 'right' });
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(getMeta('Quote Ref') || `QT-${Date.now()}`, 190, 25, { align: 'right' });

        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text('VALID UNTIL', 190, 35, { align: 'right' });
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(getMeta('Valid Until') || 'N/A', 190, 40, { align: 'right' });

        // Address Section
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.rect(25, 50, 80, 45, 'F');
        doc.rect(110, 50, 80, 45, 'F');

        doc.setFontSize(8);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text('FROM / SENDER', 30, 58);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('Averqon Agency', 30, 68);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(['Digital Solutions Hub', 'Phone: +91 99887 76655', 'Email: solutions@averqon.com'], 30, 75);

        doc.setFontSize(8);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text('TO / CLIENT', 115, 58);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(data.clientName || 'Valued Client', 115, 68);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(['Project Stakeholder', 'Client Location', 'Billing Entity'], 115, 75);

        // Project Title
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('PROJECT:', 25, 110);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(data.projectType.toUpperCase(), 45, 110);

        // Service Table (Detect and parse)
        const tableLines = content.split('\n').filter(l => l.match(/^\d{2}/));
        if (tableLines.length > 0) {
            const body = tableLines.map(line => {
                const parts = line.split('|');
                return [
                    parts[0]?.substring(0, 2).trim(), // #
                    parts[0]?.substring(3).trim(),    // Service Description
                    parts[1]?.trim() || '',           // Type
                    parts[2]?.trim() || ''            // Amount
                ];
            });

            (doc as any).autoTable({
                startY: 120,
                head: [['#', 'SERVICE DESCRIPTION', 'TYPE', 'AMOUNT (INR)']],
                body: body,
                theme: 'grid',
                headStyles: { fillColor: darkColor, textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 9, cellPadding: 5 },
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 100 },
                    2: { halign: 'center' },
                    3: { halign: 'right', fontStyle: 'bold' }
                },
                margin: { left: 25 }
            });
        }

        let finalY = (doc as any).lastAutoTable?.finalY || 150;

        // Total Estimate Section
        doc.setFontSize(10);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL ESTIMATE', 25, finalY + 15);

        doc.setFontSize(9);
        doc.setTextColor(80);
        doc.setFont('helvetica', 'normal');
        doc.text(`Subtotal: ${getMeta('Subtotal') || '₹0.00'}`, 190, finalY + 15, { align: 'right' });
        doc.text(`Discount: ${getMeta('Discount') || '₹0.00'}`, 190, finalY + 22, { align: 'right' });

        doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.rect(130, finalY + 28, 60, 12, 'F');
        doc.setTextColor(255);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL', 135, finalY + 36);
        doc.text(getMeta('Total Amount') || '₹0.00', 185, finalY + 36, { align: 'right' });

        // Terms & Conditions
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text('TERMS & CONDITIONS', 25, finalY + 55);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.setFontSize(8);
        const terms = content.split('TERMS & CONDITIONS')[1]?.split('ACCEPTANCE')[0]?.trim() || '';
        const splitTerms = doc.splitTextToSize(terms, 160);
        doc.text(splitTerms, 25, finalY + 62);

        // Acceptances / Signatures
        const sigY = finalY + 95;
        doc.setDrawColor(200);
        doc.line(25, sigY, 90, sigY);
        doc.line(125, sigY, 190, sigY);

        doc.setFontSize(9);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('AUTHORIZED SIGNATURE', 25, sigY + 5);
        doc.text('CLIENT SIGNATURE', 125, sigY + 5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150);
        doc.text('(Averqon Agency)', 25, sigY + 10);
        doc.text('Date: ____________________', 125, sigY + 10);

        // Footer
        doc.setFontSize(7);
        doc.setTextColor(180);
        doc.text('This is a computer-generated quotation.', 105, 290, { align: 'center' });

        doc.save(`Quotation_${data.clientName.replace(/\s+/g, '_')}_Averqon.pdf`);
    };

    return (
        <div className="p-8 bg-black min-h-screen text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-600/20 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-widest flex items-center gap-1">
                                <Sparkles size={10} /> AI Powered
                            </span>
                        </div>
                        <h1 className="text-5xl font-black mb-2 tracking-tighter">AI <span className="text-indigo-500">Quotations</span></h1>
                        <p className="text-gray-500 max-w-xl">Generate professional business quotations in seconds using our advanced AI-driven estimation engine.</p>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-zinc-950/50 backdrop-blur-xl">
                            <h2 className="text-xl font-bold flex items-center mb-6">
                                <Zap className="mr-3 text-indigo-500" size={20} /> Project Parameters
                            </h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Client Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            value={formData.clientName}
                                            onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                            placeholder="Who is this for?"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Project Type</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            value={formData.projectType}
                                            onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                            placeholder="e.g. Mobile App, Branding, SEO"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Project Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none transition-all resize-none placeholder:text-gray-700"
                                        placeholder="Describe the project goal..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Key Requirements</label>
                                    <textarea
                                        value={formData.requirements}
                                        onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none transition-all resize-none placeholder:text-gray-700"
                                        placeholder="List main features or specs..."
                                    />
                                </div>

                                <button
                                    onClick={simulateAIGeneration}
                                    disabled={generating || !formData.clientName}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center group overflow-hidden relative"
                                >
                                    {generating ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>AI IS ANALYZING...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="relative z-10 flex items-center gap-2">
                                                GENERATE SMART QUOTATION <Wand2 size={20} />
                                            </span>
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Recent History */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                <FileText size={14} /> History
                            </h3>
                            <div className="space-y-3">
                                {quotations.slice(0, 4).map((q) => (
                                    <div key={q.id} className="group bg-zinc-950 border border-white/5 rounded-3xl p-4 flex items-center justify-between hover:border-indigo-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                <IndianRupee size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold leading-tight">{q.clientName}</h4>
                                                <p className="text-[10px] text-gray-500 uppercase font-black">{q.projectType} • {q.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setGeneratedPreview(q.content);
                                                    setFormData({
                                                        clientName: q.clientName,
                                                        projectType: q.projectType,
                                                        description: q.description,
                                                        requirements: q.requirements,
                                                        budgetRange: q.budgetRange
                                                    });
                                                }}
                                                className="p-2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => deleteQuotation(q.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-7">
                        {generatedPreview ? (
                            <div className="glass-card rounded-[40px] border border-white/10 bg-zinc-900/30 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                            <CheckCircle size={16} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-emerald-500">AI Draft Generated</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white px-4 py-2 rounded-xl transition-all border border-white/5 hover:bg-white/5 flex items-center gap-2">
                                            <Copy size={14} /> Copy
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(formData, generatedPreview!)}
                                            className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white px-4 py-2 rounded-xl transition-all border border-white/5 hover:bg-white/5 flex items-center gap-2"
                                        >
                                            <Download size={14} /> Export PDF
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-grow p-10 font-mono text-sm overflow-y-auto whitespace-pre-wrap leading-relaxed text-zinc-300">
                                    {generatedPreview}
                                </div>
                                <div className="p-8 bg-zinc-950/80 border-t border-white/5">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className={`w-full ${success ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-black py-5 rounded-3xl shadow-2xl transition-all flex items-center justify-center group gap-3`}
                                    >
                                        {loading ? 'ARCHIVING...' : success ? 'QUOTATION ARCHIVED' : 'SAVE TO DATABASE'}
                                        {success ? <CheckCircle size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[600px] border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center p-12 bg-white/[0.01]">
                                <div className="w-20 h-20 rounded-3xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-6 animate-pulse">
                                    <Sparkles size={40} />
                                </div>
                                <h3 className="text-2xl font-black mb-4">Awaiting Parameters</h3>
                                <p className="text-gray-500 max-w-sm">Fill in the project details on the left and let our AI assemble a professional quotation for you.</p>
                                <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-md">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500/20 w-1/3 animate-shimmer" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quotations;

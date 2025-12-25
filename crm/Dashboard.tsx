
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { BarChart, Users, FileText, Briefcase, Plus, TrendingUp, DollarSign, X, ExternalLink, Mail, User, Eye, CheckCircle, MessageSquare, Trash2, Sparkles, Zap, Loader2, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BaseItem {
    id: string;
    timestamp: Date;
    name: string;
    message: string;
}

interface Enquiry extends BaseItem {
    type: 'enquiry';
    service: string;
    title: string;
    time: string;
}

interface Application extends BaseItem {
    type: 'application';
    position: string;
    email: string;
    title: string;
    time: string;
}

interface Testimonial extends BaseItem {
    type: 'testimonial';
    role: string;
    status: 'pending' | 'approved';
    title: string;
    time: string;
}

type Activity = Enquiry | Application | Testimonial;

const CRMDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        enquiries: 0,
        hiring: 0,
        projects: 0,
        proposals: 0,
        revenue: 0,
        testimonials: 0
    });

    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [hiringApps, setHiringApps] = useState<Application[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
    const [aiKnowledge, setAiKnowledge] = useState('');
    const [savingAI, setSavingAI] = useState(false);
    const [chatLeads, setChatLeads] = useState<any[]>([]);

    useEffect(() => {
        // Enquiries
        const unsubscribeEnquiries = onSnapshot(collection(db, 'enquiries'), (snapshot) => {
            setStats(prev => ({ ...prev, enquiries: snapshot.size }));
            const items = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'Anonymous',
                    message: data.message || '',
                    timestamp: data.timestamp?.toDate() || new Date(),
                    type: 'enquiry',
                    service: data.service || 'General Enquiry',
                    title: `New Enquiry: ${data.name || 'Anonymous'}`,
                    time: data.timestamp?.toDate().toLocaleString() || 'Just now'
                } as Enquiry;
            });
            updateActivity(items);
        });

        // Hiring
        const unsubscribeHiring = onSnapshot(collection(db, 'applications'), (snapshot) => {
            setStats(prev => ({ ...prev, hiring: snapshot.size }));
            const items = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'Anonymous',
                    message: data.message || '',
                    timestamp: data.timestamp?.toDate() || new Date(),
                    type: 'application',
                    position: data.position || 'Unknown',
                    email: data.email || '',
                    title: `New App: ${data.name || 'Anonymous'}`,
                    time: data.timestamp?.toDate().toLocaleString() || 'Just now'
                } as Application;
            });
            setHiringApps(items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
            updateActivity(items);
        });

        // Testimonials
        const unsubscribeTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
            setStats(prev => ({ ...prev, testimonials: snapshot.size }));
            const items = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'Anonymous',
                    message: data.message || '',
                    timestamp: data.timestamp?.toDate() || new Date(),
                    type: 'testimonial',
                    role: data.role || 'Client',
                    status: data.status || 'pending',
                    title: `Testimonial: ${data.name || 'Anonymous'}`,
                    time: data.timestamp?.toDate().toLocaleString() || 'Just now'
                } as Testimonial;
            });
            setTestimonials(items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
            updateActivity(items);
        });

        // Proposals
        const unsubscribeProposals = onSnapshot(collection(db, 'proposals'), (snapshot) => {
            setStats(prev => ({ ...prev, proposals: snapshot.size }));
        });

        // Invoices (for Revenue)
        const unsubscribeInvoices = onSnapshot(collection(db, 'invoices'), (snapshot) => {
            const totalRevenue = snapshot.docs.reduce((acc, doc) => {
                const data = doc.data();
                if (data.status === 'Paid') {
                    const amountStr = data.amount || "0";
                    const numericAmount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10) || 0;
                    return acc + numericAmount;
                }
                return acc;
            }, 0);
            setStats(prev => ({ ...prev, revenue: totalRevenue }));
        });

        // Projects
        const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
            setStats(prev => ({ ...prev, projects: snapshot.size }));
        });

        // AI Knowledge
        const unsubscribeAI = onSnapshot(doc(db, 'settings', 'ai_knowledge'), (doc) => {
            if (doc.exists()) {
                setAiKnowledge(doc.data().content);
            }
        });

        // Chat Leads
        const unsubscribeChatLeads = onSnapshot(query(collection(db, 'chat_leads'), orderBy('timestamp', 'desc')), (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChatLeads(items);
        });

        return () => {
            unsubscribeEnquiries();
            unsubscribeHiring();
            unsubscribeTestimonials();
            unsubscribeProposals();
            unsubscribeInvoices();
            unsubscribeProjects();
            unsubscribeAI();
            unsubscribeChatLeads();
        };
    }, []);

    const updateActivity = (newItems: Activity[]) => {
        setRecentActivity(prev => {
            const combined = [...newItems, ...prev];
            const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
            return unique.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 8);
        });
    };

    const handleApproveTestimonial = async (id: string) => {
        try {
            await updateDoc(doc(db, 'testimonials', id), { status: 'approved' });
            setSelectedTestimonial(prev => prev ? { ...prev, status: 'approved' } : null);
        } catch (error) {
            console.error("Error approving testimonial:", error);
        }
    };

    const handleDeleteTestimonial = async (id: string) => {
        if (!window.confirm('Erase this transmission from history?')) return;
        try {
            await deleteDoc(doc(db, 'testimonials', id));
            setSelectedTestimonial(null);
        } catch (error) {
            console.error("Error deleting testimonial:", error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleViewLog = (activity: Activity) => {
        if (activity.type === 'enquiry') {
            setSelectedEnquiry(activity);
        } else if (activity.type === 'application') {
            setSelectedApp(activity);
        } else if (activity.type === 'testimonial') {
            setSelectedTestimonial(activity);
        }
    };

    const handleSaveAI = async () => {
        setSavingAI(true);
        try {
            await updateDoc(doc(db, 'settings', 'ai_knowledge'), {
                content: aiKnowledge,
                lastUpdated: serverTimestamp()
            });
            alert('AI Knowledge Base Updated Successfully');
        } catch (error) {
            console.error("Error updating AI:", error);
        } finally {
            setSavingAI(false);
        }
    };

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black mb-2 tracking-tighter">Command <span className="text-indigo-500">Center</span></h1>
                        <p className="text-gray-400">Biological intelligence meets digital precision.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/crm/billing" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center transition-all shadow-lg shadow-indigo-500/20">
                            <Plus className="mr-2" size={20} /> New Invoice
                        </Link>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    {[
                        { label: 'Enquiries', value: stats.enquiries, icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Recruitment', value: stats.hiring, icon: <Briefcase />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        { label: 'Proposals', value: stats.proposals, icon: <FileText />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                        { label: 'Testimonials', value: stats.testimonials, icon: <MessageSquare />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { label: 'Revenue', value: formatCurrency(stats.revenue), icon: <DollarSign />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
                    ].map((item, i) => (
                        <div key={i} className="glass-card p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
                            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <h3 className="text-gray-400 font-semibold uppercase text-[10px] tracking-[0.2em] mb-1">{item.label}</h3>
                            <p className="text-2xl font-black">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* AI Training Module */}
                    <div className="lg:col-span-2 glass-card p-8 rounded-[40px] border border-indigo-500/10 bg-indigo-500/[0.02]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold flex items-center tracking-tighter text-indigo-400">
                                <Sparkles className="mr-3" /> AI Intelligence Training
                            </h2>
                            <button
                                onClick={handleSaveAI}
                                disabled={savingAI}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {savingAI ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                                Sync Knowledge
                            </button>
                        </div>
                        <p className="text-xs text-indigo-500/60 font-black uppercase tracking-widest mb-4">Averqon Brain Context</p>
                        <textarea
                            value={aiKnowledge}
                            onChange={(e) => setAiKnowledge(e.target.value)}
                            className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-mono text-gray-400 focus:border-indigo-500/50 focus:outline-none transition-all resize-none"
                            placeholder="Type details to train the AI (e.g., 'Currently our priority is focus on SEO projects in Tamil Nadu...')"
                        />
                        <div className="mt-4 flex gap-4">
                            <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 text-center">Chat Leads</p>
                                <p className="text-xl font-black text-center">{chatLeads.length}</p>
                            </div>
                            <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 text-center">AI Sync Status</p>
                                <p className="text-[10px] font-black text-center text-emerald-500">OPTIMIZED</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Leads list */}
                    <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
                        <h2 className="text-xl font-bold mb-6 flex items-center tracking-tighter">
                            <Bot className="mr-3 text-indigo-500" size={20} /> AI Agent Leads
                        </h2>
                        <div className="space-y-4 overflow-y-auto max-h-[300px] scrollbar-hide">
                            {chatLeads.length === 0 ? (
                                <p className="text-center text-gray-600 py-10 italic text-xs">No leads from AI yet.</p>
                            ) : (
                                chatLeads.map(lead => (
                                    <div key={lead.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-indigo-500/30 transition-all">
                                        <p className="font-bold text-sm">{lead.name || 'AI Prospect'}</p>
                                        <p className="text-[10px] text-gray-500 font-mono mb-2">{lead.email || 'No email left'}</p>
                                        <p className="text-[10px] text-indigo-400 line-clamp-2 italic">"{lead.message}"</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
                            <h2 className="text-2xl font-bold mb-8 flex items-center tracking-tighter">
                                <TrendingUp className="mr-3 text-indigo-500" /> Transmissions Archive
                            </h2>
                            <div className="space-y-4">
                                {recentActivity.length === 0 ? (
                                    <p className="text-gray-500 text-center py-20 font-medium italic">Scanning for recent activities...</p>
                                ) : (
                                    recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.type === 'enquiry' ? 'bg-blue-500/10 text-blue-400' :
                                                    activity.type === 'application' ? 'bg-purple-500/10 text-purple-400' :
                                                        'bg-amber-500/10 text-amber-400'
                                                    }`}>
                                                    {activity.type === 'enquiry' ? <Users size={20} /> :
                                                        activity.type === 'application' ? <Briefcase size={20} /> :
                                                            <MessageSquare size={20} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-200">{activity.title}</p>
                                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">Received</span>
                                                    </div>
                                                    <p className="text-[10px] uppercase font-black text-gray-500">{activity.time}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleViewLog(activity)}
                                                className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-indigo-300 transition-colors px-4 py-2 bg-indigo-500/5 rounded-xl border border-indigo-500/10"
                                            >
                                                View Log
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* recruitment management section */}
                        <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
                            <h2 className="text-2xl font-bold mb-8 flex items-center tracking-tighter">
                                <Briefcase className="mr-3 text-purple-500" /> Recruitment Center
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Candidate</th>
                                            <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Position</th>
                                            <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {hiringApps.slice(0, 5).map((app) => (
                                            <tr key={app.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-6">
                                                    <p className="font-bold">{app.name}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{app.email}</p>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-bold uppercase">{app.position}</span>
                                                </td>
                                                <td className="px-4 py-6 text-right">
                                                    <button onClick={() => setSelectedApp(app)} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white" title="Deep Scan Profile">
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Testimonials Management list */}
                        <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
                            <h2 className="text-xl font-bold mb-6 flex items-center tracking-tighter">
                                <MessageSquare className="mr-3 text-amber-500" size={20} /> Social Proofing
                            </h2>
                            <div className="space-y-4">
                                {testimonials.slice(0, 4).map(t => (
                                    <div key={t.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-amber-500/30 transition-all cursor-pointer" onClick={() => setSelectedTestimonial(t)}>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-sm">{t.name}</p>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                {t.status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 italic line-clamp-1">"{t.message}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-indigo-600/10 to-transparent">
                            <h2 className="text-2xl font-bold mb-6 tracking-tighter">Fast <span className="text-indigo-400">Access</span></h2>
                            <div className="grid grid-cols-1 gap-4">
                                <Link to="/crm/proposals" className="w-full py-5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left font-bold transition-all flex items-center group">
                                    <TrendingUp className="mr-4 text-indigo-400 group-hover:scale-110 transition-transform" size={20} />
                                    <span>Strategic Planner</span>
                                </Link>
                                <Link to="/crm/billing" className="w-full py-5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left font-bold transition-all flex items-center group">
                                    <DollarSign className="mr-4 text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
                                    <span>Financial Vault</span>
                                </Link>
                                <Link to="/crm/blog" className="w-full py-5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left font-bold transition-all flex items-center group">
                                    <FileText className="mr-4 text-blue-400 group-hover:scale-110 transition-transform" size={20} />
                                    <span>Content Protocol</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Applicant Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
                    <div className="bg-zinc-900 w-full max-w-2xl rounded-[40px] border border-white/10 relative shadow-2xl overflow-hidden">
                        <button onClick={() => setSelectedApp(null)} className="absolute right-8 top-8 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>
                        <div className="p-10 relative z-10">
                            <div className="flex items-start gap-6 mb-10">
                                <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-3xl flex items-center justify-center"><User size={40} /></div>
                                <div>
                                    <h2 className="text-4xl font-black tracking-tighter">{selectedApp.name}</h2>
                                    <p className="text-gray-400 font-bold text-lg">{selectedApp.position}</p>
                                </div>
                            </div>
                            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 mb-10">
                                <p className="text-gray-300 leading-relaxed font-medium italic">"{selectedApp.message}"</p>
                            </div>
                            <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20">Authorize Interview</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Testimonial Detail Modal */}
            {selectedTestimonial && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
                    <div className="bg-zinc-900 w-full max-w-2xl rounded-[40px] border border-white/10 relative shadow-2xl overflow-hidden">
                        <button onClick={() => setSelectedTestimonial(null)} className="absolute right-8 top-8 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>
                        <div className="p-10 relative z-10">
                            <div className="flex items-start gap-6 mb-10">
                                <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center"><MessageSquare size={40} /></div>
                                <div>
                                    <h2 className="text-4xl font-black tracking-tighter">{selectedTestimonial.name}</h2>
                                    <p className="text-gray-400 font-bold text-lg">{selectedTestimonial.role}</p>
                                </div>
                            </div>
                            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 mb-10">
                                <p className="text-gray-300 leading-relaxed font-medium italic">"{selectedTestimonial.message}"</p>
                            </div>
                            <div className="flex gap-4">
                                {selectedTestimonial.status !== 'approved' && (
                                    <button
                                        onClick={() => handleApproveTestimonial(selectedTestimonial.id)}
                                        className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={20} /> Approve Transmission
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteTestimonial(selectedTestimonial.id)}
                                    className="px-8 py-5 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-black rounded-2xl transition-all border border-red-500/20 flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={20} /> Erase
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enquiry Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
                    <div className="bg-zinc-900 w-full max-w-2xl rounded-[40px] border border-white/10 relative shadow-2xl overflow-hidden">
                        <button onClick={() => setSelectedEnquiry(null)} className="absolute right-8 top-8 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>
                        <div className="p-10 relative z-10">
                            <div className="flex items-start gap-6 mb-10">
                                <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center"><Mail size={40} /></div>
                                <div>
                                    <h2 className="text-4xl font-black tracking-tighter">{selectedEnquiry.name}</h2>
                                    <p className="text-gray-400 font-bold text-lg">{selectedEnquiry.service}</p>
                                </div>
                            </div>
                            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 mb-10">
                                <p className="text-gray-300 leading-relaxed font-medium italic">"{selectedEnquiry.message}"</p>
                            </div>
                            <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20">Acknowledge Lead</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CRMDashboard;

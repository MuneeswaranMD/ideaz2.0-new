
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { BarChart, Users, FileText, Briefcase, Plus, TrendingUp, DollarSign, X, ExternalLink, Mail, User, Eye, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CRMDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        enquiries: 0,
        hiring: 0,
        projects: 0,
        proposals: 0,
        revenue: 0
    });

    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [hiringApps, setHiringApps] = useState<any[]>([]);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

    useEffect(() => {
        // Enquiries
        const unsubscribeEnquiries = onSnapshot(collection(db, 'enquiries'), (snapshot) => {
            setStats(prev => ({ ...prev, enquiries: snapshot.size }));
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'enquiry',
                title: `New Enquiry: ${doc.data().name}`,
                time: doc.data().timestamp?.toDate().toLocaleString() || 'Just now',
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            updateActivity(items);
        });

        // Hiring
        const unsubscribeHiring = onSnapshot(collection(db, 'applications'), (snapshot) => {
            setStats(prev => ({ ...prev, hiring: snapshot.size }));
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'application',
                title: `New App: ${doc.data().name}`,
                time: doc.data().timestamp?.toDate().toLocaleString() || 'Just now',
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            setHiringApps(items.sort((a, b) => b.timestamp - a.timestamp));
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
                    // Extract numeric value from amount string (e.g., "₹50,000" -> 50000)
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

        return () => {
            unsubscribeEnquiries();
            unsubscribeHiring();
            unsubscribeProposals();
            unsubscribeInvoices();
            unsubscribeProjects();
        };
    }, []);

    const updateActivity = (newItems: any[]) => {
        setRecentActivity(prev => {
            const combined = [...newItems, ...prev];
            // Sort by timestamp and remove duplicates
            const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
            return unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleViewLog = (activity: any) => {
        if (activity.type === 'enquiry') {
            setSelectedEnquiry(activity);
        } else if (activity.type === 'application') {
            setSelectedApp(activity);
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

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Enquiries', value: stats.enquiries, icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Recruitment', value: stats.hiring, icon: <Briefcase />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        { label: 'Proposals', value: stats.proposals, icon: <FileText />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                        { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: <DollarSign />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
                    ].map((item, i) => (
                        <div key={i} className="glass-card p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
                            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <h3 className="text-gray-400 font-semibold uppercase text-[10px] tracking-[0.2em] mb-1">{item.label}</h3>
                            <p className="text-3xl font-black">{item.value}</p>
                        </div>
                    ))}
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
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.type === 'enquiry' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                    {activity.type === 'enquiry' ? <Users size={20} /> : <Briefcase size={20} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-200">{activity.title}</p>
                                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">Email Sent</span>
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
                                            <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Timeline</th>
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
                                                <td className="px-4 py-6 text-sm text-gray-400 font-medium">{app.time.split(',')[0]}</td>
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

                        {/* System Message */}
                        <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Core Update</h3>
                            <p className="text-sm text-gray-400 leading-relaxed italic">"Dynamic revenue synchronization is now active. All paid transmissions are being indexed in real-time."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Applicant Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
                    <div className="bg-zinc-900 w-full max-w-2xl rounded-[40px] border border-white/10 relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-purple-600/20 to-transparent"></div>

                        <button onClick={() => setSelectedApp(null)} className="absolute right-8 top-8 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>

                        <div className="p-10 relative z-10">
                            <div className="flex items-start gap-6 mb-10">
                                <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-3xl flex items-center justify-center">
                                    <User size={40} />
                                </div>
                                <div>
                                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-500/20 mb-3 inline-block">Application Received</span>
                                    <h2 className="text-4xl font-black tracking-tighter">{selectedApp.name}</h2>
                                    <p className="text-gray-400 font-bold text-lg">{selectedApp.position}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Mail size={18} className="text-purple-400" />
                                        <span className="font-medium">{selectedApp.email}</span>
                                    </div>
                                    {selectedApp.portfolio && (
                                        <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-400 hover:text-indigo-300 transition-colors">
                                            <ExternalLink size={18} />
                                            <span className="font-bold border-b border-indigo-400/30">View Portfolio Artifact</span>
                                        </a>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Received On</p>
                                    <p className="text-gray-200 font-bold">{selectedApp.time}</p>
                                </div>
                            </div>

                            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 mb-10">
                                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Intrinsic Motivation</p>
                                <p className="text-gray-300 leading-relaxed font-medium italic">"{selectedApp.message}"</p>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center">
                                    Authorize Interview
                                </button>
                                <button className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10">
                                    Hold
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enquiry Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
                    <div className="bg-zinc-900 w-full max-w-2xl rounded-[40px] border border-white/10 relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>

                        <button onClick={() => setSelectedEnquiry(null)} className="absolute right-8 top-8 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>

                        <div className="p-10 relative z-10">
                            <div className="flex items-start gap-6 mb-10">
                                <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center">
                                    <Mail size={40} />
                                </div>
                                <div>
                                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 mb-3 inline-block">Transmission Received</span>
                                    <h2 className="text-4xl font-black tracking-tighter">{selectedEnquiry.name}</h2>
                                    <p className="text-gray-400 font-bold text-lg">{selectedEnquiry.service}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Mail size={18} className="text-indigo-400" />
                                        <span className="font-medium">{selectedEnquiry.email}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Authenticated At</p>
                                    <p className="text-gray-200 font-bold">{selectedEnquiry.time}</p>
                                </div>
                            </div>

                            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 mb-10">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Payload Briefing</p>
                                <p className="text-gray-300 leading-relaxed font-medium italic">"{selectedEnquiry.message}"</p>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center">
                                    Acknowledge Lead
                                </button>
                                <button className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10">
                                    Archive
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CRMDashboard;

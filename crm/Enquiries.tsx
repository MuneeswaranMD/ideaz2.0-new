import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Search, Trash2, Eye, CheckCircle, X, Filter, Calendar, Phone } from 'lucide-react';

interface Enquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    timestamp: any;
    status?: 'new' | 'read' | 'contacted' | 'resolved';
    notes?: string;
}

const Enquiries: React.FC = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        const q = query(collection(db, 'enquiries'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Enquiry));
            setEnquiries(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
            try {
                await deleteDoc(doc(db, 'enquiries', id));
            } catch (error) {
                console.error("Error deleting enquiry:", error);
            }
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'enquiries', id), {
                status: newStatus
            });
            if (selectedEnquiry && selectedEnquiry.id === id) {
                setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus as any } : null);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredEnquiries = enquiries.filter(enq => {
        const matchesSearch =
            enq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.service?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || (enq.status || 'new') === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Unknown';
        // Handle Firestore Timestamp or JS Date
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'contacted': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'resolved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'read': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
            default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'; // new
        }
    };

    return (
        <div className="p-8 min-h-screen text-white">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter">Enquiry <span className="text-indigo-500">Center</span></h1>
                    <p className="text-gray-400">Manage incoming transmissions and leads per form enquiry.</p>
                </div>
            </header>

            {/* Controls */}
            <div className="glass-card p-6 rounded-[32px] border border-white/5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['all', 'new', 'read', 'contacted', 'resolved'].map(stat => (
                        <button
                            key={stat}
                            onClick={() => setFilterStatus(stat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all border ${filterStatus === stat
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {stat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="glass-card rounded-[40px] border border-white/5 bg-white/[0.02] overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center text-gray-500 animate-pulse">Scanning database...</div>
                ) : filteredEnquiries.length === 0 ? (
                    <div className="p-20 text-center text-gray-500 italic">No enquiries found matching your criteria.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02]">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Client Identity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Contact Info</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Service</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredEnquiries.map((enq) => (
                                    <tr
                                        key={enq.id}
                                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        onClick={() => setSelectedEnquiry(enq)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                                                    {enq.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{enq.name}</p>
                                                    <p className="text-xs text-indigo-500/60 font-mono">ID: {enq.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm text-gray-300 font-mono">{enq.email}</p>
                                            <p className="text-xs text-gray-500 font-mono">{enq.phone}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-medium text-gray-300">{enq.service || 'General'}</span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-500 font-mono">
                                            {formatDate(enq.timestamp)}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getStatusColor(enq.status)}`}>
                                                {enq.status || 'New'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedEnquiry(enq); }}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(enq.id, e)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                    <div
                        className="bg-zinc-950 w-full max-w-2xl rounded-[40px] border border-white/10 relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedEnquiry(null)}
                            className="absolute right-8 top-8 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-10 relative z-10 overflow-y-auto max-h-[90vh]">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center">
                                    <Mail size={40} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter mb-2">{selectedEnquiry.name}</h2>
                                    <p className="text-gray-400 font-bold text-lg">{selectedEnquiry.service}</p>
                                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                        <Calendar size={14} /> {formatDate(selectedEnquiry.timestamp)}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 mb-8">
                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-4">Message Content</p>
                                <p className="text-gray-300 leading-relaxed font-medium italic whitespace-pre-wrap">"{selectedEnquiry.message}"</p>
                            </div>

                            <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 mb-8">
                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-4">Contact Info</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                                            <Mail size={16} />
                                        </div>
                                        <span className="font-mono">{selectedEnquiry.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                                            <Phone size={16} />
                                        </div>
                                        <span className="font-mono">{selectedEnquiry.phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <a
                                    href={`mailto:${selectedEnquiry.email}`}
                                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                                    onClick={() => handleStatusUpdate(selectedEnquiry.id, 'contacted')}
                                >
                                    <Mail size={20} /> Reply via Email
                                </a>

                                <div className="flex gap-2">
                                    {(['new', 'read', 'contacted', 'resolved'] as const).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusUpdate(selectedEnquiry.id, s)}
                                            className={`px-4 py-4 rounded-2xl font-bold uppercase text-xs border ${(selectedEnquiry.status || 'new') === s
                                                ? 'bg-white text-black border-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Enquiries;

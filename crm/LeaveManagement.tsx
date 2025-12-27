import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, orderBy, addDoc, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Plus, Filter, AlertCircle } from 'lucide-react';

interface LeaveRequest {
    id: string;
    userId: string;
    userName?: string;
    startDate: string;
    endDate: string;
    type: 'vacation' | 'sick' | 'personal' | 'other';
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
}

const LeaveManagement: React.FC = () => {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Error state
    const [isAdmin, setIsAdmin] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        type: 'vacation',
        reason: ''
    });

    useEffect(() => {
        if (!auth.currentUser) return;

        const checkRole = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
                if (userDoc.exists() && userDoc.data().role === 'admin') {
                    setIsAdmin(true);
                }
            } catch (e) { console.error("Role check failed", e); }
        };
        checkRole();

        // Initial load: User's own requests
        // Requires Index: [userId ASC, createdAt DESC]
        const q = query(
            collection(db, 'leave_requests'),
            where('userId', '==', auth.currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LeaveRequest));
            if (!isAdmin) {
                setRequests(data);
                setLoading(false);
            }
        }, (err) => {
            console.error("Leave requests listener error:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAdmin]);

    // Separate effect for Admin to fetch ALL pending requests
    useEffect(() => {
        if (!isAdmin) return;

        const qAdmin = query(
            collection(db, 'leave_requests'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribeAdmin = onSnapshot(qAdmin, async (snapshot) => {
            try {
                const data = await Promise.all(snapshot.docs.map(async (d) => {
                    const req = d.data();
                    let userName = 'Unknown';
                    try {
                        const uDoc = await getDoc(doc(db, 'users', req.userId));
                        if (uDoc.exists()) userName = uDoc.data().displayName || uDoc.data().email;
                    } catch (e) { }
                    return { id: d.id, ...req, userName } as LeaveRequest;
                }));
                setRequests(data);
            } catch (e) { console.error(e); }
            setLoading(false);
        }, (err) => {
            console.error("Admin leave listener error:", err);
            // Admin query usually simpler (just orderBy), might not need index if no where clause, but safety first
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribeAdmin();
    }, [isAdmin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        try {
            await addDoc(collection(db, 'leave_requests'), {
                userId: auth.currentUser.uid,
                ...formData,
                status: 'pending',
                createdAt: new Date()
            });
            setShowForm(false);
            setFormData({ startDate: '', endDate: '', type: 'vacation', reason: '' });
            alert("Leave request submitted successfully!");
        } catch (e) {
            console.error("Error submitting leave:", e);
            alert("Failed to submit request.");
        }
    };

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        if (!isAdmin) return;
        try {
            await updateDoc(doc(db, 'leave_requests', id), { status });
        } catch (e) {
            alert("Action failed");
        }
    };

    if (loading) return <div className="text-white">Loading leave data...</div>;

    if (error) return (
        <div className="p-10 space-y-6 text-center animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500 mb-4">
                <AlertCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-white">System Configuration Required</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
                Unable to load leave requests due to a database configuration issue.
            </p>

            {error.includes('index') && (
                <div className="max-w-xl mx-auto bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl text-left">
                    <p className="text-yellow-400 font-bold mb-2">Action Required:</p>
                    <p className="text-gray-400 text-sm mb-4">
                        Please check your <strong>browser console (F12)</strong>. Firebase has provided a direct link to create the required "Composite Index" for Leave Requests.
                        <br /><br />
                        Click that link, wait for the index to build (2-3 mins), and then refresh this page.
                    </p>
                </div>
            )}

            <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
            >
                Retry Connection
            </button>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Leave Management</h2>
                    <p className="text-gray-400">Request and track your time off.</p>
                </div>
                {!isAdmin && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                    >
                        <Plus size={18} /> New Request
                    </button>
                )}
            </div>

            {showForm && (
                <div className="glass-card p-6 rounded-2xl border border-white/10 animate-fade-in">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Start Date</label>
                            <input
                                type="date" required
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">End Date</label>
                            <input
                                type="date" required
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white mt-1 [&>option]:text-black"
                            >
                                <option value="vacation">Vacation</option>
                                <option value="sick">Sick Leave</option>
                                <option value="personal">Personal</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Reason</label>
                            <input
                                type="text"
                                value={formData.reason}
                                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white mt-1"
                                placeholder="Brief reason..."
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold">Submit Request</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${req.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                                    req.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                {req.type === 'vacation' ? <CalendarIcon size={18} /> : <Clock size={18} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">
                                    {isAdmin ? (req.userName || 'Unknown User') : req.type.toUpperCase()}
                                    <span className="ml-2 text-xs font-normal text-gray-500">
                                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                                    </span>
                                </h4>
                                <p className="text-xs text-gray-400">{req.reason}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${req.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                    req.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                {req.status}
                            </span>

                            {isAdmin && req.status === 'pending' && (
                                <div className="flex gap-2 ml-2">
                                    <button onClick={() => handleAction(req.id, 'approved')} className="p-1 hover:bg-green-500/20 text-green-500 rounded"><CheckCircle size={18} /></button>
                                    <button onClick={() => handleAction(req.id, 'rejected')} className="p-1 hover:bg-red-500/20 text-red-500 rounded"><XCircle size={18} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="text-center p-8 text-gray-500">No leave requests found.</div>
                )}
            </div>
        </div>
    );
};

export default LeaveManagement;

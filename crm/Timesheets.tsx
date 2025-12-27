
import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, addDoc, updateDoc, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { Clock, Play, Square, Timer, History, CheckCircle, XCircle, AlertCircle, CalendarDays, Briefcase } from 'lucide-react';
import LeaveManagement from './LeaveManagement';

interface TimeEntry {
    id: string;
    userId: string;
    userName?: string; // Optional, for display
    startTime: any;
    endTime: any | null;
    date: string;
    status: 'active' | 'pending_approval' | 'approved' | 'rejected';
}

const Timesheets: React.FC = () => {
    const [currentSession, setCurrentSession] = useState<TimeEntry | null>(null);
    const [recentSessions, setRecentSessions] = useState<TimeEntry[]>([]);
    const [adminQueue, setAdminQueue] = useState<TimeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // View Modes: 'clock' (Default), 'calendar', 'leave'
    const [viewMode, setViewMode] = useState<'clock' | 'calendar' | 'leave'>('clock');
    // Sub-tabs for Clock View (Admin only)
    const [clockTab, setClockTab] = useState<'my_timesheets' | 'admin_approvals'>('my_timesheets');

    useEffect(() => {
        if (!auth.currentUser) return;

        // Check Admin Status
        const checkRole = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
                if (userDoc.exists() && userDoc.data().role === 'admin') {
                    setIsAdmin(true);
                }
            } catch (e) {
                console.error("Role check error:", e);
            }
        };
        checkRole();

        // 1. Listen for MY Active Session
        const qCurrent = query(
            collection(db, 'timesheets'),
            where('userId', '==', auth.currentUser.uid),
            where('status', '==', 'active'),
            limit(1)
        );

        const unsubscribeCurrent = onSnapshot(qCurrent, (snapshot) => {
            if (!snapshot.empty) {
                const docData = snapshot.docs[0].data();
                setCurrentSession({ id: snapshot.docs[0].id, ...docData } as TimeEntry);
            } else {
                setCurrentSession(null);
            }
        }, (err) => console.error("Current session listener error:", err));

        // 2. Listen for MY Recent History (Used for both List and Calendar)
        const qRecent = query(
            collection(db, 'timesheets'),
            where('userId', '==', auth.currentUser.uid),
            where('status', 'in', ['pending_approval', 'approved', 'rejected']),
            orderBy('startTime', 'desc'),
            limit(50) // Increased limit for calendar population
        );

        const unsubscribeRecent = onSnapshot(qRecent, (snapshot) => {
            const sessions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as TimeEntry[];
            setRecentSessions(sessions);
            setLoading(false);
        }, (err) => {
            console.error("Recent history listener error:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => {
            unsubscribeCurrent();
            unsubscribeRecent();
        };
    }, []);

    // Effect for Admin Queue
    useEffect(() => {
        if (!isAdmin || (viewMode === 'clock' && clockTab !== 'admin_approvals')) return;

        const qQueue = query(
            collection(db, 'timesheets'),
            where('status', '==', 'pending_approval'),
            orderBy('startTime', 'desc')
        );

        const unsubscribeQueue = onSnapshot(qQueue, async (snapshot) => {
            try {
                const sessions = await Promise.all(snapshot.docs.map(async (d) => {
                    const data = d.data();
                    let userName = 'Unknown';
                    try {
                        const uDoc = await getDoc(doc(db, 'users', data.userId));
                        if (uDoc.exists()) userName = uDoc.data().displayName || uDoc.data().email;
                    } catch (e) { }
                    return { id: d.id, ...data, userName } as TimeEntry;
                }));
                setAdminQueue(sessions);
            } catch (err) { console.error("Admin queue processing error", err); }
        }, (err) => console.error("Admin queue listener error:", err));

        return () => unsubscribeQueue();
    }, [isAdmin, viewMode, clockTab]);

    const handleClockIn = async () => {
        if (!auth.currentUser) return;
        try {
            await addDoc(collection(db, 'timesheets'), {
                userId: auth.currentUser.uid,
                startTime: new Date(),
                endTime: null,
                date: new Date().toLocaleDateString(),
                status: 'active'
            });
        } catch (error) {
            console.error("Error clocking in:", error);
            alert("Failed to clock in");
        }
    };

    const handleClockOut = async () => {
        if (!currentSession) return;
        try {
            const docRef = doc(db, 'timesheets', currentSession.id);
            await updateDoc(docRef, {
                endTime: new Date(),
                status: 'pending_approval'
            });
        } catch (error) {
            console.error("Error clocking out:", error);
            alert("Failed to clock out");
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await updateDoc(doc(db, 'timesheets', id), { status: 'approved' });
        } catch (e) { alert("Error approving"); }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm("Reject this timesheet?")) return;
        try {
            await updateDoc(doc(db, 'timesheets', id), { status: 'rejected' });
        } catch (e) { alert("Error rejecting"); }
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '-';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const calculateDuration = (start: any, end: any) => {
        if (!start || !end) return '-';
        const startDate = start.toDate ? start.toDate() : new Date(start);
        const endDate = end.toDate ? end.toDate() : new Date(end);
        const diff = endDate.getTime() - startDate.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    // --- CALENDAR RENDER LOGIC ---
    const renderCalendar = () => {
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

        const days = [];
        // Add empty cells for padding
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`pad-${i}`} className="h-24 bg-white/5 border border-white/5 rounded-xl opacity-50"></div>);
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(today.getFullYear(), today.getMonth(), day);

            const daySessions = recentSessions.filter(s => {
                const sDate = s.startTime.toDate ? s.startTime.toDate() : new Date(s.startTime);
                return sDate.getDate() === day && sDate.getMonth() === today.getMonth();
            });

            const hasWork = daySessions.length > 0;
            const isToday = day === today.getDate();

            days.push(
                <div key={day} className={`h-24 p-2 rounded-xl border flex flex-col justify-between transition-colors ${isToday ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}>
                    <span className={`text-sm font-bold ${isToday ? 'text-indigo-400' : 'text-gray-400'}`}>{day}</span>
                    <div className="flex flex-wrap gap-1">
                        {daySessions.map((s, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full ${s.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}`} title={formatTime(s.startTime)}></div>
                        ))}
                    </div>
                    {hasWork && <span className="text-[10px] text-gray-500 font-mono">{calculateDuration(daySessions[0].startTime, daySessions[0].endTime)}</span>}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center text-gray-500 font-bold uppercase text-xs py-2">{d}</div>)}
                {days}
            </div>
        );
    };


    if (loading) return <div className="text-white p-10">Loading timesheets...</div>;

    if (error) return (
        <div className="p-10 space-y-6 text-center">
            <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500 mb-4">
                <AlertCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-white">System Configuration Required</h2>
            <p className="text-gray-400 max-w-lg mx-auto">{error}</p>
            {error.includes('index') && (
                <div className="max-w-xl mx-auto bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl text-left">
                    <p className="text-yellow-400 font-bold mb-2">Action Required:</p>
                    <p className="text-gray-400 text-sm mb-4">Click the link in your browser console (F12) to create the index.</p>
                </div>
            )}
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Retry</button>
        </div>
    );

    return (
        <div className="p-10 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Time & Attendance</h1>
                    <p className="text-gray-400">Track hours, view calendar, and manage leave.</p>
                </div>

                {/* Main View Switcher */}
                <div className="flex bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('clock')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${viewMode === 'clock' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Clock size={16} /> Time Clock
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <CalendarDays size={16} /> Calendar
                    </button>
                    <button
                        onClick={() => setViewMode('leave')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${viewMode === 'leave' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Briefcase size={16} /> Leave
                    </button>
                </div>
            </header>

            {/* VIEW: LEAVE MANAGEMENT */}
            {viewMode === 'leave' && <LeaveManagement />}

            {/* VIEW: CALENDAR */}
            {viewMode === 'calendar' && (
                <div className="glass-card p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <CalendarDays className="text-indigo-500" />
                            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                    </div>
                    {renderCalendar()}
                </div>
            )}

            {/* VIEW: TIME CLOCK (Standard) */}
            {viewMode === 'clock' && (
                <>
                    {/* Admin Sub-tabs */}
                    {isAdmin && (
                        <div className="flex justify-end mb-4">
                            <div className="flex bg-white/5 rounded-xl p-1">
                                <button
                                    onClick={() => setClockTab('my_timesheets')}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${clockTab === 'my_timesheets' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    My Timesheets
                                </button>
                                <button
                                    onClick={() => setClockTab('admin_approvals')}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${clockTab === 'admin_approvals' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Approvals
                                    {adminQueue.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{adminQueue.length}</span>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* My Timesheets Logic */}
                    {(clockTab === 'my_timesheets' || !isAdmin) && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Active Session Card */}
                            <div className="lg:col-span-1 glass-card p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center justify-center space-y-6 bg-gradient-to-b from-indigo-900/10 to-transparent">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-4 ${currentSession ? 'bg-green-500/10 text-green-500 shadow-green-500/20' : 'bg-white/5 text-gray-500 '}`}>
                                    <Timer size={48} className={currentSession ? 'animate-pulse' : ''} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{currentSession ? 'Active Session' : 'Ready to Work?'}</h2>
                                    <p className="text-gray-400">
                                        {currentSession ? `Started at ${formatTime(currentSession.startTime)}` : 'Clock in to start tracking your hours.'}
                                    </p>
                                </div>
                                <button
                                    onClick={currentSession ? handleClockOut : handleClockIn}
                                    className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${currentSession ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'}`}
                                >
                                    {currentSession ? <><Square fill="currentColor" size={24} /> Stop & Submit</> : <><Play fill="currentColor" size={24} /> Clock In</>}
                                </button>
                            </div>

                            {/* Recent History List */}
                            <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 overflow-hidden">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center"><History size={24} /></div>
                                    <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-gray-400">
                                        <thead className="text-xs font-bold uppercase tracking-widest text-gray-500 bg-white/5">
                                            <tr>
                                                <th className="p-4 rounded-l-xl">Date</th>
                                                <th className="p-4">Time</th>
                                                <th className="p-4">Duration</th>
                                                <th className="p-4 rounded-r-xl">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {recentSessions.map((session) => (
                                                <tr key={session.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 font-medium text-white">{session.date}</td>
                                                    <td className="p-4">{formatTime(session.startTime)} - {formatTime(session.endTime)}</td>
                                                    <td className="p-4 font-bold text-indigo-400">{calculateDuration(session.startTime, session.endTime)}</td>
                                                    <td className="p-4">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${session.status === 'approved' ? 'bg-green-500/20 text-green-400' : session.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                            {session.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {recentSessions.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500 italic">No recent history.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin Approvals List */}
                    {clockTab === 'admin_approvals' && isAdmin && (
                        <div className="glass-card p-8 rounded-3xl border border-white/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-500 flex items-center justify-center"><CheckCircle size={24} /></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Pending Approvals</h2>
                                    <p className="text-gray-400">Review employee timesheets.</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-gray-400">
                                    <thead className="text-xs font-bold uppercase tracking-widest text-gray-500 bg-white/5">
                                        <tr>
                                            <th className="p-4 rounded-l-xl">Employee</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Duration</th>
                                            <th className="p-4">Shift Details</th>
                                            <th className="p-4 rounded-r-xl text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {adminQueue.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-bold text-white flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs">{item.userName?.charAt(0).toUpperCase()}</div>
                                                    {item.userName}
                                                </td>
                                                <td className="p-4">{item.date}</td>
                                                <td className="p-4 font-mono text-indigo-300">{calculateDuration(item.startTime, item.endTime)}</td>
                                                <td className="p-4 text-sm">{formatTime(item.startTime)} - {formatTime(item.endTime)}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleApprove(item.id)} className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"><CheckCircle size={20} /></button>
                                                        <button onClick={() => handleReject(item.id)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><XCircle size={20} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {adminQueue.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-gray-500 italic">No pending approvals.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Timesheets;

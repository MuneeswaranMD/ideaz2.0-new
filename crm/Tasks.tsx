import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc, getDocs } from 'firebase/firestore';
import { CheckCircle, Clock, Plus, Search, Trash2, Users, AlertCircle, Calendar, User, ArrowRight, Filter, FileText, CheckSquare, X, ChevronDown, ChevronRight, XCircle, ShieldCheck, Undo2 } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description: string;
    assignedTo: string; // userId
    assignedBy: string; // userId
    assignedToName: string;
    status: 'todo' | 'in-progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    createdAt: any;
    workSummary?: string;
    adminFeedback?: string;
}

interface UserProfile {
    id: string;
    displayName: string;
    email: string;
    role: 'admin' | 'employee';
    designation?: string;
}

const TaskManagement: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null); // For summary/approval/details
    const [modalMode, setModalMode] = useState<'summary' | 'approval' | 'details'>('summary');

    // Inputs
    const [inputSummary, setInputSummary] = useState('');
    const [inputFeedback, setInputFeedback] = useState('');

    // Layout
    const [expandedRows, setExpandedRows] = useState<string[]>([]); // User IDs

    // Create Task Form
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
        dueDate: '',
    });

    useEffect(() => {
        const init = async () => {
            if (auth.currentUser) {
                // Fetch Profile
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDoc.exists()) {
                    setCurrentUserProfile({ id: userDoc.id, ...userDoc.data() } as UserProfile);
                }

                // Fetch Users
                const usersQ = query(collection(db, 'users'));
                const usersSnap = await getDocs(usersQ);
                const usersList = usersSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
                setUsers(usersList);
                setExpandedRows(usersList.map(u => u.id)); // Expand all by default

                // Fetch Tasks
                let tasksQuery;
                if (userDoc.exists() && userDoc.data().role === 'admin') {
                    tasksQuery = query(collection(db, 'tasks'));
                } else {
                    tasksQuery = query(collection(db, 'tasks'), where('assignedTo', '==', auth.currentUser.uid));
                }

                const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
                    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Task));
                    setTasks(items);
                    setLoading(false);
                });

                return unsubscribe;
            }
        };

        init();
    }, []);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        try {
            const assignedUser = users.find(u => u.id === newTask.assignedTo);
            await addDoc(collection(db, 'tasks'), {
                ...newTask,
                assignedBy: auth.currentUser.uid,
                assignedToName: assignedUser?.displayName || 'Unknown',
                status: 'todo',
                createdAt: serverTimestamp(),
                workSummary: '',
                adminFeedback: ''
            });
            setShowCreateModal(false);
            setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
        // Validation logic
        if (newStatus === 'done' && currentUserProfile?.role !== 'admin') {
            alert("Only Admins can finalize a task.");
            return;
        }

        try {
            await updateDoc(doc(db, 'tasks', task.id), { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const openSummaryModal = (task: Task) => {
        setSelectedTask(task);
        setInputSummary(task.workSummary || '');
        setModalMode('summary');
    };

    const openApprovalModal = (task: Task) => {
        setSelectedTask(task);
        setInputFeedback(task.adminFeedback || '');
        setModalMode('approval');
    };

    const openDetailsModal = (task: Task) => {
        setSelectedTask(task);
        setModalMode('details');
    };

    const submitSummary = async () => {
        if (!selectedTask) return;
        try {
            await updateDoc(doc(db, 'tasks', selectedTask.id), { workSummary: inputSummary });
            setSelectedTask(null);
        } catch (error) {
            console.error("Error saving summary:", error);
        }
    };

    const submitApproval = async (approved: boolean) => {
        if (!selectedTask) return;
        try {
            await updateDoc(doc(db, 'tasks', selectedTask.id), {
                status: approved ? 'done' : 'in-progress',
                adminFeedback: inputFeedback
            });
            setSelectedTask(null);
        } catch (error) {
            console.error("Error submitting approval:", error);
        }
    };

    const toggleRow = (userId: string) => {
        setExpandedRows(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const deleteTask = async (id: string) => {
        if (!window.confirm("Delete task?")) return;
        await deleteDoc(doc(db, 'tasks', id));
    };

    const getPriorityBadge = (p: string) => {
        const colors = {
            high: 'text-red-400 border-red-500/30 bg-red-500/10',
            medium: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
            low: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
        }[p as 'high' | 'medium' | 'low'] || 'text-gray-400 border-gray-500/30 bg-gray-500/10';

        return <span className={`px-2 py-0.5 border rounded text-[10px] font-black uppercase ${colors}`}>{p}</span>;
    };

    if (loading) return <div className="p-10 text-white">Loading Matrix...</div>;

    // Filter users to show: only those with tasks or all if admin
    const relevantUsers = users.filter(u =>
        currentUserProfile?.role === 'admin'
            ? tasks.some(t => t.assignedTo === u.id) || true // Show all for admin to see empty rows too? Let's show all.
            : u.id === auth.currentUser?.uid
    );

    const COLUMNS = [
        { id: 'todo', label: 'Backlog / To Do' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'review', label: 'Verification' },
        { id: 'done', label: 'Approved' }
    ] as const;

    return (
        <div className="p-8 min-h-screen text-white">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tighter">Task <span className="text-indigo-500">Matrix</span></h1>
                    <p className="text-gray-400">Swimlane tracking and verification protocol.</p>
                </div>
                {currentUserProfile?.role === 'admin' && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Plus size={20} /> Assign Task
                    </button>
                )}
            </header>

            {/* Swimlanes Layout */}
            <div className="space-y-8">
                {relevantUsers.map(user => (
                    <div key={user.id} className="glass-card border border-white/5 rounded-[32px] overflow-hidden bg-white/[0.01]">
                        {/* User Header */}
                        <div
                            className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => toggleRow(user.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${expandedRows.includes(user.id) ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                                    {expandedRows.includes(user.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{user.displayName}</h3>
                                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">{user.designation || user.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 text-xs font-mono text-gray-500">
                                <span>{tasks.filter(t => t.assignedTo === user.id && t.status === 'done').length} Completed</span>
                                <span>{tasks.filter(t => t.assignedTo === user.id && t.status !== 'done').length} Active</span>
                            </div>
                        </div>

                        {/* Swimlane Columns */}
                        {expandedRows.includes(user.id) && (
                            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5 bg-black/20">
                                {COLUMNS.map(col => {
                                    const colTasks = tasks.filter(t => t.assignedTo === user.id && t.status === col.id);

                                    return (
                                        <div key={col.id} className="min-h-[200px] p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{col.label}</h4>
                                                <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-gray-400">{colTasks.length}</span>
                                            </div>

                                            <div className="space-y-3">
                                                {colTasks.map(task => (
                                                    <div key={task.id} className="glass-card p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group relative bg-zinc-900/50">
                                                        <div className="flex justify-between items-start mb-2">
                                                            {getPriorityBadge(task.priority)}
                                                            {currentUserProfile?.role === 'admin' && (
                                                                <button onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <h5
                                                            className="font-bold text-sm mb-1 leading-snug cursor-pointer hover:text-indigo-400 transition-colors"
                                                            onClick={() => openDetailsModal(task)}
                                                        >
                                                            {task.title}
                                                        </h5>
                                                        <p className="text-[10px] text-gray-400 line-clamp-2 mb-3">{task.description}</p>

                                                        {/* Status Specific UI */}
                                                        {col.id === 'in-progress' && (
                                                            <button
                                                                onClick={() => openSummaryModal(task)}
                                                                className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-2 mb-2 ${task.workSummary ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-gray-400 border border-white/5'}`}
                                                            >
                                                                <FileText size={10} /> {task.workSummary ? 'Update Summary' : 'Add Summary'}
                                                            </button>
                                                        )}

                                                        {col.id === 'review' && (
                                                            <div className="mb-2">
                                                                <div className="p-2 bg-amber-500/5 rounded-lg border border-amber-500/10 mb-2">
                                                                    <p className="text-[8px] font-bold text-amber-500 uppercase mb-1">Pending Verification</p>
                                                                    <p className="text-[10px] text-gray-300   line-clamp-2">"{task.workSummary || 'No summary provided'}"</p>
                                                                </div>
                                                                {currentUserProfile?.role === 'admin' ? (
                                                                    <button
                                                                        onClick={() => openApprovalModal(task)}
                                                                        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                                                                    >
                                                                        <ShieldCheck size={12} /> Verify & Approve
                                                                    </button>
                                                                ) : (
                                                                    <div className="text-[10px] text-center text-gray-500 font-mono py-1">Waiting for Admin...</div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {col.id === 'done' && task.adminFeedback && (
                                                            <div className="p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10 mb-2">
                                                                <p className="text-[8px] font-bold text-emerald-500 uppercase mb-1">Admin Feedback</p>
                                                                <p className="text-[10px] text-gray-300  ">"{task.adminFeedback}"</p>
                                                            </div>
                                                        )}

                                                        {/* Navigation Controls */}
                                                        {col.id !== 'review' && col.id !== 'done' && (
                                                            <div className="flex justify-end pt-2 border-t border-white/5">
                                                                <button
                                                                    onClick={() => handleStatusChange(task, col.id === 'todo' ? 'in-progress' : 'review')}
                                                                    className="text-[10px] font-bold uppercase text-indigo-400 hover:text-white flex items-center transition-colors"
                                                                >
                                                                    {col.id === 'todo' ? 'Start' : 'Submit for Review'} <ChevronRight size={10} className="ml-1" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {colTasks.length === 0 && (
                                                    <div className="h-full min-h-[100px] rounded-xl border border-dashed border-white/5 flex items-center justify-center">
                                                        <span className="text-[10px] text-gray-600 uppercase font-bold">Empty</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-lg rounded-[40px] border border-white/10 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black">Assign Mission</h2>
                            <button onClick={() => setShowCreateModal(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateTask} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Objective</label>
                                <input
                                    required
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 font-bold"
                                    placeholder="Task Title"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Briefing</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 font-medium resize-none"
                                    placeholder="Task Details"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Assignee</label>
                                    <select
                                        required
                                        value={newTask.assignedTo}
                                        onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="">Select Agent</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.displayName || u.email}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">DEADLINE</label>
                                    <input
                                        type="date"
                                        required
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-white shadow-xl shadow-indigo-500/20 transition-all text-lg">
                                INITIATE TASK
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Interaction Modal (Summary & Approval) */}
            {selectedTask && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                    <div className="glass-card w-full max-w-lg rounded-[40px] border border-white/10 relative shadow-2xl p-8">
                        <button
                            onClick={() => setSelectedTask(null)}
                            className="absolute right-8 top-8 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
                                {modalMode === 'summary' ? 'Employee Report' : 'Admin Verification'}
                            </span>
                            <h2 className="text-2xl font-black leading-tight">{selectedTask.title}</h2>
                        </div>

                        {modalMode === 'summary' && (
                            <div className="space-y-4">
                                <p className="text-gray-400 text-sm">Please provide a detailed synopsis of the work completed for verification.</p>
                                <textarea
                                    rows={5}
                                    value={inputSummary}
                                    onChange={(e) => setInputSummary(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                                    placeholder="I have completed the module..."
                                />
                                <button
                                    onClick={submitSummary}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Update Report
                                </button>
                            </div>
                        )}

                        {modalMode === 'approval' && (
                            <div className="space-y-6">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Employee Report</p>
                                    <p className="text-gray-200  ">"{selectedTask.workSummary || 'No summary provided.'}"</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Admin Feedback / Rejection Reason</label>
                                    <textarea
                                        rows={3}
                                        value={inputFeedback}
                                        onChange={(e) => setInputFeedback(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-indigo-500 resize-none"
                                        placeholder="Excellent work..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => submitApproval(false)}
                                        className="py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-black rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Undo2 size={18} /> Reject & Return
                                    </button>
                                    <button
                                        onClick={() => submitApproval(true)}
                                        className="py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Approve
                                    </button>
                                </div>
                            </div>
                        )}

                        {modalMode === 'details' && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Description</p>
                                        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{selectedTask.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Priority</p>
                                            <div className="flex items-center gap-2">
                                                {getPriorityBadge(selectedTask.priority)}
                                            </div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Due Date</p>
                                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                                                <Calendar size={14} />
                                                {selectedTask.dueDate}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedTask.workSummary && (
                                        <div className="bg-indigo-500/5 p-5 rounded-2xl border border-indigo-500/10">
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Work Summary</p>
                                            <p className="text-gray-200 text-sm   leading-relaxed">"{selectedTask.workSummary}"</p>
                                        </div>
                                    )}

                                    {selectedTask.adminFeedback && (
                                        <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Admin Feedback</p>
                                            <p className="text-gray-200 text-sm   leading-relaxed">"{selectedTask.adminFeedback}"</p>
                                        </div>
                                    )}

                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Assigned To</p>
                                            <p className="text-white font-bold text-sm">{selectedTask.assignedToName}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                            {selectedTask.assignedToName.charAt(0)}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/5"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManagement;

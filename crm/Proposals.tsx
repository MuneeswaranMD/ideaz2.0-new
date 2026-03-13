
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Send, FileText, Download, Wand2, User, Mail, Briefcase, IndianRupee, CheckCircle, Plus, Trash2, CheckSquare, Square, Lightbulb, ListTodo } from 'lucide-react';

const Proposals: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [proposals, setProposals] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [newTask, setNewTask] = useState('');
    const [formData, setFormData] = useState({ clientName: '', projectType: '', budget: '', scope: '' });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Fetch Proposals
        const qProp = query(collection(db, 'proposals'), orderBy('timestamp', 'desc'));
        const unsubscribeProp = onSnapshot(qProp, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().timestamp?.toDate().toLocaleDateString() || 'Just now'
            }));
            setProposals(items);
        });

        // Fetch Planner Tasks
        const qTasks = query(collection(db, 'proposalTasks'), orderBy('timestamp', 'asc'));
        const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTasks(items);
        });

        return () => {
            unsubscribeProp();
            unsubscribeTasks();
        };
    }, []);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        try {
            await addDoc(collection(db, 'proposalTasks'), {
                text: newTask,
                completed: false,
                timestamp: serverTimestamp()
            });
            setNewTask('');
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const toggleTask = async (taskId: string, completed: boolean) => {
        try {
            await updateDoc(doc(db, 'proposalTasks', taskId), { completed: !completed });
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            await deleteDoc(doc(db, 'proposalTasks', taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'proposals'), {
                ...formData,
                filename: `Proposal_${formData.clientName.replace(/\s+/g, '_')}_${Date.now()}`,
                timestamp: serverTimestamp(),
                status: 'Generated'
            });
            setSuccess(true);
            setFormData({ clientName: '', projectType: '', budget: '', scope: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error generating proposal:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black mb-2 tracking-tighter">Proposal <span className="text-indigo-500">Planner</span></h1>
                    <p className="text-gray-400">Brainstorm ideas, organize tasks, and generate high-impact business proposals.</p>
                </header>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column: Planner / Todo List */}
                    <div className="space-y-8">
                        <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
                            <h2 className="text-2xl font-bold flex items-center mb-8">
                                <ListTodo className="mr-3 text-indigo-500" /> Brainstorming & Ideas
                            </h2>

                            <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="Add a step or idea for your next proposal..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none transition-all"
                                />
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 p-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20">
                                    <Plus size={24} />
                                </button>
                            </form>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {tasks.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500   border border-dashed border-white/10 rounded-3xl">
                                        <Lightbulb className="mx-auto mb-3 opacity-20" size={32} />
                                        Capture your first proposal breakthrough...
                                    </div>
                                ) : (
                                    tasks.map((task) => (
                                        <div key={task.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${task.completed ? 'bg-indigo-500/5 border-indigo-500/10 opacity-60' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                                            <div className="flex items-center gap-4 flex-1">
                                                <button onClick={() => toggleTask(task.id, task.completed)} className="text-indigo-500 hover:scale-110 transition-transform">
                                                    {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                                </button>
                                                <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.text}</span>
                                            </div>
                                            <button onClick={() => deleteTask(task.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent History (Moved here to make room for form) */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center px-2">
                                <FileText className="mr-3 text-gray-500" size={20} /> Generated Documents
                            </h2>
                            <div className="space-y-4">
                                {proposals.slice(0, 3).map((prop) => (
                                    <div key={prop.id} className="glass-card p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                <FileText size={22} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm truncate max-w-[150px]">{prop.filename}</h3>
                                                <p className="text-[10px] text-gray-500 uppercase font-black">{prop.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"><Download size={18} /></button>
                                            <button className="p-2 bg-indigo-600/10 hover:bg-indigo-600/20 rounded-lg transition-colors text-indigo-400 hover:text-indigo-300"><Send size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Finalize Proposal Form */}
                    <div className="glass-card p-10 rounded-[40px] border border-white/5 space-y-8 h-fit lg:sticky lg:top-8">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center mb-2">
                                <Wand2 className="mr-3 text-indigo-500" /> Convert to Proposal
                            </h2>
                            <p className="text-sm text-gray-500">Transform your brainstormed ideas into a formal document.</p>
                        </div>

                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Client Entity</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            required
                                            value={formData.clientName}
                                            onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                            placeholder="Client Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Project Category</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            required
                                            value={formData.projectType}
                                            onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                            placeholder="Service Type"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Investment Estimate (₹)</label>
                                <div className="relative group">
                                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        required
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                        placeholder="Budget"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Objective & Scope</label>
                                <textarea
                                    required
                                    value={formData.scope}
                                    onChange={e => setFormData({ ...formData, scope: e.target.value })}
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none transition-all resize-none placeholder:text-gray-700"
                                    placeholder="Synthesize your brainstormed ideas here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full ${success ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center group text-lg`}
                            >
                                {loading ? 'ETCHING DATA...' : success ? 'DOCUMENT READY' : 'AUTHORIZE PROPOSAL'}
                                {success ? <CheckCircle className="ml-3" size={24} /> : !loading && <FileText className="ml-3 group-hover:scale-110 transition-transform" size={24} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Proposals;

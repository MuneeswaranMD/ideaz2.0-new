import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc, getDocs, orderBy } from 'firebase/firestore';
import { Briefcase, Plus, Search, Trash2, Calendar, FileText, X, ChevronRight, CheckCircle, Clock, AlertCircle, Layout, User } from 'lucide-react';

interface Project {
    id: string;
    name: string;
    client: string;
    description: string;
    status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    startDate: string;
    endDate: string;
    team: string[]; // userNames
    progress: number;
    createdAt: any;
}

const ProjectManagement: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Form State
    const [newProject, setNewProject] = useState({
        name: '',
        client: '',
        description: '',
        status: 'active' as Project['status'],
        priority: 'medium' as Project['priority'],
        startDate: '',
        endDate: '',
        progress: 0
    });

    useEffect(() => {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Project));
            setProjects(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'projects'), {
                ...newProject,
                team: [], // Placeholder for team management
                createdAt: serverTimestamp()
            });
            setShowCreateModal(false);
            setNewProject({
                name: '',
                client: '',
                description: '',
                status: 'active',
                priority: 'medium',
                startDate: '',
                endDate: '',
                progress: 0
            });
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Delete this project and all history?")) return;
        try {
            await deleteDoc(doc(db, 'projects', id));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: Project['status']) => {
        try {
            await updateDoc(doc(db, 'projects', id), { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'active': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'on-hold': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'; // planning
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-white font-mono">INJECTING WORKSPACE DATA...</div>;

    return (
        <div className="p-8 min-h-screen text-white">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tighter">Project <span className="text-indigo-500">Logistics</span></h1>
                    <p className="text-gray-400 font-medium">Lifecycle tracking for active operations.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={20} /> Initialize Project
                </button>
            </header>

            {/* Search and Filters */}
            <div className="glass-card p-6 rounded-[32px] border border-white/5 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Scan projects by name or client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
                        <Layout size={18} className="text-indigo-500" />
                        <span className="text-sm font-bold">{projects.length} Total</span>
                    </div>
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <div
                        key={project.id}
                        className="glass-card group rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer bg-white/[0.01] p-6 relative overflow-hidden"
                        onClick={() => setSelectedProject(project)}
                    >
                        {/* Status Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none ${project.status === 'completed' ? 'bg-emerald-500' :
                            project.status === 'active' ? 'bg-blue-500' : 'bg-amber-500'
                            }`}></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                <Briefcase size={24} />
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getStatusColor(project.status)}`}>
                                {project.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-black mb-1 group-hover:text-indigo-400 transition-colors truncate">{project.name}</h3>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User size={14} className="text-indigo-500" /> {project.client}
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-gray-500">Progress</span>
                                <span className="text-indigo-400">{project.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-1000"
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                        UA
                                    </div>
                                ))}
                            </div>
                            <div className="text-[10px] font-mono text-gray-500 flex items-center gap-2">
                                <Calendar size={12} /> {project.endDate}
                            </div>
                        </div>

                        <button
                            onClick={(e) => handleDeleteProject(project.id, e)}
                            className="absolute top-6 right-6 p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="glass-card w-full max-w-xl rounded-[40px] border border-white/10 p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"></div>

                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black tracking-tighter text-white">Project Initialization</h2>
                            <button onClick={() => setShowCreateModal(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleCreateProject} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Operation Name</label>
                                    <input
                                        required
                                        value={newProject.name}
                                        onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 font-bold"
                                        placeholder="Project Alpha"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Client Entity</label>
                                    <input
                                        required
                                        value={newProject.client}
                                        onChange={e => setNewProject({ ...newProject, client: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 font-bold"
                                        placeholder="Global Industries"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Deployment Brief</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={newProject.description}
                                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 font-medium resize-none"
                                    placeholder="Enter project requirements and scope..."
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Timeline Start</label>
                                    <input
                                        type="date"
                                        required
                                        value={newProject.startDate}
                                        onChange={e => setNewProject({ ...newProject, startDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Deployment Goal</label>
                                    <input
                                        type="date"
                                        required
                                        value={newProject.endDate}
                                        onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Priority Tier</label>
                                    <select
                                        value={newProject.priority}
                                        onChange={e => setNewProject({ ...newProject, priority: e.target.value as any })}
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 appearance-none font-bold"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Standard Priority</option>
                                        <option value="high">Critical Mission</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Sync Progress (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={newProject.progress}
                                        onChange={e => setNewProject({ ...newProject, progress: parseInt(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 font-bold"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-white shadow-xl shadow-indigo-500/20 transition-all text-xl mt-4">
                                DEPLOY PROJECT
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail View Placeholder */}
            {selectedProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                    <div className="glass-card w-full max-w-2xl rounded-[40px] border border-white/10 p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setSelectedProject(null)} className="absolute right-8 top-8 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>

                        <div className="mb-10">
                            <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase border mb-4 inline-block ${getStatusColor(selectedProject.status)}`}>
                                {selectedProject.status}
                            </span>
                            <h2 className="text-4xl font-black tracking-tighter mb-2">{selectedProject.name}</h2>
                            <p className="text-indigo-400 font-bold text-lg mb-1 flex items-center gap-2">
                                <User size={18} /> {selectedProject.client}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Phase Timeline</p>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <Calendar size={14} className="text-indigo-500" />
                                    <span>{selectedProject.startDate} — {selectedProject.endDate}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Mission Criticality</p>
                                <div className="flex items-center gap-2 text-sm font-bold uppercase">
                                    <AlertCircle size={14} className={selectedProject.priority === 'high' ? 'text-red-500' : 'text-amber-500'} />
                                    <span>{selectedProject.priority} Level</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5 mb-10">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Briefing Details</p>
                            <p className="text-gray-300 leading-relaxed font-medium  ">"{selectedProject.description}"</p>
                        </div>

                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5 mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Deployment Sync</p>
                                <span className="text-2xl font-black text-indigo-400">{selectedProject.progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 transition-all duration-1000"
                                    style={{ width: `${selectedProject.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => handleUpdateStatus(selectedProject.id, 'completed')}
                                className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} /> Mark Finalized
                            </button>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10"
                            >
                                Close Log
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectManagement;


import React, { useState, useEffect } from 'react';
import { getLiveClasses, createLiveClass, deleteLiveClass, LiveClass } from '../services/lmsService';
import { Calendar, Link as LinkIcon, Trash2, Video, Plus } from 'lucide-react';

const LiveClasses: React.FC = () => {
    const [classes, setClasses] = useState<LiveClass[]>([]);
    const [showModal, setShowModal] = useState(false);

    // Form
    const [formData, setFormData] = useState<Partial<LiveClass>>({
        title: '',
        meetingUrl: '',
        startTime: '',
        status: 'scheduled'
    });

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        const data = await getLiveClasses();
        setClasses(data);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.meetingUrl || !formData.startTime) {
            return alert("All fields are required");
        }
        await createLiveClass(formData as LiveClass);
        setShowModal(false);
        setFormData({ title: '', meetingUrl: '', startTime: '', status: 'scheduled' });
        loadClasses();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this live class session?")) {
            await deleteLiveClass(id);
            loadClasses();
        }
    };

    return (
        <div className="p-10 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Live Classes</h1>
                    <p className="text-gray-400">Schedule and manage live sessions.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2"
                >
                    <Plus size={20} /> Schedule Class
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {classes.map(c => (
                    <div key={c.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6 hover:border-indigo-500/30 transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex flex-col items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                            <span className="text-lg">{new Date(c.startTime).getDate()}</span>
                            <span className="text-xs uppercase">{new Date(c.startTime).toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-white mb-1">{c.title}</h3>
                                <button onClick={() => handleDelete(c.id!)} className="text-gray-600 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                            <p className="text-sm text-gray-400 flex items-center gap-2 mb-4">
                                <Calendar size={14} /> {new Date(c.startTime).toLocaleString()}
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href={c.meetingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"
                                >
                                    <Video size={16} /> Join / Host
                                </a>
                                <div className={`px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-wider border ${c.status === 'live' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-gray-700 text-gray-500'
                                    }`}>
                                    {c.status}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {classes.length === 0 && <div className="col-span-full py-20 text-center text-gray-500">No scheduled classes found.</div>}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-lg p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Schedule Session</h2>
                        <div className="space-y-4">
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                                placeholder="Topic / Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                            <input
                                type="datetime-local"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 [color-scheme:dark]"
                                value={formData.startTime}
                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                            />
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                                placeholder="Meeting URL (e.g. Zoom/Meet)"
                                value={formData.meetingUrl}
                                onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })}
                            />
                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-400 hover:text-white font-bold">Cancel</button>
                                <button onClick={handleSave} className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Schedule</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveClasses;

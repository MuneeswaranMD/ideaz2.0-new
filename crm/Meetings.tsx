
import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where, deleteDoc, doc } from 'firebase/firestore';
import { Video, Calendar, Clock, Plus, Trash2, ExternalLink, Link as LinkIcon, Users } from 'lucide-react';

interface Meeting {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    meetLink: string;
    createdBy: string;
    createdAt: any;
}

const Meetings: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false); // Simple role check if needed, or allow everyone

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        meetLink: ''
    });

    useEffect(() => {
        // Fetch Meetings
        // Showing all meetings for now, ordered by date
        const q = query(
            collection(db, 'meetings'),
            orderBy('date', 'asc'),
            orderBy('time', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Meeting[];

            // Filter out past meetings if desired, or keep them. 
            // Let's keep future meetings only for "Upcoming" view
            const now = new Date();
            const futureMeetings = items.filter(m => {
                const meetingDate = new Date(`${m.date}T${m.time}`);
                return meetingDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000); // Show today's and future
            });

            setMeetings(futureMeetings);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;
        if (!formData.title || !formData.date || !formData.time || !formData.meetLink) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            await addDoc(collection(db, 'meetings'), {
                ...formData,
                createdBy: auth.currentUser.uid,
                createdAt: new Date(),
                participants: []
            });
            setShowModal(false);
            setFormData({ title: '', description: '', date: '', time: '', meetLink: '' });
        } catch (error) {
            console.error("Error creating meeting:", error);
            alert("Failed to schedule meeting.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Cancel this meeting?")) return;
        try {
            await deleteDoc(doc(db, 'meetings', id));
        } catch (error) {
            console.error("Error deleting meeting:", error);
        }
    };

    const generateMeetLink = () => {
        // Just a helper to paste a generic google meet format if empty, 
        // or user could click a button to open google meet to create one.
        window.open('https://meet.google.com/new', '_blank');
    };

    return (
        <div className="p-4 md:p-10 min-h-screen text-white space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                        <Video className="text-indigo-500" size={32} />
                        Meeting <span className="text-indigo-500">Room</span>
                    </h1>
                    <p className="text-gray-400">Schedule and manage your Google Meet sessions.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={20} /> New Meeting
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-500 col-span-3 text-center py-20">Loading schedule...</p>
                ) : meetings.length === 0 ? (
                    <div className="col-span-3 glass-card p-12 rounded-[32px] border border-white/5 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-500">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">No Upcoming Meetings</h3>
                        <p className="text-gray-400 max-w-md">Your schedule is clear. Create a new meeting to coordinate with your team or clients.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-indigo-400 font-bold hover:text-indigo-300"
                        >
                            Schedule Now
                        </button>
                    </div>
                ) : (
                    meetings.map(meeting => (
                        <div key={meeting.id} className="glass-card p-6 rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                    <Video size={24} />
                                </div>
                                <div className="flex gap-2">
                                    {/* Link Copy or other actions could go here */}
                                    <button
                                        onClick={() => handleDelete(meeting.id)}
                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                        title="Cancel Meeting"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{meeting.title}</h3>
                            <p className="text-sm text-gray-400 mb-6 line-clamp-2">{meeting.description || 'No description provided.'}</p>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Calendar size={16} className="text-indigo-500" />
                                    <span>{new Date(meeting.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Clock size={16} className="text-indigo-500" />
                                    <span>{meeting.time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <LinkIcon size={16} className="text-indigo-500" />
                                    <span className="truncate max-w-[200px] text-gray-500">{meeting.meetLink}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5">
                                <a
                                    href={meeting.meetLink.startsWith('http') ? meeting.meetLink : `https://${meeting.meetLink}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 group-hover:scale-[1.02]"
                                >
                                    Join Meeting <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 w-full max-w-lg rounded-[32px] border border-white/10 p-8 relative shadow-2xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-6 top-6 text-gray-400 hover:text-white"
                        >
                            <Trash2 className="rotate-45" size={24} /> {/* Using rotated trash as close icon or just import X */}
                        </button>

                        <h2 className="text-2xl font-black text-white mb-6">Schedule New Meeting</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Meeting Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
                                    placeholder="e.g. Weekly Sync"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Google Meet Link</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        required
                                        value={formData.meetLink}
                                        onChange={e => setFormData({ ...formData, meetLink: e.target.value })}
                                        className="flex-grow bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
                                        placeholder="https://meet.google.com/..."
                                    />
                                    <button
                                        type="button"
                                        onClick={generateMeetLink}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-xl font-bold text-xs whitespace-nowrap"
                                        title="Open new Meet to generate link"
                                    >
                                        Create New
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none h-24 resize-none"
                                    placeholder="Agenda, notes, etc."
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-indigo-500/20"
                                >
                                    Schedule Meeting
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Meetings;

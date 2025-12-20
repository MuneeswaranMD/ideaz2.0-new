
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Globe, Eye, Image as ImageIcon, X } from 'lucide-react';

const BlogAdmin: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', excerpt: '', content: '', image: '' });

    useEffect(() => {
        const q = query(collection(db, 'blog'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().timestamp?.toDate().toLocaleDateString() || 'Just now'
            }));
            setPosts(items);
        });
        return () => unsubscribe();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'blog'), {
                ...newPost,
                status: 'Published',
                timestamp: serverTimestamp(),
                author: 'Admin'
            });
            setNewPost({ title: '', excerpt: '', content: '', image: '' });
            setIsCreating(false);
        } catch (error) {
            console.error("Error adding post: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            await deleteDoc(doc(db, 'blog', id));
        }
    };

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Blog Management</h1>
                        <p className="text-gray-400">Control your website's content and articles in realtime.</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        <Plus className="mr-2" size={20} /> New Post
                    </button>
                </header>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        {posts.length === 0 && !isCreating && (
                            <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                                <p className="text-gray-500">No blog posts found. Create your first insight!</p>
                            </div>
                        )}

                        {posts.map((post) => (
                            <div key={post.id} className="glass-card p-6 rounded-[32px] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center text-gray-500 group-hover:text-indigo-400 transition-colors">
                                        {post.image ? <img src={post.image} className="w-full h-full object-cover" /> : <ImageIcon size={32} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{post.date}</span>
                                            <span className={`flex items-center gap-1 ${post.status === 'Published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                {post.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-gray-400 hover:text-white"><Eye size={20} /></button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="p-3 hover:bg-red-500/10 rounded-2xl transition-colors text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-indigo-600/5">
                            <div className="flex items-center gap-3 text-indigo-400 mb-4">
                                <Globe size={24} />
                                <h2 className="text-xl font-bold text-white">Live Site</h2>
                            </div>
                            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                Changes made here reflect immediately on the website's blog section.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 w-full max-w-2xl rounded-[40px] p-10 border border-white/10 relative">
                        <button onClick={() => setIsCreating(false)} className="absolute right-8 top-8 text-gray-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <h2 className="text-3xl font-black mb-8">Create New Insight</h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Post Title</label>
                                <input
                                    required
                                    value={newPost.title}
                                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none"
                                    placeholder="Enter title..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Excerpt</label>
                                <textarea
                                    required
                                    value={newPost.excerpt}
                                    onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none h-24 resize-none"
                                    placeholder="Short description..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Image URL</label>
                                <input
                                    value={newPost.image}
                                    onChange={e => setNewPost({ ...newPost, image: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none"
                                    placeholder="Unsplash URL recommended..."
                                />
                            </div>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition-all">
                                Publish Insight
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogAdmin;

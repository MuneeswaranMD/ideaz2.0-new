import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'blog'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().timestamp?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Just now'
            }));
            setPosts(items);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-transparent text-white min-h-screen">
            <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-6xl md:text-[8rem] font-black mb-12 leading-[0.85] tracking-tighter">
                        Creative <br />
                        <span className="text-purple-500">Insights</span>
                    </h1>
                    <p className="text-2xl text-white/50 max-w-3xl font-light leading-relaxed">
                        Thoughts, stories, and ideas from the team at Averqon about design, technology, and the future of digital excellence.
                    </p>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        onClick={() => window.location.hash = '#/blog/powering-digital-growth'}
                        className="relative group cursor-pointer overflow-hidden rounded-[50px] border border-white/5 glass-card p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center hover:border-purple-500/30 transition-all duration-700 shadow-2xl"
                    >
                        <div className="flex-1 space-y-8 relative z-10">
                            <span className="px-6 py-2 bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs font-black rounded-full uppercase tracking-[0.3em]">Featured Protocol</span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight transition-colors group-hover:text-purple-400">Powering Digital Growth in 2025</h2>
                            <p className="text-xl text-white/40 leading-relaxed font-light">
                                Discover how powering digital growth helps businesses scale using strategy, UI/UX, web development, and digital innovation.
                            </p>
                            <div className="flex items-center gap-8 text-white/20 text-[10px] font-black uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Calendar size={14} className="text-purple-500" /> Dec 31, 2025</span>
                                <span className="flex items-center gap-2"><User size={14} className="text-purple-500" /> Protocol Strategy</span>
                            </div>
                            <button className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs group-hover:gap-6 transition-all pt-6">
                                Read Transmission <ArrowRight size={20} className="text-purple-500" />
                            </button>
                        </div>
                        <div className="flex-1 w-full aspect-[4/3] relative overflow-hidden rounded-[40px] border border-white/5 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
                                alt="Powering Digital Growth"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 contrast-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-60"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {posts.map((post) => (
                            <div key={post.id} className="group cursor-pointer flex flex-col h-full">
                                <div className="relative aspect-video mb-10 overflow-hidden rounded-[40px] border border-white/5 glass-card group-hover:border-purple-500/30 transition-all duration-500">
                                    <img
                                        src={post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80'}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-purple-600/10 group-hover:opacity-0 transition-opacity duration-700"></div>
                                </div>
                                <div className="space-y-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/30">
                                        <span className="flex items-center gap-2 group-hover:text-purple-400 transition-colors"><Calendar size={12} className="text-purple-500" /> {post.date}</span>
                                        <span className="flex items-center gap-2"><User size={12} className="text-purple-500" /> {post.author}</span>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter leading-tight transition-colors group-hover:text-purple-400">{post.title}</h2>
                                    <p className="text-white/40 text-lg font-light leading-relaxed line-clamp-2">{post.excerpt}</p>
                                    <div className="mt-auto pt-8">
                                        <button className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs group-hover:gap-6 transition-all">
                                            Open Log <ArrowRight size={18} className="text-purple-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogPage;

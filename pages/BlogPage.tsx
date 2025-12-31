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
        <div className="bg-black min-h-screen">
            <section className="py-24 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-6xl md:text-8xl font-black mb-8">Creative <span className="text-indigo-500">Insights</span></h1>
                    <p className="text-2xl text-gray-400 max-w-3xl font-light">
                        Thoughts, stories, and ideas from the team at Averqon about design, technology, and the future.
                    </p>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        onClick={() => window.location.hash = '#/blog/powering-digital-growth'}
                        className="relative group cursor-pointer overflow-hidden rounded-[40px] border border-white/10 bg-zinc-900/50 p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center hover:border-indigo-500/30 transition-all"
                    >
                        <div className="flex-1 space-y-6">
                            <span className="px-4 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full uppercase tracking-widest">Featured Post</span>
                            <h2 className="text-4xl md:text-5xl font-black">Powering Digital Growth in 2025</h2>
                            <p className="text-xl text-gray-400 leading-relaxed font-light">
                                Discover how powering digital growth helps businesses scale using strategy, UI/UX, web development, and digital innovation.
                            </p>
                            <div className="flex items-center gap-6 text-gray-500 text-sm">
                                <span className="flex items-center gap-1"><Calendar size={14} /> Dec 31, 2025</span>
                                <span className="flex items-center gap-1"><User size={14} /> Averqon Strategy</span>
                            </div>
                            <button className="flex items-center gap-2 text-indigo-500 font-bold group-hover:gap-4 transition-all pt-4">
                                Read Full Story <ArrowRight size={20} />
                            </button>
                        </div>
                        <div className="flex-1 w-full aspect-[16/9] md:aspect-auto md:h-80 overflow-hidden rounded-3xl">
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
                                alt="Powering Digital Growth"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {posts.map((post) => (
                            <div key={post.id} className="group cursor-pointer">
                                <div className="relative h-64 mb-8 overflow-hidden rounded-[40px] border border-white/10">
                                    <div className="absolute inset-0 bg-indigo-600/20 group-hover:opacity-0 transition-opacity duration-500"></div>
                                    <img
                                        src={post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80'}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                                        <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold group-hover:text-indigo-400 transition-colors">{post.title}</h2>
                                    <p className="text-gray-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                    <button className="flex items-center gap-2 text-indigo-500 font-bold group-hover:gap-4 transition-all">
                                        Read Story <ArrowRight size={20} />
                                    </button>
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


import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendHiringEmail } from '../lib/emailService';
import { Send, User, Mail, Link as LinkIcon, Briefcase, ChevronDown, CheckCircle } from 'lucide-react';

const HiringForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        portfolio: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            // 1. Save to Firestore
            await addDoc(collection(db, 'applications'), {
                ...formData,
                timestamp: serverTimestamp()
            });

            // 2. Dispatch Email Notification
            try {
                await sendHiringEmail(formData);
            } catch (emailError) {
                console.warn('Email dispatch failed, but application was saved:', emailError);
            }

            setStatus('success');
            setFormData({ name: '', email: '', position: '', portfolio: '', message: '' });
        } catch (error) {
            console.error('Error submitting application:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="glass-card p-12 rounded-[40px] text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4">Application Sent!</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Thank you for your interest in joining Averqon. Our HR team will review your profile and get back to you soon.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-indigo-500 font-bold hover:text-indigo-400 transition-colors"
                >
                    Send another application
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card p-8 md:p-12 rounded-[40px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="space-y-3">
                        <label htmlFor="full-name" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <User size={14} className="mr-2 text-indigo-500" />
                            Full Name
                        </label>
                        <input
                            id="full-name"
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                            placeholder="Elon Musk"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                        <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <Mail size={14} className="mr-2 text-indigo-500" />
                            Email Address
                        </label>
                        <input
                            id="email"
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                            placeholder="elon@mars.com"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Position */}
                    <div className="space-y-3">
                        <label htmlFor="position" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <Briefcase size={14} className="mr-2 text-indigo-500" />
                            Desired Position
                        </label>
                        <div className="relative">
                            <select
                                id="position"
                                required
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                            >
                                <option className="bg-zinc-900" value="">Select a role</option>
                                <option className="bg-zinc-900" value="UI/UX Designer">UI/UX Designer</option>
                                <option className="bg-zinc-900" value="Frontend Developer">Frontend Developer</option>
                                <option className="bg-zinc-900" value="Backend Developer">Backend Developer</option>
                                <option className="bg-zinc-900" value="Digital Marketer">Digital Marketer</option>
                                <option className="bg-zinc-900" value="Graphic Designer">Graphic Designer</option>
                                <option className="bg-zinc-900" value="WordPress Developer">WordPress Developer</option>
                                <option className="bg-zinc-900" value="Other">Other</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Portfolio Link */}
                    <div className="space-y-3">
                        <label htmlFor="portfolio" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <LinkIcon size={14} className="mr-2 text-indigo-500" />
                            Portfolio / LinkedIn
                        </label>
                        <input
                            id="portfolio"
                            type="url"
                            value={formData.portfolio}
                            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                            placeholder="https://behance.net/..."
                        />
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-400 uppercase tracking-widest">Why do you want to join us?</label>
                    <textarea
                        id="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-gray-600"
                        placeholder="Tell us about yourself and your passion..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-indigo-600 text-white font-black py-6 rounded-2xl hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed transition-all shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/40 flex items-center justify-center group text-lg"
                >
                    {status === 'submitting' ? 'Sending...' : 'Submit Application'}
                    {status !== 'submitting' && <Send size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
                {status === 'error' && <p className="text-red-500 text-sm text-center">Submission failed. Please check your connection.</p>}
            </form>
        </div>
    );
};

export default HiringForm;

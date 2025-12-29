
import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendDemoEmail } from '../lib/emailService';
import { Send, User, Mail, Building2, Phone, MessageSquare, CheckCircle } from 'lucide-react';

const BookDemoForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            // 1. Save to Firestore
            await addDoc(collection(db, 'demo_requests'), {
                ...formData,
                product: 'Averqon Billing Software',
                timestamp: serverTimestamp()
            });

            // 2. Dispatch Email Notification
            try {
                await sendDemoEmail(formData);
            } catch (emailError) {
                console.warn('Email dispatch failed, but request was saved:', emailError);
            }

            setStatus('success');
            setFormData({ name: '', email: '', company: '', phone: '', message: '' });
        } catch (error) {
            console.error('Error booking demo:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="glass-card p-12 rounded-[40px] text-center animate-in fade-in zoom-in duration-500 bg-zinc-900/50 border border-white/10 backdrop-blur-xl">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                    <CheckCircle className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4 text-white">Demo Requested!</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Thank you for your interest in Averqon Billing. Our product expert will contact you within 24 hours to schedule your personalized demo.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-indigo-500 font-bold hover:text-indigo-400 transition-colors"
                >
                    Request another demo
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card p-8 md:p-12 rounded-[40px] relative overflow-hidden bg-zinc-900/50 border border-white/10 backdrop-blur-xl">
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
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 text-white"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                        <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <Mail size={14} className="mr-2 text-indigo-500" />
                            Work Email
                        </label>
                        <input
                            id="email"
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 text-white"
                            placeholder="john@company.com"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Company */}
                    <div className="space-y-3">
                        <label htmlFor="company" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <Building2 size={14} className="mr-2 text-indigo-500" />
                            Company Name
                        </label>
                        <input
                            id="company"
                            required
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 text-white"
                            placeholder="Acme Inc."
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-3">
                        <label htmlFor="phone" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <Phone size={14} className="mr-2 text-indigo-500" />
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 text-white"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <label htmlFor="message" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                        <MessageSquare size={14} className="mr-2 text-indigo-500" />
                        Specific Requirements
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-gray-600 text-white"
                        placeholder="Tell us about your billing needs..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-indigo-600 text-white font-black py-6 rounded-2xl hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed transition-all shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/40 flex items-center justify-center group text-lg"
                >
                    {status === 'submitting' ? 'Scheduling...' : 'Book My Free Demo'}
                    {status !== 'submitting' && <Send size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
                {status === 'error' && <p className="text-red-500 text-sm text-center">Submission failed. Please check your connection.</p>}
            </form>
        </div>
    );
};

export default BookDemoForm;

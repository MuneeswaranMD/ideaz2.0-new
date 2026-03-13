
import React, { useState } from 'react';
import { X, Send, CheckCircle, User, Mail, Briefcase, MessageSquare, Phone } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendEnquiryEmail } from '../lib/emailService';
import { triggerAutoResponse } from '../lib/automation';

interface EnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: 'Web Development',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            // 1. Save to Firestore
            await addDoc(collection(db, 'enquiries'), {
                ...formData,
                timestamp: serverTimestamp()
            });

            // 2. Dispatch Email Notification & Trigger Automation
            try {
                // Secondary notification
                await sendEnquiryEmail(formData);

                // Primary Automation (Integrated Email Response)
                await triggerAutoResponse(formData, 'Averqon Website - Main Enquiry');
            } catch (triggerError) {
                console.warn('Notification/Automation failed, but enquiry was saved:', triggerError);
            }

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setFormData({ name: '', email: '', phone: '', service: 'Web Development', message: '' });
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-zinc-900 w-full max-w-lg rounded-[40px] border border-white/10 relative shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <button onClick={onClose} className="absolute right-6 top-6 p-2 text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="p-10">
                    {status === 'success' ? (
                        <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black mb-4 tracking-tighter">Transmission Successful</h2>
                            <p className="text-gray-400 font-medium">Your request has been indexed. Our command center will respond shortly.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl font-black tracking-tighter mb-2">Initialize <span className="text-indigo-500">Project</span></h2>
                                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Connect with our creative core.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Identity</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-bold"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Email Protocol</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-bold"
                                            placeholder="hq@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Phone Protocol</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-bold"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Service Tier</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <select
                                            value={formData.service}
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer font-bold"
                                        >
                                            <option className="bg-zinc-900">Web Development</option>
                                            <option className="bg-zinc-900">Cloud Services</option>
                                            <option className="bg-zinc-900">UI/UX Design</option>
                                            <option className="bg-zinc-900">Digital Marketing</option>
                                            <option className="bg-zinc-900">WordPress Solution</option>
                                            <option className="bg-zinc-900">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Briefing</label>
                                    <div className="relative group">
                                        <MessageSquare className="absolute left-5 top-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <textarea
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all resize-none placeholder:text-gray-700 font-bold"
                                            placeholder="Describe your vision..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-3xl transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center disabled:opacity-50 text-lg sm:text-xl tracking-tighter group"
                                >
                                    {status === 'submitting' ? 'SYNCHRONIZING...' : 'START TRANSMISSION'}
                                    <Send className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                                </button>
                                {status === 'error' && <p className="text-red-500 text-sm text-center font-bold">Transmission failed. Check network link.</p>}
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnquiryModal;

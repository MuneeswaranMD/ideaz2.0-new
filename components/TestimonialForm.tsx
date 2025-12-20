import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Briefcase, MessageSquare, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface TestimonialFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'testimonials'), {
                ...formData,
                timestamp: serverTimestamp(),
                status: 'pending' // Default to pending if you want manual approval later
            });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({ name: '', role: '', message: '' });
                onClose();
            }, 3000);
        } catch (error) {
            console.error("Error submitting testimonial:", error);
            alert("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-zinc-900 w-full max-w-lg rounded-[40px] border border-white/10 relative overflow-hidden shadow-2xl"
                    >
                        {/* Decorative background */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>

                        <button
                            onClick={onClose}
                            className="absolute right-8 top-8 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-10 relative z-10">
                            <div className="mb-8">
                                <h2 className="text-3xl font-black tracking-tighter mb-2">Share Your <span className="text-indigo-400">Experience</span></h2>
                                <p className="text-gray-400 font-medium">Your feedback drives our digital evolution.</p>
                            </div>

                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 flex flex-col items-center text-center"
                                >
                                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Transmission Received!</h3>
                                    <p className="text-gray-400">Your testimonial has been uploaded to the Command Center.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Your Full Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Role / Company"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <MessageSquare className="absolute left-5 top-6 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                            <textarea
                                                required
                                                placeholder="Tell us about your experience..."
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>Transmit Experience</span>
                                                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TestimonialForm;

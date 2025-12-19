
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Send, Upload, User, Mail, Link as LinkIcon, Briefcase, ChevronDown, CheckCircle } from 'lucide-react';

const HiringForm: React.FC = () => {
    // Using the Formspree ID provided by the user
    const [state, handleSubmit] = useForm("xqezaoqo");

    if (state.succeeded) {
        return (
            <div className="glass-card p-12 rounded-[40px] text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4">Application Sent!</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Thank you for your interest in joining Averqon. Our HR team will review your profile and get back to you soon.
                </p>
                <button
                    onClick={() => window.location.reload()}
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

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10" encType="multipart/form-data">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="space-y-3">
                        <label htmlFor="full-name" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <User size={14} className="mr-2 text-indigo-500" />
                            Full Name
                        </label>
                        <input
                            id="full-name"
                            name="name"
                            required
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                            placeholder="Elon Musk"
                        />
                        <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                        <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <Mail size={14} className="mr-2 text-indigo-500" />
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            required
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                            placeholder="elon@mars.com"
                        />
                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
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
                                name="position"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                            >
                                <option className="bg-zinc-900" value="">Select a role</option>
                                <option className="bg-zinc-900" value="uiux">UI/UX Designer</option>
                                <option className="bg-zinc-900" value="frontend">Frontend Developer</option>
                                <option className="bg-zinc-900" value="backend">Backend Developer</option>
                                <option className="bg-zinc-900" value="marketing">Digital Marketer</option>
                                <option className="bg-zinc-900" value="graphic">Graphic Designer</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                        </div>
                        <ValidationError prefix="Position" field="position" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Portfolio Link */}
                    <div className="space-y-3">
                        <label htmlFor="portfolio" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                            <LinkIcon size={14} className="mr-2 text-indigo-500" />
                            Portfolio / LinkedIn
                        </label>
                        <input
                            id="portfolio"
                            name="portfolio"
                            type="url"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                            placeholder="https://behance.net/..."
                        />
                        <ValidationError prefix="Portfolio" field="portfolio" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-3">
                    <label htmlFor="resume" className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                        <Upload size={14} className="mr-2 text-indigo-500" />
                        Upload Resume (PDF)
                    </label>
                    <div className="relative group">
                        <input
                            id="resume"
                            name="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-2xl px-6 py-8 flex flex-col items-center justify-center group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all">
                            <Upload className="text-gray-500 mb-2 group-hover:text-indigo-500 transition-colors" />
                            <p className="text-gray-400 text-sm font-medium">Click or drag & drop your resume file</p>
                            <p className="text-[10px] text-gray-600 mt-2">Accepted formats: PDF, DOC, DOCX</p>
                        </div>
                    </div>
                    <ValidationError prefix="Resume" field="resume" errors={state.errors} className="text-red-500 text-xs mt-1" />
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-400 uppercase tracking-widest">Why do you want to join us?</label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-gray-600"
                        placeholder="Tell us about yourself and your passion..."
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1" />
                </div>

                <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full bg-indigo-600 text-white font-black py-6 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/40 flex items-center justify-center group text-lg"
                >
                    {state.submitting ? 'Sending...' : 'Submit Application'}
                    {!state.submitting && <Send size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>

                {state.errors && Object.keys(state.errors).length > 0 && (
                    <p className="text-red-500 text-center text-sm font-medium">There was an error submitting your form. Please check the fields.</p>
                )}
            </form>
        </div>
    );
};

export default HiringForm;

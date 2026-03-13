import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Smartphone } from 'lucide-react';

const Features: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                    {/* Fast Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-12 lg:col-span-5 glass-card relative overflow-hidden group p-8 md:p-12 flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ffa3]/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-[#00ffa3]/20 transition-all duration-700"></div>
                        <div>
                            <div className="w-16 h-16 bg-[#00ffa3]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#00ffa3]/30">
                                <Zap size={32} className="text-[#00ffa3]" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black mb-6   tracking-tighter">Fast</h3>
                            <p className="text-xl text-white/50 font-light leading-relaxed max-w-sm">
                                Propelling brands at lightspeed. Our streamlined development process ensures your vision reaches the market before the competition.
                            </p>
                        </div>
                        <div className="mt-12 flex items-center space-x-2 text-[#00ffa3] font-black uppercase tracking-widest text-sm">
                            <span className="w-8 h-[1px] bg-[#00ffa3]"></span>
                            <span>Ultra-Performance</span>
                        </div>
                    </motion.div>

                    {/* Right Column Grid */}
                    <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        {/* In-depth Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-10 flex flex-col justify-between group relative overflow-hidden h-full"
                        >
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 blur-[80px] -ml-24 -mb-24 group-hover:bg-purple-600/20 transition-all duration-700"></div>
                            <div>
                                <div className="w-14 h-14 bg-purple-600/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/30">
                                    <BookOpen size={28} className="text-purple-500" />
                                </div>
                                <h3 className="text-3xl font-black mb-4   tracking-tighter">In-depth</h3>
                                <p className="text-lg text-white/40 font-light leading-relaxed">
                                    Deep technical expertise combined with strategic analysis. Every pixel and line of code is meticulously crafted for excellence.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="flex -space-x-3 mb-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#11111a] bg-zinc-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-[#11111a] bg-purple-600 flex items-center justify-center text-[10px] font-bold">+9</div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Collaborative Design</span>
                            </div>
                        </motion.div>

                        {/* Mobile Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-10 flex flex-col justify-between group relative overflow-hidden h-full"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/10 blur-[80px] group-hover:bg-blue-600/20 transition-all duration-700"></div>
                            <div>
                                <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30">
                                    <Smartphone size={28} className="text-blue-500" />
                                </div>
                                <h3 className="text-3xl font-black mb-4   tracking-tighter">Mobile</h3>
                                <p className="text-lg text-white/40 font-light leading-relaxed">
                                    Native-feel experiences across all devices. We build for the palm of your hand, ensuring accessibility and engagement everywhere.
                                </p>
                            </div>
                            <div className="mt-8">
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '85%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-blue-500"
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Mobile First</span>
                                    <span className="text-[10px] font-black text-blue-500">85% Reach</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;


import React from 'react';
import HiringForm from '../components/HiringForm';
import { Rocket, Heart, Zap, Star } from 'lucide-react';

const CareersPage: React.FC = () => {
    const perks = [
        { icon: <Rocket size={24} />, title: 'Hyper Growth', desc: 'Accelerate your career with the industry\'s most ambitious digital projects.' },
        { icon: <Heart size={24} />, title: 'Radical Culture', desc: 'Work with a passionate elite team in an uncompromisingly creative environment.' },
        { icon: <Zap size={24} />, title: 'Real Impact', desc: 'Build scalable solutions that define how modern businesses operate.' },
        { icon: <Star size={24} />, title: 'Total Quality', desc: 'We value obsessive excellence and meticulous attention to every pixel.' },
    ];

    return (
        <div className="bg-transparent text-white min-h-screen">
            {/* Header Section */}
            <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-6xl md:text-[8rem] font-black mb-12 leading-[0.85] tracking-tighter">
                        Join the <br />
                        <span className="text-purple-500">Averqon Team</span>
                    </h1>
                    <p className="text-2xl text-white/50 max-w-3xl font-light leading-relaxed">
                        We're always looking for talented individuals who are passionate about design,
                        technology, and innovation. Come help us build the future of digital experiences.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-start">

                        {/* Left: Info & Perks */}
                        <div>
                            <h2 className="text-4xl font-black mb-16 tracking-tighter">Why Work With Us?</h2>

                            <div className="grid sm:grid-cols-2 gap-8 mb-16">
                                {perks.map((perk, index) => (
                                    <div key={index} className="glass-card p-10 rounded-[40px] border border-white/5 group hover:border-purple-500/30 transition-all duration-500">
                                        <div className="text-purple-500 mb-6 bg-purple-600/10 w-12 h-12 flex items-center justify-center rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform">{perk.icon}</div>
                                        <h3 className="text-2xl font-black tracking-tighter mb-4">{perk.title}</h3>
                                        <p className="text-white/40 text-sm font-light leading-relaxed">{perk.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="glass-card p-12 rounded-[50px] border border-purple-500/20 bg-purple-600/[0.02]">
                                <h3 className="text-3xl font-black tracking-tighter mb-6">Don't see a perfect fit?</h3>
                                <p className="text-white/50 text-lg font-light leading-relaxed">
                                    We are always on the lookout for exceptional talent. If you think you'd be a great addition to Averqon,
                                    send us your application anyway and tell us how you can make a difference.
                                </p>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="lg:sticky lg:top-32">
                            <div className="mb-10 lg:text-right">
                                <span className="text-purple-500 font-black uppercase tracking-[0.4em] text-xs">Averqon HR Protocol</span>
                                <h2 className="text-5xl font-black mt-4 tracking-tighter">Apply Now</h2>
                            </div>
                            <div className="glass-card p-4 rounded-[40px] border-white/5">
                                <HiringForm />
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;

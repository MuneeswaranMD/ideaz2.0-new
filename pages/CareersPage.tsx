
import React from 'react';
import HiringForm from '../components/HiringForm';
import { Rocket, Heart, Zap, Star } from 'lucide-react';

const CareersPage: React.FC = () => {
    const perks = [
        { icon: <Rocket size={24} />, title: 'Growth', desc: 'Accelerate your career with ambitious projects.' },
        { icon: <Heart size={24} />, title: 'Culture', desc: 'Work with a passionate team in a creative environment.' },
        { icon: <Zap size={24} />, title: 'Impact', desc: 'Build solutions that help businesses grow.' },
        { icon: <Star size={24} />, title: 'Quality', desc: 'We value excellence and attention to detail.' },
    ];

    return (
        <div className="bg-black min-h-screen">
            {/* Header Section */}
            <section className="py-24 bg-zinc-950 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                        Join the <br />
                        <span className="text-indigo-500">Averqon Team</span>
                    </h1>
                    <p className="text-2xl text-gray-400 max-w-3xl font-light leading-relaxed">
                        We're always looking for talented individuals who are passionate about design,
                        technology, and innovation. Come help us build the future of digital experiences.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-start">

                        {/* Left: Info & Perks */}
                        <div>
                            <h2 className="text-3xl font-bold mb-12">Why Work With Us?</h2>

                            <div className="grid sm:grid-cols-2 gap-8 mb-16">
                                {perks.map((perk, index) => (
                                    <div key={index} className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                                        <div className="text-indigo-500 mb-4">{perk.icon}</div>
                                        <h3 className="text-xl font-bold mb-2">{perk.title}</h3>
                                        <p className="text-gray-500 text-sm">{perk.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-indigo-600/10 p-10 rounded-[40px] border border-indigo-500/20">
                                <h3 className="text-2xl font-bold mb-4">Don't see a perfect fit?</h3>
                                <p className="text-gray-400 mb-0">
                                    We are always on the lookout for exceptional talent. If you think you'd be a great addition to Averqon,
                                    send us your application anyway and tell us how you can make a difference.
                                </p>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div>
                            <div className="mb-10 lg:text-right">
                                <span className="text-indigo-500 font-bold uppercase tracking-[0.2em] text-sm">Application Form</span>
                                <h2 className="text-4xl font-black mt-2">Apply Now</h2>
                            </div>
                            <HiringForm />
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;

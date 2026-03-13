
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Code, Zap, BarChart, Layout, Smartphone, Shield, Search, TrendingUp, Users } from 'lucide-react';

const DigitalGrowth: React.FC = () => {
    useEffect(() => {
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Discover how powering digital growth in 2025 helps businesses scale using strategy, UI/UX, web development, and digital innovation. By Averqon.');
        }

        // Add JSON-LD Schema
        const schema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Powering Digital Growth: What It Really Means in 2025",
            "description": "Discover what powering digital growth really means in 2025 and how businesses can scale using strategy, UI/UX, web development, and digital innovation.",
            "image": "https://averqon.in/blog/digital-growth-2025.jpg",
            "author": {
                "@type": "Organization",
                "name": "Averqon",
                "url": "https://averqon.in"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Averqon",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://averqon.in/logo.png"
                }
            },
            "datePublished": "2025-01-01",
            "dateModified": "2025-01-01",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://averqon.in/blog/powering-digital-growth-2025"
            },
            "keywords": [
                "Powering Digital Growth",
                "Digital Growth Strategy",
                "Web Development",
                "UI UX Design",
                "Digital Innovation",
                "Business Growth"
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-zinc-950">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {['Digital Growth', 'Web Development', 'UI/UX Design', 'Business Growth', 'Digital Strategy', 'Technology', 'Averqon'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                        Powering <span className="text-indigo-500">Digital Growth</span> <br />
                        in 2025
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-light leading-relaxed mb-12">
                        In an era of rapid technological evolution, <strong className="text-white font-medium">powering digital growth</strong> is no longer just an option—it's a necessity for businesses aiming to scale.
                    </p>

                    {/* 1. Blog Hero Image */}
                    <div className="max-w-5xl mx-auto rounded-[40px] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/20 aspect-[21/9]">
                        <img
                            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80"
                            alt="Powering digital growth through modern web development and digital innovation in 2025"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-invert prose-indigo lg:prose-xl max-w-none">
                        <p className="text-gray-400 leading-relaxed mb-12">
                            To truly understand <strong className="text-white">how to power digital growth</strong>, businesses must look beyond simple web presence. It requires a comprehensive <strong className="text-white">digital growth strategy</strong> that integrates <strong className="text-white">UI UX design services</strong> with robust <strong className="text-white">web development company</strong> expertise.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-20">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">The Digital Strategy Blueprint</h2>
                                <p className="text-gray-400 mb-6">
                                    A successful <strong className="text-white">digital growth strategy</strong> is not just about tools—it's about aligning design, technology, and business goals to create a seamless ecosystem for expansion.
                                </p>
                            </div>
                            {/* 2. Digital Strategy Illustration */}
                            <div className="rounded-3xl overflow-hidden border border-white/10">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
                                    alt="Digital growth strategy combining design, technology, and business goals"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-8">Modern Website Design & UX</h2>
                        <p className="text-gray-400 mb-8">
                            In 2025, <strong className="text-white">modern website design</strong> must prioritize the user above all else. <strong className="text-white">UI UX design services</strong> are essential for reducing friction and driving conversion.
                        </p>

                        {/* 3. Website & UI/UX Design Image */}
                        <div className="my-12 rounded-[40px] overflow-hidden border border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80"
                                alt="Modern UI UX design improving user experience and business growth"
                                className="w-full h-[400px] object-cover"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-12 my-20">
                            <div className="flex-1 order-2 md:order-1">
                                {/* 4. Web Development / Code Visual */}
                                <div className="rounded-3xl overflow-hidden border border-white/10 h-full">
                                    <img
                                        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80"
                                        alt="Scalable web development solutions built for growing businesses"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 order-1 md:order-2">
                                <h3 className="text-2xl font-bold mb-6">Scalable Web Development</h3>
                                <p className="text-gray-400">
                                    Building for today isn't enough. We provide <strong className="text-white">scalable digital solutions</strong> that ensure your infrastructure can handle tomorrow's demands without compromise.
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 p-12 rounded-[40px] border border-white/10 my-20">
                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-4">Performance-First Approach</h3>
                                    <p className="text-gray-400 mb-6 font-light">
                                        Speed is a ranking factor and a conversion driver. Our implementation focusses on <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hove:text-indigo-300">Google's Core Web Vitals</a>.
                                    </p>
                                    {/* 5. Performance & Speed Graphic */}
                                    <div className="rounded-2xl overflow-hidden border border-white/5">
                                        <img
                                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                                            alt="High-performance website optimization for faster loading and better SEO"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-4">Strategic Digital Marketing</h3>
                                    <p className="text-gray-400 mb-6 font-light">
                                        Visibility is the fuel for growth. We integrate <strong className="text-white">digital marketing</strong> and SEO from the first line of code.
                                    </p>
                                    {/* 6. Digital Marketing & SEO Image */}
                                    <div className="rounded-2xl overflow-hidden border border-white/5">
                                        <img
                                            src="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80"
                                            alt="Digital marketing and SEO strategies driving online business growth"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 my-20 items-center">
                            {/* 7. Growth / Analytics Chart */}
                            <div className="rounded-3xl overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-all">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                                    alt="Data-driven analytics supporting digital growth and scalability"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Data-Driven Growth</h2>
                                <p className="text-gray-400">
                                    In 2025, guessing is not an option. We use advanced analytics to monitor <strong className="text-white">business growth through digital</strong> channels and optimize in real-time.
                                </p>
                            </div>
                        </div>

                        <div className="text-center my-24">
                            {/* 8. Averqon Brand / Logo Image */}
                            <div className="inline-block p-8 bg-zinc-900 rounded-full border border-white/10 mb-8">
                                <img
                                    src="/logo.png"
                                    alt="Averqon digital innovation company powering digital growth"
                                    className="w-24 h-24 object-contain"
                                />
                            </div>
                            <h2 className="text-4xl font-black mb-6">Why Partner with Averqon?</h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light mb-12">
                                We aren't just a <strong className="text-white">web development company</strong>; we are your growth partners in the digital era.
                            </p>

                            {/* 9. Team Collaboration Illustration */}
                            <div className="rounded-[40px] overflow-hidden border border-white/10 mb-16">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                                    alt="Collaborative digital team building scalable business solutions"
                                    className="w-full h-[300px] object-cover"
                                />
                            </div>
                        </div>

                        <div className="mt-20 relative p-10 md:p-20 bg-zinc-950 border border-white/10 rounded-[60px] overflow-hidden text-center">
                            <div className="absolute inset-0 bg-indigo-600/5"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-black mb-6">Start Your Journey</h2>
                                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                                    Ready to experience how <strong className="text-white">powering digital growth</strong> can transform your business? Let's build the future together.
                                </p>
                                {/* 10. CTA / Contact Section Image included as background/accent logic if needed, but let's use a themed image */}
                                <div className="mb-12 rounded-3xl overflow-hidden border border-white/5 max-w-xl mx-auto ring-4 ring-indigo-500/10">
                                    <img
                                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80"
                                        alt="Partner with Averqon to power your digital business growth"
                                        className="w-full h-48 object-cover opacity-80"
                                    />
                                </div>
                                <div className="flex flex-wrap justify-center gap-6">
                                    <Link to="/services" className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                                        Explore Solutions <ArrowRight size={20} />
                                    </Link>
                                    <Link to="/contact" className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-full font-bold transition-all backdrop-blur-sm">
                                        Talk to an Expert
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="mt-24 text-center">
                            <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
                            <p className="text-gray-400 max-w-3xl mx-auto  ">
                                Ultimately, <strong className="text-white font-normal underline decoration-indigo-500 decoration-2 underline-offset-4">powering digital growth</strong> is a journey of continuous improvement. By prioritizing strategy, design, and development, your business can achieve unprecedented scale in 2025 and beyond.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DigitalGrowth;

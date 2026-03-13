import React, { useEffect } from 'react';
import { Target, Eye, Users, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn more about Averqon, a leading digital agency in chennai. Our journey from a small design studio to a full-service creative agency specializing in web development and cloud services.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'About Averqon, Digital Agency Journey, Web Development chennai, Cloud Infrastructure, Creative Agency History, Professional Digital Services');
    }
  }, []);
  return (
    <div className="bg-transparent text-white">
      {/* Hero Header */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-[8rem] font-black mb-12 leading-[0.85] tracking-tighter">
            The <span className="text-purple-500">Averqon</span> <br />
            Journey
          </h1>
          <p className="text-2xl text-white/50 max-w-3xl font-light leading-relaxed">
            Founded in chennai, we have evolved from a small design studio to a full-service creative digital agency, shaping the future of business one pixel at a time.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div className="glass-card p-12 rounded-[40px] hover:border-purple-500/30 transition-all group">
            <Target className="text-purple-500 w-12 h-12 mb-8 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-black mb-6">Our Mission</h2>
            <p className="text-white/40 text-lg leading-relaxed font-light">
              To empower startups and established businesses with world-class digital solutions that bridge the gap between complex technology and human intuition. We don't just build websites; we build growth engines.
            </p>
          </div>
          <div className="glass-card p-12 rounded-[40px] hover:border-blue-500/30 transition-all group">
            <Eye className="text-blue-500 w-12 h-12 mb-8 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-black mb-6">Our Vision</h2>
            <p className="text-white/40 text-lg leading-relaxed font-light">
              To be the most trusted creative partner in South India, known for innovation that is both aesthetically daring and technically flawless. We aim to set the standard for digital excellence in the region.
            </p>
          </div>
        </div>
      </section>

      {/* History Detail */}
      <section className="py-32 relative border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl font-black mb-16 text-center tracking-tighter">From 1.0 to 2.0</h2>
          <div className="space-y-16">
            <div className="flex gap-12 items-start group">
              <span className="text-purple-500 font-black text-4xl group-hover:scale-110 transition-transform">2020</span>
              <div className="pt-2">
                <h3 className="text-2xl font-black mb-3">The Genesis</h3>
                <p className="text-white/40 text-lg font-light leading-relaxed">Averqon started as a freelance collective in a small coworking space in chennai, focusing on high-quality graphic design.</p>
              </div>
            </div>
            <div className="flex gap-12 items-start group">
              <span className="text-purple-500 font-black text-4xl group-hover:scale-110 transition-transform">2022</span>
              <div className="pt-2">
                <h3 className="text-2xl font-black mb-3">Expansion Phase</h3>
                <p className="text-white/40 text-lg font-light leading-relaxed">Recognizing the need for holistic digital transformation, we expanded our team to include full-stack developers and SEO specialists.</p>
              </div>
            </div>
            <div className="flex gap-12 items-start group">
              <span className="text-purple-500 font-black text-4xl group-hover:scale-110 transition-transform">2026</span>
              <div className="pt-2">
                <h3 className="text-2xl font-black mb-3">Averqon 2.0</h3>
                <p className="text-white/40 text-lg font-light leading-relaxed">Relaunched with a focus on cutting-edge UX/UI, AI-driven marketing strategies, and robust cloud-native web applications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Stats */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-20">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <span className="text-6xl font-black text-white block mb-4">150+</span>
              <span className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-black">Projects Delivered</span>
            </div>
            <div>
              <span className="text-6xl font-black text-white block mb-4">25+</span>
              <span className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-black">Expert Minds</span>
            </div>
            <div>
              <span className="text-6xl font-black text-white block mb-4">98%</span>
              <span className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-black">Satisfaction</span>
            </div>
            <div>
              <span className="text-6xl font-black text-white block mb-4">4+</span>
              <span className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-black">Years of Magic</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

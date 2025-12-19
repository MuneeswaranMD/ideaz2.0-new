
import React from 'react';
import { Target, Eye, Users, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-black">
      {/* Hero Header */}
      <section className="py-24 bg-zinc-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-8xl font-black mb-8">The <span className="text-indigo-500">IDEAZ</span> Journey</h1>
          <p className="text-2xl text-gray-400 max-w-3xl font-light">
            Founded in Coimbatore, we have evolved from a small design studio to a full-service creative digital agency, shaping the future of business one pixel at a time.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div className="glass-card p-12 rounded-[40px]">
            <Target className="text-indigo-500 w-12 h-12 mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              To empower startups and established businesses with world-class digital solutions that bridge the gap between complex technology and human intuition. We don't just build websites; we build growth engines.
            </p>
          </div>
          <div className="glass-card p-12 rounded-[40px]">
            <Eye className="text-purple-500 w-12 h-12 mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              To be the most trusted creative partner in South India, known for innovation that is both aesthetically daring and technically flawless. We aim to set the standard for digital excellence in the region.
            </p>
          </div>
        </div>
      </section>

      {/* History Detail */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-12 text-center">From 1.0 to 2.0</h2>
          <div className="space-y-12">
            <div className="flex gap-8 items-start">
              <span className="text-indigo-500 font-black text-2xl">2020</span>
              <div>
                <h3 className="text-xl font-bold mb-2">The Genesis</h3>
                <p className="text-gray-400">IDEAZ started as a freelance collective in a small coworking space in Coimbatore, focusing on high-quality graphic design.</p>
              </div>
            </div>
            <div className="flex gap-8 items-start">
              <span className="text-indigo-500 font-black text-2xl">2022</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Expansion Phase</h3>
                <p className="text-gray-400">Recognizing the need for holistic digital transformation, we expanded our team to include full-stack developers and SEO specialists.</p>
              </div>
            </div>
            <div className="flex gap-8 items-start">
              <span className="text-indigo-500 font-black text-2xl">2024</span>
              <div>
                <h3 className="text-xl font-bold mb-2">IDEAZ 2.0</h3>
                <p className="text-gray-400">Relaunched with a focus on cutting-edge UX/UI, AI-driven marketing strategies, and robust cloud-native web applications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Stats */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-16">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <span className="text-5xl font-black text-white block mb-2">150+</span>
              <span className="text-gray-500 uppercase tracking-widest text-xs">Projects Delivered</span>
            </div>
            <div>
              <span className="text-5xl font-black text-white block mb-2">25+</span>
              <span className="text-gray-500 uppercase tracking-widest text-xs">Expert Minds</span>
            </div>
            <div>
              <span className="text-5xl font-black text-white block mb-2">98%</span>
              <span className="text-gray-500 uppercase tracking-widest text-xs">Client Satisfaction</span>
            </div>
            <div>
              <span className="text-5xl font-black text-white block mb-2">4+</span>
              <span className="text-gray-500 uppercase tracking-widest text-xs">Years of Magic</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

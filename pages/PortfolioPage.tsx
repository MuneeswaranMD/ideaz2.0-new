
import React from 'react';
import { ExternalLink } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const projects = [
    {
      title: "FinanceFlow App",
      category: "Fintech Mobile App",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
      desc: "A comprehensive dashboard for wealth management used by 50k+ users."
    },
    {
      title: "Aura Boutique",
      category: "E-Commerce Experience",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
      desc: "High-end fashion retailer platform with AR try-on features."
    },
    {
      title: "NexGen Logistics",
      category: "SaaS Enterprise Solution",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
      desc: "Streamlining complex supply chain operations through AI optimization."
    },
    {
      title: "Coimbatore Cafe",
      category: "Branding & Identity",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
      desc: "Visual identity refresh for a local landmark, increasing footfall by 40%."
    }
  ];

  return (
    <div className="bg-black">
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-8xl font-black mb-8">Case <span className="text-indigo-500">Studies</span></h1>
          <p className="text-2xl text-gray-400 max-w-3xl font-light">
            Explore our portfolio of successful collaborations where strategy meets creativity to drive real business impact.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {projects.map((project, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-all"></div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-indigo-500 font-bold uppercase tracking-widest text-xs mb-2 block">{project.category}</span>
                    <h2 className="text-3xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{project.title}</h2>
                    <p className="text-gray-400">{project.desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ExternalLink size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;


import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortfolioPreview: React.FC = () => {
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
    }
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <h2 className="text-indigo-500 font-bold tracking-widest uppercase text-sm mb-4">Our Work</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-4">Featured Projects</h3>
            <p className="text-xl text-gray-400 max-w-xl">
              We take pride in our ability to solve complex problems with elegant digital solutions.
            </p>
          </div>
          <Link 
            to="/portfolio" 
            className="mt-8 md:mt-0 group flex items-center text-white font-bold bg-white/5 border border-white/10 px-8 py-4 rounded-full hover:bg-white/10 transition-all"
          >
            View All Projects
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project, idx) => (
            <div key={idx} className="group cursor-pointer">
              <Link to="/portfolio" className="block">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <span className="text-white font-bold text-lg">View Case Study</span>
                  </div>
                </div>
              </Link>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-indigo-500 font-bold uppercase tracking-widest text-xs mb-2 block">{project.category}</span>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{project.title}</h2>
                  <p className="text-gray-400 max-w-md">{project.desc}</p>
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
  );
};

export default PortfolioPreview;

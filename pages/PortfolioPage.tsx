
import React from 'react';
import { ExternalLink } from 'lucide-react';


const PortfolioPage: React.FC = () => {
  const projects = [
    {
      title: "Academic Portfolio",
      category: "Protocol Static",
      image: "/projects/professor_portfolio_website_1766690486920.png",
      desc: "A professional static website for a college professor to showcase research papers, lectures, and academic achievements."
    },
    {
      title: "Retrostylings",
      category: "E-Commerce logic",
      image: "/projects/retrostyling_ecommerce_1766690504782.png",
      desc: "A vibrant e-commerce platform for retro-themed fashion and lifestyle products. Visit: www.retrostyling.in"
    },
    {
      title: "PharmaCore UI",
      category: "UI/UX Protocol",
      image: "/projects/pharmacy_software_uiux_1766690523919.png",
      desc: "Intuitive and efficient user interface for modern pharmacy management systems and inventory tracking."
    },
    {
      title: "ShopLive Mobile",
      category: "Mobile Architect",
      image: "/projects/ecommerce_live_mobile_app_1766690540328.png",
      desc: "A dynamic UI/UX design for a live-streaming e-commerce application, focusing on real-time engagement."
    },
    {
      title: "TravelMate App",
      category: "UI/UX Protocol",
      image: "/projects/tourist_guide_app_uiux_1766690557333.png",
      desc: "User-centric design for a tourist guide application with interactive maps and local insights."
    },
    {
      title: "Modern Business Portal",
      category: "WP Infrastructure",
      image: "/projects/wordpress_business_website_1766690573648.png",
      desc: "A robust and scalable WordPress website designed for corporate branding and content management."
    },
    {
      title: "Growth Catalyst",
      category: "Lead Generation",
      image: "/projects/digital_marketing_agency_static_site_1766690591135.png",
      desc: "A high-performance static website for a digital marketing agency, optimized for lead generation."
    },
    {
      title: "Averqon Billing",
      category: "SaaS Product",
      image: "/averqon/invoice.png",
      desc: "A powerful institutional billing and payment management system designed for modern enterprises."
    }
  ];

  return (
    <div className="bg-transparent text-white min-h-screen">
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-[8rem] font-black mb-12 leading-[0.85] tracking-tighter">
            Case <br />
            <span className="text-purple-500">Studies</span>
          </h1>
          <p className="text-2xl text-white/50 max-w-3xl font-light leading-relaxed">
            Explore our portfolio of successful collaborations where strategy meets creativity to drive real business impact.
          </p>
        </div>
      </section>

      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            {projects.map((project, idx) => (
              <div key={idx} className="group cursor-pointer flex flex-col h-full">
                <div className="relative aspect-video rounded-[50px] overflow-hidden mb-10 glass-card border border-white/5 group-hover:border-purple-500/30 transition-all duration-700 shadow-2xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-1000 group-hover:scale-110 contrast-125"
                  />
                  <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                <div className="flex justify-between items-start px-4">
                  <div className="flex-1 space-y-4">
                    <span className="text-purple-500 font-black uppercase text-[10px] tracking-[0.4em] mb-2 block">{project.category}</span>
                    <h2 className="text-4xl font-black tracking-tighter transition-colors group-hover:text-purple-400 leading-tight">{project.title}</h2>
                    <p className="text-white/40 text-lg font-light leading-relaxed line-clamp-2">{project.desc}</p>
                  </div>
                  <div className="ml-8 w-16 h-16 rounded-[2rem] glass-card border border-white/5 flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <ExternalLink size={24} />
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

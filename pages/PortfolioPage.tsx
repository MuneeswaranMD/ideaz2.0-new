
import React from 'react';
import { ExternalLink } from 'lucide-react';


const PortfolioPage: React.FC = () => {
  const projects = [
    {
      title: "Academic Portfolio",
      category: "Static Website",
      image: "/projects/professor_portfolio_website_1766690486920.png",
      desc: "A professional static website for a college professor to showcase research papers, lectures, and academic achievements."
    },
    {
      title: "Retrostylings",
      category: "E-Commerce",
      image: "/projects/retrostyling_ecommerce_1766690504782.png",
      desc: "A vibrant e-commerce platform for retro-themed fashion and lifestyle products. Visit: www.retrostyling.in"
    },
    {
      title: "PharmaCore UI",
      category: "UI/UX Design",
      image: "/projects/pharmacy_software_uiux_1766690523919.png",
      desc: "Intuitive and efficient user interface for modern pharmacy management systems and inventory tracking."
    },
    {
      title: "ShopLive Mobile",
      category: "Mobile App Design",
      image: "/projects/ecommerce_live_mobile_app_1766690540328.png",
      desc: "A dynamic UI/UX design for a live-streaming e-commerce application, focusing on real-time engagement."
    },
    {
      title: "TravelMate App",
      category: "UI/UX Design",
      image: "/projects/tourist_guide_app_uiux_1766690557333.png",
      desc: "User-centric design for a tourist guide application with interactive maps and local insights."
    },
    {
      title: "Modern Business Portal",
      category: "WordPress Website",
      image: "/projects/wordpress_business_website_1766690573648.png",
      desc: "A robust and scalable WordPress website designed for corporate branding and content management."
    },
    {
      title: "Growth Catalyst",
      category: "Static Website",
      image: "/projects/digital_marketing_agency_static_site_1766690591135.png",
      desc: "A high-performance static website for a digital marketing agency, optimized for lead generation."
    },
    {
      title: "Averqon Billing",
      category: "SaaS Product",
      image: "/averqon/invoices.png",
      desc: "A powerful institutional billing and payment management system designed for modern enterprises."
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

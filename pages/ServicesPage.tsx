import React, { useEffect } from 'react';
import { Code, Globe, Search, Smartphone, Shield, BarChart, Cloud } from 'lucide-react';

const ServicesPage: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore Averqons professional services in Web Development, Cloud Computing, Digital Marketing, and UI/UX Branding. We provide scalable digital solutions for modern businesses.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'Web Development, Cloud Services, Cloud Computing, Cloud Migration, Digital Marketing, SEO, UI/UX Design, Branding, Averqon Services, Scalable Solutions, Enterprise Web Apps, Custom Software Development');
    }
  }, []);

  const serviceCategories = [
    {
      title: "Web Development",
      icon: <Code className="w-12 h-12 text-indigo-500" />,
      image: "/services/web-design.png",
      features: [
        "Single Page Applications (React/Next.js)",
        "E-Commerce Solutions (Shopify, Custom)",
        "Progressive Web Apps (PWA)",
        "Content Management Systems",
        "API Integration & Development",
        "WordPress CMS Development",
        "Performance Optimization"
      ]
    },
    {
      title: "Cloud Services",
      icon: <Cloud className="w-12 h-12 text-indigo-400" />,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
      features: [
        "Cloud Hosting & Migration",
        "Managed Infrastructure (AWS/Azure)",
        "Cloud-Based Automation",
        "SaaS Platform Development",
        "Cloud Security & Compliance",
        "Hybrid Cloud Solutions",
        "Serverless Architecture"
      ]
    },
    {
      title: "Digital Marketing",
      icon: <Globe className="w-12 h-12 text-purple-500" />,
      image: "/services/marketing.png",
      features: [
        "Search Engine Optimization (SEO)",
        "Pay-Per-Click (PPC) Management",
        "Social Media Strategy",
        "Content Marketing & Copywriting",
        "Email Marketing Automation",
        "Conversion Rate Optimization (CRO)"
      ]
    },
    {
      title: "UI/UX & Branding",
      icon: <Shield className="w-12 h-12 text-blue-500" />,
      image: "/services/branding.png",
      features: [
        "User Experience Research",
        "Interactive Prototyping",
        "Visual Identity Design",
        "Logo & Brand Guideline Creation",
        "Mobile App Design",
        "Design Systems"
      ]
    }
  ];

  return (
    <div className="bg-transparent text-white">
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-[8rem] font-black mb-12 leading-[0.85]   tracking-tighter">
            What We <br />
            <span className="text-purple-500">Master</span>
          </h1>
          <p className="text-2xl text-white/50 max-w-3xl font-light leading-relaxed">
            We combine strategic thinking with technical mastery to deliver results that don't just look good—they work perfectly.
          </p>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-40">
          {serviceCategories.map((cat, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row gap-20 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 w-full lg:w-1/2">
                <div className="mb-10 transform hover:scale-110 transition-transform duration-300 inline-block bg-purple-600/10 p-4 rounded-2xl border border-purple-500/20">{cat.icon}</div>
                <h2 className="text-4xl md:text-6xl font-black mb-10   tracking-tighter">{cat.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {cat.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-4 text-white/40 hover:text-white transition-colors duration-200 group">
                      <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:scale-150 transition-transform"></div>
                      <span className="text-lg font-light tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full lg:w-1/2 aspect-[4/3] relative group rounded-[40px] overflow-hidden border border-white/10 shadow-2xl glass-card">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0c]/80 via-transparent to-transparent group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-32 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white/20 uppercase tracking-[0.4em] font-black text-xs mb-16">The Engineering Stack</h2>
          <div className="flex flex-wrap justify-center gap-16 md:gap-24">
            {["React", "Next.js", "Node.js", "TailwindCSS", "TypeScript", "PostgreSQL", "Cloudflare"].map((tech, i) => (
              <span key={i} className="text-3xl font-black   text-white/10 hover:text-white/60 transition-colors tracking-tighter">{tech}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;

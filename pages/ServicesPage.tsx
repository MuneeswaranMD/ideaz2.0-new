
import React from 'react';
import { Code, Globe, Search, Smartphone, Shield, BarChart } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const serviceCategories = [
    {
      title: "Web Development",
      icon: <Code className="w-12 h-12 text-indigo-500" />,
      features: [
        "Single Page Applications (React/Next.js)",
        "E-Commerce Solutions (Shopify, Custom)",
        "Progressive Web Apps (PWA)",
        "Content Management Systems",
        "API Integration & Development",
        "Performance Optimization"
      ]
    },
    {
      title: "Digital Marketing",
      icon: <Globe className="w-12 h-12 text-purple-500" />,
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
    <div className="bg-black">
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-8xl font-black mb-8">What We <span className="text-indigo-500">Master</span></h1>
          <p className="text-2xl text-gray-400 max-w-3xl font-light">
            We combine strategic thinking with technical mastery to deliver results that don't just look good—they work perfectly.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {serviceCategories.map((cat, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="mb-6">{cat.icon}</div>
                <h2 className="text-4xl font-bold mb-6">{cat.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-3 text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 relative group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                 <div className="flex items-center justify-center h-full text-white/10 font-black text-6xl uppercase tracking-widest">{cat.title.split(' ')[0]}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-16">Our Modern Stack</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-2xl font-bold">React</span>
            <span className="text-2xl font-bold">Next.js</span>
            <span className="text-2xl font-bold">Node.js</span>
            <span className="text-2xl font-bold">Tailwind</span>
            <span className="text-2xl font-bold">TypeScript</span>
            <span className="text-2xl font-bold">PostgreSQL</span>
            <span className="text-2xl font-bold">Cloudflare</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;

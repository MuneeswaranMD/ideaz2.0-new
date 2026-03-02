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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {serviceCategories.map((cat, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 w-full lg:w-1/2">
                <div className="mb-6 transform hover:scale-110 transition-transform duration-300 inline-block">{cat.icon}</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">{cat.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cat.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform"></div>
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full lg:w-1/2 aspect-[4/3] relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-3xl pointer-events-none group-hover:border-indigo-500/50 transition-colors duration-500"></div>
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

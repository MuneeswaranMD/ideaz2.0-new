import React from 'react';
import { Monitor, Megaphone, Palette, Cloud } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Monitor className="w-10 h-10 text-indigo-500" />,
      title: "Web Design & Development",
      description: "Creating seamless, visually stunning, and responsive websites that deliver exceptional user experiences.",
      image: "/services/web-design.png"
    },
    {
      icon: <Cloud className="w-10 h-10 text-indigo-500" />,
      title: "Cloud Services",
      description: "Scalable cloud infrastructure, migration, and management solutions for the modern enterprise.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
    },
    {
      icon: <Megaphone className="w-10 h-10 text-indigo-500" />,
      title: "Digital Marketing",
      description: "From SEO to social campaigns, we ensure your brand reaches the right audience and drives measurable growth.",
      image: "/services/marketing.png"
    },
    {
      icon: <Palette className="w-10 h-10 text-indigo-500" />,
      title: "Branding & Graphic Design",
      description: "Building memorable brands and visually striking assets that set your business apart from the competition.",
      image: "/services/branding.png"
    }
  ];

  return (
    <section id="services" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-indigo-600/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-indigo-500 font-bold tracking-widest uppercase text-sm mb-4">Our Services</h2>
          <h3 className="text-4xl md:text-5xl font-black mb-6">Empowering Your Business</h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Empowering businesses with technology, creativity, and innovation to thrive in the digital age.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="glass-card flex flex-col rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-500 group border border-white/5"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-10 scale-125">
                  <div className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/50 transition-all duration-300">
                    {service.icon}
                  </div>
                </div>
              </div>

              <div className="p-10 flex-grow">
                <h4 className="text-2xl font-bold mb-4 group-hover:text-indigo-400 transition-colors duration-300">
                  {service.title}
                </h4>
                <p className="text-gray-400 leading-relaxed mb-8">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center text-indigo-400 font-semibold hover:text-indigo-300 transition-all duration-300 group/btn"
                >
                  Learn More
                  <span className="ml-2 transform group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
